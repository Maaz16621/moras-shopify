import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

import { useState, useEffect } from 'react';

import image1 from '../assets/mid1.jpg';  // import image1
import image2 from '../assets/mid2.jpg';  // import image2
import image3 from '../assets/mid3.jpg';
import image4 from '../assets/hero3.webp';
import bottom1 from '../assets/bottom_1.png';
import bottom2 from '../assets/bottom_2.png'
import bottom3 from '../assets/bottom_3.png'
import { Footer } from '~/components/Footer';
import { AddToCartButton } from '~/components/AddToCartButton';
/**
 * @type {MetaFunction}
 */

export const meta = () => {
  return [{title: 'MORUS'}];
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
  const [{collections}, recommendedProducts] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(RECOMMENDED_PRODUCTS_QUERY).catch((error) => {
      console.error(error);
      return null;
    }),
  ]);

  return {
    featuredCollection: collections.nodes[0],
    recommendedProducts: recommendedProducts,
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

    console.log('relatedProducts:', JSON.stringify(recommendedProducts, null, 2));
  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData();


  console.log('relatedProducts:', JSON.stringify(data, null, 2));
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModels, setShowModels] = useState(true);
  const [models, setModels] = useState([
    
    { id: 1, image: 'https://cdn.shopify.com/s/files/1/0726/8538/8018/files/model1.webp?v=1738156377', text: 'Brown Jacket for Men' , stuff:"Leather", size:"Medium, Large, XLarge", url:"/products/jacket-for-men"},
    { id: 2, image: 'https://cdn.shopify.com/s/files/1/0726/8538/8018/files/model2.webp?v=1738156377',  text: 'Black T-Shirt  for Men' , stuff:"Leather", size:"Medium, Large, XLarge",url:""},
    { id: 3, image: 'https://cdn.shopify.com/s/files/1/0726/8538/8018/files/model3.webp?v=1738156377', text: 'Black T-Shirt  for Men' , stuff:"Leather", size:"Medium, Large, XLarge",url:""},
  ]);
  const categories = [
    { name: "Casual Shirt", link: "/collections/casual-shirt" },
    { name: "Jackets", link: "/collections/jackets" },
    { name: "Hoodies", link: "/collections/hoodies" },
    { name: "Sweat Shirts", link: "/collections/sweat-shirts" },
  ];
