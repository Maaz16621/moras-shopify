import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import { useState, useEffect } from 'react';
import { FaUser, FaSearch, FaShoppingCart } from 'react-icons/fa'; // Import icons from react-icons

/**
 * @param {HeaderProps}
 */
export function HeaderFull({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const [isSticky, setIsSticky] = useState(false); // Track if the navbar is sticky

  // Detect scroll to add/remove sticky class
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header-full ${isSticky ? 'sticky' : ''}`}>
      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '10px 20px'}}>
        <div className="logo">
          <NavLink prefetch="intent" to="/" className="store-name" style={activeLinkStyle} end>
            <h1><strong>{shop.name}</strong></h1>
          </NavLink>
        </div>

        {/* Header Menu for Desktop */}
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          publicStoreDomain={publicStoreDomain}
          primaryDomainUrl={header.shop.primaryDomain.url}
          isLoggedIn={isLoggedIn}
          cart={cart}
        />

        {/* Header CTAs for Cart and Login */}
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({ menu, primaryDomainUrl, publicStoreDomain, isLoggedIn, cart }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track if the menu is open
  const { close } = useAside();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button className="header-menu-mobile-toggle reset" onClick={toggleMenu}>
        <p>{isMenuOpen ? '✖' : '☰'}</p>
      </button>

      {/* Mobile Menu */}
      <nav className={`header-menu-mobile ${isMenuOpen ? 'open' : ''}`} role="navigation">
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;

          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;

          return (
            <div key={item.id} className="header-menu-item">
              <NavLink end onClick={close} prefetch="intent" style={activeLinkStyle} to={url}>
                {item.title}
              </NavLink>
            </div>
          );
        })}
      </nav>

      {/* Desktop Menu */}
      <nav className="header-menu-desktop">
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;

          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;

          return (
            <div key={item.id} className="header-menu-item">
              <NavLink end prefetch="intent" style={activeLinkStyle} to={url}>
                {item.title}
              </NavLink>
            </div>
          );
        })}
      </nav>
    </>
  );
}

function HeaderCtas({ isLoggedIn, cart }) {
  return (
    <div className='header-left'>
      <SearchToggle />
      <CartToggle cart={cart} />
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
    >
      <FaShoppingCart size={16} /> {/* Cart Icon */}
      {count !== null && count > 0 && (
        <span className="cart-count">{count}</span> // Show count if available
      )}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
      <div className="header-menu-item">
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
    color: isPending ? 'grey' : 'black',
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
