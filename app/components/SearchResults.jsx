import {Link} from '@remix-run/react';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams} from '~/lib/search';

/**
 * @param {Omit<SearchResultsProps, 'error' | 'type'>}
 */
export function SearchResults({term, result, children}) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

/**
 * @param {PartialSearchResult<'articles'>}
 */
function SearchResultsArticles({term, articles}) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

/**
 * @param {PartialSearchResult<'pages'>}
 */
function SearchResultsPages({term, pages}) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

/**
 * @param {PartialSearchResult<'products'>}
 */function SearchResultsProducts({ term, products }) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <Pagination connection={products}>
        {({ nodes, isLoading, NextLink, PreviousLink }) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            return (
              <div className="product-item" key={product.id}>
                <Link prefetch="intent" to={productUrl} className="product-link">
                  {product.variants.nodes[0].image && (
                    <div className="product-image">
                      <Image
                        data={product.variants.nodes[0].image}
                        alt={product.title}
                           aspectRatio="1/1.3"
                           style={{ borderRadius: "0", border: "#fff 1px solid" }}
                           sizes="(min-width: 45em) 400px, 100vw"
                      />
                    </div>
                  )}
                </Link>
                <div className="product-info">
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.variants.nodes[0].price} />
                  </small>
                </div>
              </div>
            );
          });

          return (
            <div>
              <div>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div className="products-grid">{ItemsMarkup}</div>
              <div>
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
      <br />
    </div>
  );
}



function SearchResultsEmpty() {
  return <p>No results, try a different search.</p>;
}

/** @typedef {RegularSearchReturn['result']['items']} SearchItems */
/**
 * @typedef {Pick<
 *   SearchItems,
 *   ItemType
 * > &
 *   Pick<RegularSearchReturn, 'term'>} PartialSearchResult
 * @template {keyof SearchItems} ItemType
 */
/**
 * @typedef {RegularSearchReturn & {
 *   children: (args: SearchItems & {term: string}) => React.ReactNode;
 * }} SearchResultsProps
 */

/** @typedef {import('~/lib/search').RegularSearchReturn} RegularSearchReturn */
