import {useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import { useEffect } from 'react';
export default function Contact() {
  return (
      <div className="relative z-10 mt-[6rem] sm:px-6 md:px-8 flex flex-col w-full">
        
        {/* Contact Header */}
        <div className="contact-header text-center mb-6">
          <h1 className="text-3xl font-bold">Contact Us for Any Query</h1>
          <p className="text-lg text-gray-300">
            Reach out to our team for any questions or queries you may have.
          </p>
        </div>

        {/* Contact Section */}
        <div className="contact-section container mx-auto p-4 md:p-6 lg:p-8">
          <div className="contact-container grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* Contact Info */}
            <div className="contact-info text-white">
  <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
  <p className="text-lg">
    Fill out the form or drop an email at{" "}
    <a href="mailto:morusclothing@gmail.com" className="text-blue-400 hover:underline">
      morusclothing@gmail.com
    </a>. 
    Our team will get back to you as soon as possible.
  </p>
</div>


            {/* Contact Form */}
            <div className="contact-form p-6 rounded-lg shadow-lg">
              <form id="contactForm">
                
                <div className="form-group mb-4">
                  <label className="block mb-2 font-medium">Your Name</label>
                  <input type="text" id="name" name="name" 
                    className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white" 
                    placeholder="Enter your name" required />
                </div>

                <div className="form-group mb-4">
                  <label className="block mb-2 font-medium">Your Email</label>
                  <input type="email" id="email" name="email" 
                    className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white" 
                    placeholder="Enter your email" required />
                </div>

                <div className="form-group mb-4">
                  <label className="block mb-2 font-medium">Your Subject</label>
                  <input type="text" id="subject" name="subject" 
                    className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white" 
                    placeholder="Enter your subject" required />
                </div>

                <div className="form-group mb-4">
                  <label className="block mb-2 font-medium">Message</label>
                  <textarea id="message" name="message" rows="5" 
                    className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-white" 
                    placeholder="Write your message"></textarea>
                </div>
                <button type="submit" className="btn-submit flex items-center justify-center w-full p-3 bg-[#7A0202] text-white font-bold rounded hover:bg-[#5A0101]">
  <span id="submitText">Send Message</span>
  <svg id="loader" className="hidden animate-spin ml-2 h-5 w-5 text-white" 
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
    <path d="M12 2v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
</button>


              </form>
            </div>
          </div>
        </div>
      </div>
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
