import {useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import { useEffect } from 'react';
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
async function loadCriticalData({context, request}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 40,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
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
export default function Collections() {
  /** @type {LoaderReturnData} */
  const { collections } = useLoaderData();
 useEffect(() => {
    document.body.style.background = "linear-gradient(180deg, #412C2C 30%, #130202 66%)";

    return () => {
      document.body.style.background = null;
    };
  }, []);
  return (
    <div className="collections-container mt-[6rem] mx-auto text-white mb-6">
      <h1 className="text-3xl font-bold text-center mb-6 ">Collections</h1>
      <PaginatedResourceSection
        connection={collections}
        resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  mb-6"
      >
        {({ node: collection, index }) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            index={index}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

/**
 * @param {{
 *   collection: CollectionFragment;
 *   index: number;
 * }}
 */
function CollectionItem({collection, index}) {
  return (
    <Link
      className="collection-item text-center border border-white"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
   <Image
   alt={collection.image.altText || collection.title}
   data={{
     ...collection.image,
     url: collection.image.url.replace(/&crop=center/g, ""), // Remove the crop parameter
   }}
   style={{
     borderRadius: "0",
     objectFit: "contain", // Ensures the image fits within the container without cropping
     width: "100%", // Full width of the container
     height: "auto", // Maintain aspect ratio
     borderBottom: "1px solid #fff"
   }}
   loading={index < 3 ? 'eager' : undefined}
 />
 
   
      )}
      <h5 className='mx-auto my-4'>{collection.title}</h5>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
