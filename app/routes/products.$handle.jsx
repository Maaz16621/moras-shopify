import {Suspense, useState, useEffect} from 'react';
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
import { FaShoppingBag, FaShoppingCart } from "react-icons/fa";
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
}export default function Product() {
  const { product, relatedProducts } = useLoaderData();
  const selectedVariant = product.selectedVariant;
  const { title, descriptionHtml } = product;

  const [mainImage, setMainImage] = useState(
    product.media.edges[0]?.node.previewImage.url
  );
  const [fade, setFade] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const variantImages = product.media.edges.map((edge) => edge.node.previewImage);

  const sizeOption = product.options.find((option) => option.name === "Size");
  const sizes = sizeOption ? sizeOption.optionValues.map((size) => size.name) : [];

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === "increase" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleImageChange = (imageUrl) => {
    setFade(true); // Trigger fade animation
    setTimeout(() => {
      setMainImage(imageUrl);
      setFade(false); // Reset animation after the transition
    }, 200); // Match this timeout to the CSS animation duration
  };

  useEffect(() => {
    document.body.style.background = "linear-gradient(180deg, #A80202 30%, #7A0202 66%)";

    return () => {
      document.body.style.background = null;
    };
  }, []);

  return (
    <div className="px-5 max-w-5xl mx-auto mt-24">
  {/* Main Product Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-white">
    {/* Left Section: Product Images */}
    <div className="space-y-4">
      {/* Main Image with Fade Animation */}
      <div
        className={`w-full h-102 overflow-hidden rounded-lg bg-gray-200 transition-opacity duration-300 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {variantImages.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              mainImage === variantImages[index].url
                ? "bg-black"
                : "bg-gray-400"
            }`}
            onClick={() => handleImageChange(variantImages[index].url)}
          />
        ))}
      </div>
      {/* Variant Images */}
      <div className="flex  justify-center  gap-2">
        {variantImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.altText || `Image ${index + 1}`}
            className={`w-16 h-16 object-contain rounded-md cursor-pointer ${
              mainImage === image.url ? "border-2 border-black" : ""
            }`}
            onClick={() => handleImageChange(image.url)}
          />
        ))}
      </div>

      {/* Image Dots for Main Image */}
     
    </div>

    {/* Right Section: Product Details */}
    <div className="flex flex-col space-y-6">
      <h1 className="text-4xl font-bold">{title}</h1>
      <ProductPrice
        price={selectedVariant?.price}
        compareAtPrice={selectedVariant?.compareAtPrice}
      />
      <h3 className="text-xl font-semibold">Description</h3>
      <div
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        className="text-justify"
      />

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="font-medium">Size:</span>
          {sizes.map((size, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-md border ${
                selectedSize === size
                  ? "bg-black text-white"
                  : "bg-white text-black border-gray-300"
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-medium">Quantity:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange("decrease")}
            className="w-8 h-8 bg-black text-white rounded-md flex items-center justify-center"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            readOnly
            className="w-12 h-8 text-center bg-gray-100 text-black 
              border border-gray-300 rounded-md"
          />
          <button
            onClick={() => handleQuantityChange("increase")}
            className="w-8 h-8 bg-black text-white rounded-md flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <AddToCartButton
        className="flex items-center w-48 justify-center gap-2 px-4 py-3 border-[1px] border-black bg-[#A80202] text-white rounded-md hover:bg-black hover:text-white transition-all"
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
        <FaShoppingBag />
      </AddToCartButton>
    </div>
  </div>

  {/* Related Products Section */}
  <RelatedProducts relatedProducts={relatedProducts} />
</div>

  );
}
export function RelatedProducts({ relatedProducts }) {
  console.log('relatedProducts:', relatedProducts);

  return (
    <div className="mt-12 mb-12">
      <h2 className="mb-5 text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all">
        {relatedProducts && relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg p-4 text-center text-gray-800 transition-transform duration-300 hover:transform hover:translate-y-[-10px] hover:shadow-xl"
            >
              <img
                src={product.images.edges[0]?.node?.url || 'https://via.placeholder.com/150'}
                alt={product.title}
                className="w-auto mx-auto h-48 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              />
              <h4 className="mt-4 text-lg font-semibold">
                <Link to={`/products/${product.handle}`}>{product.title}</Link>
              </h4>
              <p className="mt-2 text-lg font-medium">
                PKR {product.priceRange?.minVariantPrice.amount}
              </p>
              <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-all">
                <Link to={`/products/${product.handle}`} className="text-white">
                  View Product
                </Link>
              </button>
            </div>
          ))
        ) : (
          <p>No related products found.</p>
        )}
      </div>
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
