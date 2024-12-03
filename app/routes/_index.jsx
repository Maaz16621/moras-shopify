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
import video1 from '../assets/video1.mp4';
import video2 from '../assets/video2.mp4';
import video3 from '../assets/video3.mp4';
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
            <Swiper
              className="mySwiper2 swiper-v"
              direction={'vertical'}
              spaceBetween={50} // Adjust space between slides as needed
              mousewheel={true}
              loop={false} // Disable looping for vertical slides
              modules={[Mousewheel, EffectCreative]}
              effect={'creative'}
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: [0, 0, -400],
                },
                next: {
                  translate: [0, '100%', 0],
                },
              }}
            >
              <SwiperSlide>
                <img src={image1} alt="Slide 1" />
              </SwiperSlide>

              <SwiperSlide>
                <div className="video-slide">
                  <video autoPlay muted loop className="video-background">
                    <source src={video1} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="video-slide">
                  <video autoPlay muted loop className="video-background">
                    <source src={video2} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="video-slide">
                  <video autoPlay muted loop className="video-background">
                    <source src={video3} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </SwiperSlide>

              {/* Last slide: Footer */}
              <SwiperSlide className="footer-slide">
                <Footer footer={data.footer} header={data.header} publicStoreDomain={data.publicStoreDomain} />
              </SwiperSlide>
            </Swiper>
          </SwiperSlide>

          <SwiperSlide>
            <Swiper
              className="mySwiper2 swiper-v"
              direction={'vertical'}
              spaceBetween={50}  // Adjust space between slides as needed
              mousewheel={true}
              loop={false} // Disable looping for vertical slides
              effect={'creative'}
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: [0, 0, -400],
                },
                next: {
                  translate: [0, '100%', 0],
                },
              }}
              modules={[Mousewheel, EffectCreative]}
            >
              <SwiperSlide>
                <img src={image2} alt="Slide 2" />
              </SwiperSlide>

              <SwiperSlide>
                <div className="video-slide">
                  <video autoPlay muted loop className="video-background">
                    <source src={video1} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="video-slide">
                  <video autoPlay muted loop className="video-background">
                    <source src={video2} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="video-slide">
                  <video autoPlay muted loop className="video-background">
                    <source src={video3} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </SwiperSlide>

              {/* Last slide: Footer */}
              <SwiperSlide className="footer-slide">
                <Footer footer={data.footer} header={data.header} publicStoreDomain={data.publicStoreDomain} />
              </SwiperSlide>
            </Swiper>
          </SwiperSlide>

          <SwiperSlide>
            <Swiper
              className="mySwiper2 swiper-v"
              direction={'vertical'}
              spaceBetween={50} // Adjust space between slides as needed
              mousewheel={true}
              loop={false} // Disable looping for vertical slides
              modules={[Mousewheel, EffectCreative]}
              effect={'creative'}
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: [0, 0, -400],
                },
                next: {
                  translate: [0, '100%', 0],
                },
              }}
            >
              <SwiperSlide><img src={image3} alt="Slide 3" /></SwiperSlide>
              {/* Last slide: Footer */}
              <SwiperSlide className="footer-slide">
                <Footer footer={data.footer} header={data.header} publicStoreDomain={data.publicStoreDomain} />
              </SwiperSlide>
            </Swiper>
          </SwiperSlide>
        </Swiper>
      </div>
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
