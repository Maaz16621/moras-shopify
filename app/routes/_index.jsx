import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-creative';


// import required modules
import { EffectCreative } from 'swiper/modules';

import {   Mousewheel, Autoplay, Pagination } from 'swiper/modules';
import image1 from '../assets/hero1.jpg';  // import image1
import image2 from '../assets/hero2.jpg';  // import image2
import image3 from '../assets/outfiter.webp';
import image4 from '../assets/hero3.webp';
import bottom1 from '../assets/bottom_1.png';
import bottom2 from '../assets/bottom_2.png'
import bottom3 from '../assets/bottom_3.png'
import { Footer } from '~/components/Footer';
/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
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
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData();

  return (
    <div className="home">
      <div className="slider-container">
        {/* Full-Screen Horizontal Slider */}
        <Swiper
          className="mySwiper swiper-h"
          spaceBetween={0}
          slidesPerView={1}
          navigation={true}
          loop={true} // Looping enabled for horizontal slider
          modules={[EffectCreative]}
          effect={'creative'}
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }}
        >
            <SwiperSlide>
              <img src={image4} alt="Slide 2" />
              </SwiperSlide>

              <SwiperSlide>
                <img src={image1} alt="Slide 2" />
              </SwiperSlide>

          
        

         
        </Swiper>
      </div>
      <div className="section mt-6">
      <div className="container mx-auto p-4 flex justify-center items-center">
  <div className="flex flex-col sm:flex-row w-3/4 justify-between gap-6">
    <div className="flex w-auto justify-center ">
      <div className="flex items-end">
        <div className="bg-purple-500 w-1 h-full mr-1"></div>
        <div className="bg-purple-500 w-1 h-3/4 mr-1"></div>
        <div className="bg-purple-500 w-1 h-1/3 mr-1"></div>

        <h2 className="text-3xl font-bold leading-none flex flex-col">
          <span>Best</span>
          <span>Selling</span>
          <span>Product</span>
        </h2>
      </div>
    </div>
    <div className="parallelogram bg-white w-full ">
      <h2 className="text-center text-2xl underline decoration-gray-500">
        What our customer think about us?
      </h2>
    </div>
  </div>
</div>

 <div className="container mx-auto p-4 flex justify-center items-center">
  <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-4 w-3/4">
    <div className="flex justify-center h-full items-center rounded-lg shadow-lg">
      <img src={image1} className="h-full object-cover rounded-lg w-full md:w-auto" alt="Dummy Image" />
    </div>
    <div className="grid grid-rows-[auto_1fr] gap-4 h-full">
      <div className="flex justify-center items-center p-4 h-fit rounded-lg shadow-lg bg-opacity-60" style={{ backgroundColor: '#1D1C1C' }}>
        <p className="text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow min-h-0">
        <div className="w-full flex justify-center items-center rounded-lg shadow-lg">
          <img src={image2} className="rounded-lg w-full sm:w-auto" alt="Dummy Image" />
        </div>
        <div className="w-full flex justify-center items-center rounded-lg shadow-lg">
          <img src={image2} className="rounded-lg w-full sm:w-auto" alt="Dummy Image" />
        </div>
      </div>
    </div>
  </div>
</div>

<div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center w-3/4 mt-6">
  <div className="text-left mb-8 md:mb-0">
    <h2 className="text-3xl md:text-5xl font-bold text-white">Shop by Category</h2>
  </div>
  
  <div className="flex flex-wrap justify-start md:justify-end gap-4 w-full md:w-auto">
    <button className="border border-white text-white py-3 px-6 text-base md:text-lg rounded shadow-md transition duration-300 ease-in-out hover:shadow-lg hover:bg-gray-900">
      Electronics
    </button>
    <button className="border border-white text-white py-3 px-6 text-base md:text-lg rounded shadow-md transition duration-300 ease-in-out hover:shadow-lg hover:bg-gray-900">
      Fashion
    </button>
    <button className="border border-white text-white py-3 px-6 text-base md:text-lg rounded shadow-md transition duration-300 ease-in-out hover:shadow-lg hover:bg-gray-900">
      Home & Garden
    </button>
    <button className="border border-white text-white py-3 px-6 text-base md:text-lg rounded shadow-md transition duration-300 ease-in-out hover:shadow-lg hover:bg-gray-900">
      Sports
    </button>
    <a href="#" className="text-blue-500 hover:underline mt-2 md:mt-0">See all</a>
  </div>
</div>


<div className="container mx-auto p-4  justify-center w-3/4 mt-6 ">
  <h2 className="text-3xl font-bold text-center mb-8">New Arrivals</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-white ">
    
 
  <div className="group rounded-lg overflow-hidden">
  <div className="relative">
    <img src={image2} alt="Product 4" className="w-full h-auto mb-4 rounded-lg" />

    <div className="absolute top-0  rounded-lg left-0 w-full h-full bg-transparent group-hover:bg-black group-hover:opacity-50 transition-all duration-300">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-2xl font-semibold">View</p>
      </div>
    </div>
  </div>

   <div className="flex justify-between items-center">
    <h3 className="text-sm">Product Name</h3>
    <p className="text-md">PKR3000/-</p>
  </div>
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold">Product Name</h3>
    <p className="text-xs text-blue-500 text-right ">Stock Available</p>
  </div>
</div>
<div className="rounded-lg ">
  <img src={image2} alt="Product 4" className="w-full h-auto mb-4 rounded-lg" />
  <div className="flex justify-between items-center">
    <h3 className="text-sm">Product Name</h3>
    <p className="text-md">PKR3000/-</p>
  </div>
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold">Product Name</h3>
    <p className="text-xs text-blue-500 text-right ">Stock Available</p>
  </div>
</div>
<div className="rounded-lg ">
  <img src={image2} alt="Product 4" className="w-full h-auto mb-4 rounded-lg" />
  <div className="flex justify-between items-center">
    <h3 className="text-sm">Product Name</h3>
    <p className="text-md">PKR3000/-</p>
  </div>
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold">Product Name</h3>
    <p className="text-xs text-blue-500 text-right ">Stock Available</p>
  </div>
</div>
<div className="rounded-lg ">
  <img src={image2} alt="Product 4" className="w-full h-auto mb-4 rounded-lg" />
  <div className="flex justify-between items-center">
    <h3 className="text-sm">Product Name</h3>
    <p className="text-md">PKR3000/-</p>
  </div>
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold">Product Name</h3>
    <p className="text-xs text-blue-500 text-right ">Stock Available</p>
  </div>
</div>
  </div>
</div>
<div className="container mx-auto p-4 justify-center w-3/4 items-center mb-16">
  <div className="w-full md:w-1/2 text-left mb-8">
    <h2 className="text-3xl md:text-5xl font-bold text-white">Hot Selling</h2>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <img src={bottom1} alt="Image 1" className="w-full h-auto rounded-xl"/>
    <div className="grid grid-rows-2 items-stretch gap-6">
      <img src={bottom2} alt="Image 2" className="w-full h-auto rounded-xl"/>
      <img src={bottom3} alt="Image 3" className="w-full h-auto rounded-xl"/>
    </div>
  </div>
</div>

</div>


      <Footer footer={data.footer} header={data.header} publicStoreDomain={data.publicStoreDomain} />
    </div>
  );
}



/**
 * 
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4>{product.title}</h4>
                      <small>
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
