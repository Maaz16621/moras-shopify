import {Suspense, useState} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import { Link } from '@remix-run/react';
import {Await, useLoaderData} from '@remix-run/react';
import { CartForm } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
} from '@shopify/hydrogen';
import {getVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({ context, params, request }) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }, { products }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
    storefront.query(RELATED_PRODUCTS_QUERY, {
      variables: { handle },
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title'
    )
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({ product, request });
    }
  }
  const relatedProducts = products;

  // Ensure relatedProducts is passed correctly
  return {
    product,
    relatedProducts: relatedProducts.edges.map((edge) => edge.node),
  };
}


/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context, params}) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    variants,
  };
}

/**
 * @param {{
 *   product: ProductFragment;
 *   request: Request;
 * }}
 */
function redirectToFirstVariant({product, request}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const { product, relatedProducts, variants} = useLoaderData();
  console.log(useLoaderData());
  const selectedVariant = product.selectedVariant;
  const { title, descriptionHtml } = product;
  
  const [mainImage, setMainImage] = useState(
    product.media.edges[0]?.node.previewImage.url
  );
  const [quantity, setQuantity] = useState(1);
  const variantImages = product.media.edges.map((edge) => edge.node.previewImage);

  // Handle increase and decrease of quantity
  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "increase" ? prev + 1 : Math.max(1, prev - 1)));
  };
  const sizeOption = product.options.find(option => option.name === 'Size');
  const sizes = sizeOption ? sizeOption.optionValues.map(size => size.name) : [];
  // Handle add to cart action
  const handleAddToCart = () => {
    console.log("Adding to cart:", {
      productId: product.id,
      quantity,
      variantId: selectedVariant.id,
    });
    alert("Product added to cart!");
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "100px auto",
      }}
    >
      {/* Main Product Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "40px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          padding: "20px",
          color: "#333",
        }}
      >
        {/* Left Section: Product Images */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
          }}
        >
          {/* Variant Images */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {variantImages.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Image ${index + 1}`}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  border: mainImage === image.url ? "2px solid #000" : "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>
  
          {/* Main Image */}
          <div
            style={{
              width: "100%",
              height: "500px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <img
              src={mainImage}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
  
        {/* Right Section: Product Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              margin: 0,
            }}
          >
            {title}
          </h1>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
          <h3>Description</h3>
          <div
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            style={{
              textAlign: "justify",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {sizes.length > 0 && (
              <div>
                <span>Size:</span>
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      backgroundColor: selectedSize === size ? "#000" : "#fff",
                      color: selectedSize === size ? "#fff" : "#333",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
  
          {/* Quantity Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>Quantity:</span>
            <div
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => handleQuantityChange("decrease")}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                readOnly
                style={{
                  width: "50px",
                  backgroundColor: "#f9f9f9",
                  color: "#333",
                }}
              />
              <button
                onClick={() => handleQuantityChange("increase")}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          </div>
  
          {/* Add to Cart Button */}
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: quantity,
                      selectedVariant,
                    },
                  ]
                : []
            }
          >
            {selectedVariant?.availableForSale ? "Add to cart" : "Sold out"}
          </AddToCartButton>
        </div>
      </div>
      <RelatedProducts relatedProducts={relatedProducts} />
      {/* Related Products Section */}
     
    </div>
  );
  
         
  
}


export function RelatedProducts({ relatedProducts }) {
  console.log('relatedProducts:', relatedProducts);

  return (
    <div style={{ marginTop: '50px' }}>
      <h2 style={{ marginBottom: '20px' }}>Related Products</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)', // 4 cards for desktop
          gap: '20px',
          transition: 'grid-template-columns 0.3s ease',
        }}
      >
        {relatedProducts && relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                padding: '10px',
                textAlign: 'center',
                color: '#333',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Animation for hover
              }}
              className="product-card"
            >
              <img
                src={product.images.edges[0]?.node?.url || 'https://via.placeholder.com/150'}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  transition: 'transform 0.3s ease', // Image hover animation
                }}
              />
              <h4>
                <Link to={`/products/${product.handle}`}>{product.title}</Link>
              </h4>
              <p>
                PKR {product.priceRange?.minVariantPrice.amount} 
              </p>
              <button
                style={{
                  padding: '10px',
                  borderRadius: '5px',
                  backgroundColor: '#000',
                  color: '#fff',
                  cursor: 'pointer',
                  border: '1px solid #000',
                  transition: 'background-color 0.3s ease',
                }}
              >
                <Link
                  to={`/products/${product.handle}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  View Product
                </Link>
              </button>
            </div>
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>
      <style>
        {`
          .product-card:hover {
            transform: translateY(-10px); /* Move card up on hover */
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Enhanced shadow */
          }

          .product-card:hover img {
            transform: scale(1.05); /* Scale image on hover */
          }

          @media (max-width: 1024px) {
            .product-card {
              grid-template-columns: repeat(2, 1fr); /* 2 cards for tablets */
            }
          }

          @media (max-width: 600px) {
            .product-card {
              grid-template-columns: 1fr; /* 1 card for mobile */
            }
          }
        `}
      </style>
    </div>
  );
}




const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image  {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    
    options {
      name
      optionValues {
        name
      }
    }
      media(first: 10) {
      edges {
        node {
          ... on MediaImage {
            id
            previewImage{
            url
            }
           
          }
        }
      }
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;
const RELATED_PRODUCTS_QUERY = `#graphql
query RelatedProducts($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    images(first: 1) {
      edges {
        node {
          url
        }
      }
    }
    
  }
  products(first: 4, query: $handle) {
    edges {
      node {
        id
        title
        handle
        priceRange{
          minVariantPrice{
            amount
          }
           maxVariantPrice{
            amount
          }
        }
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
        
      }
    }
  }
}
`;



/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').SelectedOption} SelectedOption */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
