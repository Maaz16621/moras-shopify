import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import { useState } from 'react';
import Logo from '../assets/logo.svg';
import { FaUser, FaSearch, FaShoppingCart } from 'react-icons/fa'; // Import icons from react-icons

/**
 * @param {HeaderProps}
 */

export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  return (
    <header className="header ">
      <div className='header-menu'>
     <div className="header-right">
        <NavLink prefetch="intent" to="/" className="store-name" style={activeLinkStyle} end>
          <img src={Logo} alt="Logo" />
        </NavLink>
      </div>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        publicStoreDomain={publicStoreDomain}
        primaryDomainUrl={header.shop.primaryDomain.url}
        isLoggedIn={isLoggedIn}
        cart={cart}
      >
           
        {/* No need to include HeaderCtas here anymore */}
      </HeaderMenu>
      <div className="header-left">
       
      <SearchToggle />
        <CartToggle cart={cart} />
          <HeaderMenuMobileToggle />
       </div>
       </div>
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 *   isLoggedIn: boolean;
 *   cart: any; 
 * }}
 */

export function HeaderMenu({ menu, primaryDomainUrl, viewport, publicStoreDomain, isLoggedIn, cart }) {
  const className = `header-menu-${viewport}`;
  const categories = [
    { name: "Casual Shirt", link: "/collections/casual-shirt" },
    { name: "Jackets", link: "/collections/jackets" },
    { name: "Hoodies", link: "/collections/hoodies" },
    { name: "Sweat Shirts", link: "/collections/sweat-shirts" },
  ];
  return (
    <nav className={className} role="navigation">
     

    
      <div className="header-menu-items">
     
        <div className="header-menu-item">
          <NavLink
            end
            prefetch="intent"
            style={activeLinkStyle}
            to={'/collections'}
          >
            Collections
          </NavLink>
        </div>
        {categories.map((category, index) => (
          <div key={index} className="header-menu-item">
            <NavLink
              end
              prefetch="intent"
              style={activeLinkStyle}
              to={category.link}
            >
              {category.name}
            </NavLink>
          </div>
        ))}
      
       
     
      </div>
   
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <div>
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
    </div>
  );
}

function HeaderCtas({ isLoggedIn, cart }) {
  return (
    <div className='header-left'>
      <SearchToggle /> {/* Assuming SearchToggle will also handle displaying an icon */}
      <CartToggle cart={cart} /> {/* Cart Toggle, using icons inside this component */}
    </div>
  );
}

function SearchToggle() {
  const { open } = useAside();
  
  return (
    <div className="header-menu-item">
      <button className="reset" onClick={() => open('search')}>
        <FaSearch size={16} /> {/* Search Icon */}
      </button>
    </div>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({ count }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <a
    href="/cart"
    onClick={(e) => {
      e.preventDefault();
      open('cart');
      publish('cart_viewed', {
        cart,
        prevCart,
        shop,
        url: window.location.href || '',
      });
    }}
    className="relative" // To position the cart count relative to the icon
  >
    <FaShoppingCart size={16} /> {/* Cart Icon */}
    
    {/* Cart Count */}
    {count !== null && count > 0 && (
      <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-black rounded-full translate-x-1/2 -translate-y-1/2">
        {count}
      </span>
    )}
  </a>
  
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({ cart }) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <div className="">
          <CartBanner />
        </div>
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
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

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
 {/* {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
    if (!item.url) return null;

    const url =
      item.url.includes('myshopify.com') ||
      item.url.includes(publicStoreDomain) ||
      item.url.includes(primaryDomainUrl)
        ? new URL(item.url).pathname
        : item.url;

    return (
      <div key={item.id} className="header-menu-item">
        <NavLink
          end
          prefetch="intent"
          style={activeLinkStyle}
          to={url}
        >
          {item.title}
        </NavLink>
      </div>
    );
  })} */}
