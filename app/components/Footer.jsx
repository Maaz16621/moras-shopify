import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="new-footer-container">
            <div className="footer__wrap">
            <div className="footer-top-container">
  <div className="footer-newsletter">
    <h3>Get the latest trends first</h3>
    <div className="slider-newsletter">
      <form method="post" action="/contact#ContactFooter" id="ContactFooter" accept-charset="UTF-8" className="footer__newsletter newsletter-form">
        <div className="newsletter-form__field-wrapper">
          <div className="field">
            <input
              id="NewsletterForm--template--17615854469311__category_slider_izGV6z"
              type="email"
              name="contact[email]"
              className="field__input"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="newsletter-form__button field__button">
              <svg viewBox="0 0 14 10" fill="none" aria-hidden="true" focusable="false" role="presentation" className="icon icon-arrow">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z" fill="currentColor"></path>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div className="slider-social-icon">
    <ul className="list-unstyled list-social" role="list">
      <li className="list-social__item">
        <a href="https://www.facebook.com/outfitterspk" className="link list-social__link">Facebook</a>
      </li>
      <li className="list-social__item">
        <a href="https://www.instagram.com/outfitters_pk/" className="link list-social__link">Instagram</a>
      </li>
      <li className="list-social__item">
        <a href="https://www.youtube.com/OutfittersOfficial" className="link list-social__link">YouTube</a>
      </li>
      <li className="list-social__item">
        <a href="https://www.tiktok.com/@outfitterspk" className="link list-social__link">TikTok</a>
      </li>
      <li className="list-social__item">
        <a href="https://www.pinterest.com/OutfittersPK/" className="link list-social__link">Pinterest</a>
      </li>
    </ul>
  </div>
</div>

              <div className="footer-bottom-container">
              <div className="footer-logo-container">
      <div className="footer-logo">
        <h1>MORUS</h1>
      </div>
    </div>

  <div className="footer-bottom-wrapper">
    <div className="left-footer-list">
      <ul className="footer_menu_list-ul">
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-faqs">FAQ'S</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="https://outfitters.com.pk/account/login">Log In/Sign Up</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-how-to-buy">How To Buy</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-payment">Payment</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-shipping-deliveries">Shipping & Deliveries</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-exchange-returns">Exchange & Returns</a>
        </li>
      </ul>
    </div>


    <div className="right-footer-list">
      <ul className="footer_menu_list-ul">
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-faqs">FAQ'S</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="https://outfitters.com.pk/account/login">Log In/Sign Up</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-how-to-buy">How To Buy</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-payment">Payment</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-shipping-deliveries">Shipping & Deliveries</a>
        </li>
        <li className="ft-menu-li">
          <a className="ft-menu-link" href="/pages/shopping-guide#link-exchange-returns">Exchange & Returns</a>
        </li>
      </ul>
    </div>
  </div>
</div>

            </div>
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

function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <nav className="footer-menu" role="navigation">
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
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
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