const [lastModel, setLastModel] = useState(false);
  const handleRightButtonClick = () => {
    
   
   if (activeIndex === 0) {
      setShowModels(false);
      setActiveIndex(1);
    } else if(activeIndex === 1){
      setShowModels(false);
      setActiveIndex(2);
    } else if(activeIndex === 2){
      setShowModels(false);
      
      setLastModel(true);
      setActiveIndex(0);
    }
  };
  const handleLeftButtonClick = () => {
    if (activeIndex === 0) {
      setLastModel(false);
      setShowModels(false);
      setActiveIndex(2);
    } else if (activeIndex === 1) {
      setShowModels(true);
      setActiveIndex(0);
    } else if (activeIndex === 2) {
      setShowModels(false); 
      setActiveIndex(1);
    }
  };
  
  return (
    <div className="home">
<div className="slider-container">
  <div className="hero-bg" />
  <div className={`hero-logo ${showModels ? '' : 'hidden'}`}>
    <span className="letter white" >M</span>
    <span className="letter black" style={{  marginLeft: '-8%'}}>O</span>
    <span className="letter white" style={{  marginLeft: '-8%'}}>R</span>
    <span className="letter black" style={{  marginLeft: '-8%'}}>U</span>
    <span className="letter white" style={{  marginLeft: '-8%'}}>S</span>
  </div>


      {showModels ? (
        <div className="models-container">
          {models.map((model, index) => (
            <div
              key={model.id}
              className={`model-${index + 1} ${activeIndex === index ? 'active' : ''}`}
              oxygen-cache-control="public, max-age=31536000" // cache for 1 year
            >
              <Image   src={model.image} alt={model.text} />
            </div>
          ))}
        </div>
      ) : (
        <div className={`models-container ${showModels ? '' : 'slide-left'}`}>
        <div
        className="model-bg"
        style={{
        backgroundImage: `url(${models[activeIndex].image})`,
      
        }}
        ></div>
        
        {/* Content */}
        <div
        className={`model`}
        >
        <Image 
  key={models[activeIndex].image} 
  src={models[activeIndex].image} 
  alt={models[activeIndex].text} 
   
  style={{
    animation: 'fadeIn 1s ease-in-out'
  }} 
/>
        </div>
        <div className="text-container slide-in">
        <div className={`text-${activeIndex + 1} active-text`}>
        <h2 className='text-2xl sm:text-2xl md:text-4xl  text-white text-uppercase'>{models[activeIndex].text}</h2>
        <p className='text-md text-white sm:text-md md:text-lg lg:text-xl'>Stuff: {models[activeIndex].stuff}</p>
        <p className='text-md text-white sm:text-md md:text-lg lg:text-xl'>Sizes: {models[activeIndex].size}</p>
        <div className='flex gap-4 sm:mt-3 md:mt-6'>
        <Link
  className="bg-black text-white  text-sm sm:text-md px-2 py-2 sm:px-6 sm:py-4 rounded-[15px] uppercase transition-all duration-300 ease-in-out transform hover:bg-white hover:text-black hover:scale-110 hover:shadow-lg"
  to={models[activeIndex].url}
>
  View
</Link>

<AddToCartButton
  className=" px-2 py-2 text-sm sm:text-md sm:px-6 sm:py-4 bg-white text-black border-black rounded-[15px] transition-all duration-300 transform hover:bg-black hover:text-white hover:scale-110"
>
  Add to Cart
</AddToCartButton>

        </div>
        </div>
        </div>
        </div>
        
      
      )}
    {activeIndex < 3 && lastModel == false && (
        <div className="right-button" onClick={handleRightButtonClick}>
          <div className="circle">
            <svg width="24" height="24" viewBox="0 0 32 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
     {activeIndex >= 0 && showModels === false && (
  <div className="left-button" onClick={handleLeftButtonClick}>
    <div className="circle">
      <svg width="24" height="24" viewBox="0 0 32 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M18 5l-7 7 7 7" />
      </svg>
    </div>
  </div>
)}
    </div>
      <div className="section ">
      <div className="w-full overflow-hidden py-2 bg-gradient-to-r to-[#A80202] from-black">
  <div
    className="flex animate-marquee whitespace-nowrap"
    style={{
      animation: "scroll 20s linear infinite",
    }}
  >
    {/* Original Content */}
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>

    {/* Duplicate Content for Seamless Loop */}
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
  </div>
</div>
      <div className="container mx-auto p-4 flex justify-center items-center mt-6">
  <div className="flex flex-col sm:flex-row  gap-6 mx-auto">
    <div className="flex w-auto justify-center ">
      <div className="flex items-end">
        <div className="bg-purple-500 w-1 h-full mr-1"></div>
        <div className="bg-purple-500 w-1 h-3/4 mr-1"></div>
        <div className="bg-purple-500 w-1 h-1/3 mr-1"></div>

        <h2 className="text-3xl font-bold leading-none flex flex-col">
          <span className='text-white'>Best Selling Product</span>
         
        </h2>
      </div>
    </div>
   
  </div>
</div>

 <div className="container mx-auto p-4 flex justify-center items-center w-[85%]">
 <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-4 ">
  {/* Text Box */}
  <div className="order-1 md:order-2 grid grid-rows-[auto_1fr] gap-4 h-full">
    <div
      className="flex justify-center items-center p-4 h-fit rounded-lg shadow-lg bg-opacity-60"
      style={{ backgroundColor: '#1D1C1C' }}
    >
      <p className="text-white">
        MORUS crafts fashion with meticulous care, ensuring 100% deliverance on excellence. Our collection showcases stunning designs, exceptional craftsmanship, and innovative style, blending aesthetics and functionality. Rooted in men's classic style, we pursue perfection, quality, and unique designs with unparalleled customer service.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow min-h-0">
  <div className="w-full flex justify-center items-center rounded-lg shadow-lg h-[250px] sm:h-auto">
    <Image 
      src="https://cdn.shopify.com/s/files/1/0726/8538/8018/files/mid3.webp?v=1738156612"
      className="rounded-lg w-full h-full object-cover object-top"
      alt="Dummy Image"
    />
  </div>
  <div className="w-full flex justify-center items-center rounded-lg shadow-lg h-[250px] sm:h-auto">
    <Image 
      src="https://cdn.shopify.com/s/files/1/0726/8538/8018/files/mid2.webp?v=1738156613"
      className="rounded-lg w-full h-full object-cover  object-top"
      alt="Dummy Image"
    />
  </div>
</div>

  </div>

  {/* Image */}
  <div className="order-2 md:order-1 flex justify-center h-full items-center rounded-lg shadow-lg">
    <Image src="https://cdn.shopify.com/s/files/1/0726/8538/8018/files/mid1.webp?v=1738156613" className="h-full object-cover rounded-lg w-full md:w-auto" alt="Dummy Image" />
  </div>
</div>

</div>

<div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center w-[85%] mt-6">
  <div className="text-left mb-8 md:mb-0">
    <h2 className="text-3xl md:text-5xl font-bold text-white">Shop by Category</h2>
  </div>
  
  <div className="flex flex-wrap justify-start md:justify-end gap-4 w-full md:w-auto">
      {categories.map(({ name, link }) => (
        <Link key={name} to={link} className='mt-4 '>
          <a className="relative overflow-hidden border  border-white text-white py-3 mt-4 px-6 text-base md:text-lg rounded shadow-md transition-all duration-300 ease-in-out before:absolute before:inset-0 before:bg-[#7A0202] before:w-0 before:h-full before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:text-white">
            <span className="relative z-10">{name}</span>
          </a>
        </Link>
      ))}
      <Link to="/collections" className='mt-4'>
        <a className="  px-6 py-3 text-lg font-semibold text-white   bg-gradient-to-r from-[#7A0202] to-red-500 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:from-red-500 hover:to-[#7A0202] hover:shadow-lg">
          See All
        </a>
      </Link>
    </div>

</div>


<div className="container mx-auto justify-center w-[85%] mt-6 p-4">
  <h2 className="text-3xl font-bold text-center text-white mb-8">New Arrivals</h2>
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-white">
  {data.recommendedProducts.products.nodes.slice(0, 4).map((product, index) => (
        <Link to={`/products/${product.handle}`}>
        <div key={product.id} className="group rounded-lg overflow-hidden">
          <div className="relative">
            <img 
              src={product.images.nodes[0].url} 
              alt={product.images.nodes[0].altText || "Product image"} 
              className="w-full h-auto mb-4 rounded-lg" 
            />
            <div className="absolute top-0  rounded-lg left-0 w-full h-full bg-transparent group-hover:bg-black group-hover:opacity-50 transition-all duration-300">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-2xl font-semibold">View</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center md:flex-row">
            <h3 className="text-md md:text-xl font-semibold md:mb-0">{product.title}</h3>
            
          </div>
        </div>
      </Link>
      ))

    }
  </div>
</div>


<div className="container mx-auto p-4 justify-center w-[85%] items-center mb-16 mt-8">
  <div className="w-full mb-8">
    <h2 className="text-3xl md:text-5xl font-bold text-white text-center">Hot Selling</h2>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <img src="https://cdn.shopify.com/s/files/1/0726/8538/8018/files/Image_1.png?v=1737723429" alt="bottom image 1" className="w-full h-auto rounded-xl"/>
    <div className="grid grid-rows-2 items-stretch gap-6">
      <img src="https://cdn.shopify.com/s/files/1/0726/8538/8018/files/Image_2.png?v=1737723428" alt="Image 2" className="w-full h-auto rounded-xl"/>
      <img src="https://cdn.shopify.com/s/files/1/0726/8538/8018/files/Where_every_garment_is_a_masterpiece_crafted_with_love._1_1.png?v=1737723428" alt="Image 3" className="w-full h-auto rounded-xl"/>
    </div>
  </div>
</div>
<div className="w-full overflow-hidden py-2 bg-gradient-to-r to-[#A80202] from-black">

  <div
    className="flex animate-marquee whitespace-nowrap"
    style={{
      animation: "scroll 20s linear infinite",
    }}
  >
    {/* Original Content */}
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>

    {/* Duplicate Content for Seamless Loop */}
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
    <span className="text-white text-lg px-4">
      FLAT 65% OFF ON ALL PRODUCTS - SHOP NOW
    </span>
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
    products(first: 10, sortKey: UPDATED_AT, reverse: true) {
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
