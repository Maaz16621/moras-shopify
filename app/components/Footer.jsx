import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa'; // Import icons from react-icons
import { FaX } from 'react-icons/fa6';

/**
 * @param {FooterProps}
 */export function Footer({menu, footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer
            className="
              bg-[#A80202]
              w-full
              text-white
              p-8
              text-center
            "
            style={{ minHeight: '16rem' }}
          >
    <h2  style={{fontSize:'20vw'}} className="
 
  font-bold
  gradient-text
">
  MORUS
</h2>

            <FooterMenu menu={menu}  />
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */

function FooterMenu({ menu, primaryDomainUrl, publicStoreDomain }) {
  return (
    <div className="footer-menu border-t border-b border-white py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <nav className="menu-items flex flex-wrap justify-center md:justify-start space-x-4">
        {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return isExternal ? (
            <a
              href={url}
              key={item.id}
             
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.title}
            </a>
          ) : (
            <NavLink
              end
              key={item.id}
             
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
      <div className="social-icons flex justify-center md:justify-start space-x-4">
        <a href="https://facebook.com" className="hover:text-gray-300" aria-label="Facebook">
          <FaFacebook />
        </a>
       
        <a href="https://instagram.com" className="hover:text-gray-300" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="https://whatsapp.com" className="hover:text-gray-300" aria-label="Instagram">
          <FaWhatsapp />
        </a>
        <a href="https://twitter.com" className="hover:text-gray-300" aria-label="Twitter">
          <FaX />
        </a>
      </div>
    </div>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
