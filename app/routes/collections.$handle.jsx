import {defer, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import { useEffect } from 'react';
import { ProductPrice } from '~/components/ProductPrice';
/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Morus | ${data?.collection.title ?? ''} Collection`}];
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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 40,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();
  useEffect(() => {
    document.body.style.background = "linear-gradient(180deg, #412C2C 30%, #130202 66%)";

    return () => {
      document.body.style.background = null;
    };
  }, []);
  return (
    <div className="collection text-white mb-6">
      <h1 className=' text-4xl text-center mb-2'>{collection.title}</h1>
      <p className=" text-center mb-4">{collection.description}</p>
      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  mb-6"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({ product, loading }) {
  const variantUrl = useVariantUrl(
    product.handle,
    product.variants.nodes[0]?.selectedOptions || []
  );

  // Extract unique colors and sizes from the variants
  const colors = [
    ...new Set(
      product.variants.nodes
        .flatMap(variant =>
          variant.selectedOptions
            .filter(option => option.name === "Color")
            .map(option => option.value)
        )
    ),
  ];
  const sizes = [
    ...new Set(
      product.variants.nodes
        .flatMap(variant =>
          variant.selectedOptions
            .filter(option => option.name === "Size")
            .map(option => option.value)
        )
    ),
  ];

  // Join the first available color and up to 2 sizes
  const displayColor = colors[0] || "N/A";
  const displaySizes = sizes.join(" ") || "N/A";

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1.3"
          data={product.featuredImage}
          loading={loading}
          style={{ borderRadius: "0", border: "#fff 1px solid" }}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4 className="mt-4 uppercase px-2">{product.title}</h4>

      {/* Display color and sizes */}
      <p className="text-sm text-gray-600 px-2">
        {displayColor} | {displaySizes}
      </p>

      <small className="mb-4 px-2">
         <ProductPrice
                price={product.priceRange.minVariantPrice}
                compareAtPrice={product.priceRange.maxVariantPrice}
              />
      </small>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
   
    }
  
    variants(first: 10) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
