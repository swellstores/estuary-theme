import { useId } from 'react';
import type { ProductData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { ActiveFilters, CardRating, Container, Eyebrow, FilterForm, Heading, Icon, Image, Pagination, pricesHiddenFor, Price, QuickAdd, sectionColours, SortSelect } from 'ui-kit';

// The store's products as a wall of photographs: tiles set edge to edge with a hairline between them, the first one
// optionally twice the size, each product's name and price laid over the foot of its photo (or under it: the theme's
// "card_words" setting), with its rating under them (only from a reviews app). On a collection page's own list it also
// carries the count, sort, folded filters and pages, all plain links and forms. The second photo on hover and a quick
// add button are the theme's settings, the same on every grid. Nothing without products, except a collection's own
// empty text.
export const schema = {
  label: 'Photo grid',
  icon: 'grid',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Small line above the heading' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'New in' },
    { id: 'link_label', type: 'text', label: 'Link label', default: 'View all' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/products' },
    { id: 'products', type: 'product_list', label: 'Store products', max: 48, filters: true, default: { from: 'all', sort: 'newest', limit: 9 } },
    { id: 'layout', type: 'select', label: 'Arrangement', options: ['first_large', 'even'], default: 'first_large' },
    { id: 'columns', type: 'select', label: 'Photos across on wide screens', options: ['3', '4', '2'], default: '3' },
    { id: 'shape', type: 'select', label: 'Photo shape', options: ['tall', 'portrait', 'square'], default: 'portrait' },
    { id: 'edge', type: 'select', label: 'Width', options: ['full', 'contained'], default: 'full' },
    { id: 'gap', type: 'select', label: 'Space between photos', options: ['hairline', 'none', 'wide'], default: 'hairline' },
    { id: 'show_count', type: 'select', label: 'Product count (a collection page)', options: ['show', 'hide'], default: 'show' },
    { id: 'show_sort', type: 'select', label: 'Sort (a collection page)', options: ['show', 'hide'], default: 'show' },
    { id: 'show_filters', type: 'select', label: 'Filters (a collection page)', options: ['show', 'hide'], default: 'show' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Words = 'eyebrow' | 'heading' | 'link_label' | 'link_href' | 'layout' | 'columns' | 'shape' | 'edge' | 'gap' | 'show_count' | 'show_sort' | 'show_filters' | 'background_colour' | 'text_colour' | 'accent_colour';
type Props = Partial<Record<Words, string>> & { t: Translate; site?: SiteInfo; products?: ProductList | null };

export const styles = `
& .pg{padding:var(--uk-section-sm) 0}
& .pg-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;column-gap:24px;row-gap:12px;margin-bottom:var(--uk-space-6)}
& .pg-head .uk-heading{margin:0}
& .pg-more{font-size:var(--uk-text-sm);font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-decoration:underline;text-underline-offset:8px;text-decoration-thickness:1px;color:inherit}
& .pg-bar{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;padding-bottom:var(--uk-space-4);border-bottom:1px solid var(--uk-color-line)}
& .pg-count{margin:0;font-size:var(--uk-text-sm);color:var(--uk-color-text-muted)}
& .pg-list{display:grid;grid-template-columns:repeat(var(--pg-cols),minmax(0,1fr));gap:var(--pg-gap);margin:0;padding:0;list-style:none}
& .pg-list--main{margin-top:var(--uk-space-6)}
& .pg-item{position:relative;display:flex;flex-direction:column;min-width:0}
& .pg-item--lead{grid-column:span 2;grid-row:span 2}
& .pg-tile{position:relative;display:flex;flex-direction:column;flex:1 1 auto;color:inherit;text-decoration:none}
& .pg-photo{aspect-ratio:var(--pg-shape);border-radius:0}
& .pg-item--lead .pg-photo{flex:1 1 auto;aspect-ratio:auto;min-height:100%}
& .pg-words--below .pg-item--lead .pg-photo{min-height:0}
& .pg-alt{position:absolute;inset:0;opacity:0;transition:opacity .4s}
& .pg-alt img{width:100%;height:100%;object-fit:cover}
& .pg-tile:hover .pg-alt,& .pg-tile:focus-visible .pg-alt{opacity:1}
& .pg-cap{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;column-gap:16px;row-gap:2px;padding:12px 2px 0}
& .pg-words--over .pg-cap{position:absolute;left:0;right:0;bottom:0;padding:56px 20px 16px;background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--uk-color-bg) 78%,transparent));color:var(--uk-color-heading)}
& .pg-name{margin:0;font-size:var(--uk-text-md);font-weight:600;line-height:1.3;color:inherit}
& .pg-item--lead .pg-name{font-family:var(--uk-font-heading);font-size:var(--uk-heading-md);font-weight:500;line-height:1.1}
& .pg-price{margin:0;font-size:var(--uk-text-sm);color:var(--uk-color-text-muted)}
& .pg-words--over .pg-price{color:inherit;opacity:.9}
& .pg-sold{margin-left:8px}
& .uk-card-rating{display:flex;flex-basis:100%;align-items:center;gap:6px;margin:2px 0 0;font-size:var(--uk-text-xs);color:var(--uk-color-text-muted);line-height:inherit}
& .pg-words--over .uk-card-rating{color:inherit}
& .uk-card-rating .uk-stars{gap:2px;color:var(--uk-color-highlight)}
& .pg-words--over .uk-card-rating .uk-stars{color:inherit}
& .uk-card-rating .uk-stars>svg{stroke:none}
& .uk-card-rating .uk-stars>svg[fill="none"]{display:none}
& .pg-add{padding:10px 0 0}
& .pg-empty{margin:var(--uk-space-6) 0 0;font-size:var(--uk-text-md);color:var(--uk-color-text-muted)}
& .pg-pages{margin-top:var(--uk-space-7)}
@media (prefers-reduced-motion:no-preference){& .pg-photo>img{transition:transform .9s cubic-bezier(.2,.7,.2,1)}& .pg-tile:hover .pg-photo>img{transform:scale(1.035)}}
@media (max-width:900px){
& .pg-list{grid-template-columns:repeat(2,minmax(0,1fr))}
& .pg-item--lead{grid-row:auto}
& .pg-item--lead .pg-photo{aspect-ratio:4/5;min-height:0}
& .pg-words--over .pg-cap{padding:40px 12px 10px}
& .pg-name,& .pg-item--lead .pg-name{font-size:var(--uk-text-sm);font-family:inherit;font-weight:600}
& .pg-price{font-size:var(--uk-text-xs)}
}
`;

const shapeOf = (v?: string) => (v === 'tall' ? '2 / 3' : v === 'square' ? '1 / 1' : '4 / 5');
const gapOf = (v?: string) => (v === 'none' ? '0px' : v === 'wide' ? 'var(--uk-space-5)' : '2px');

function Tile({ p, t, lead, level, sizes, priority, swap, pricesHidden }: {
  p: ProductData; t: Translate; lead: boolean; level: 2 | 3; sizes: string; priority: boolean; swap: boolean;
  pricesHidden: ReturnType<typeof pricesHiddenFor>;
}) {
  const sold = !!p.price && !p.available;
  const second = swap && p.image ? (p.images ?? []).find((i) => i && i.url && i.url !== p.image?.url) : undefined;
  return (
    <a className="pg-tile" href={p.url}>
      <div className="uk-media pg-photo">
        {p.image ? <Image image={p.image} alt="" sizes={sizes} priority={priority} /> : <span style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={lead ? 64 : 40} /></span>}
        {second ? <span className="pg-alt"><Image image={second} alt="" sizes={sizes} /></span> : null}
      </div>
      <div className="pg-cap">
        {level === 3 ? <h3 className="pg-name">{p.name}</h3> : <h2 className="pg-name">{p.name}</h2>}
        <p className="pg-price">
          {pricesHidden ? <span>{pricesHidden.label}</span> : <Price price={p.price} compare={p.compare_at} labels={{ was: t('product.was'), now: t('product.now') }} />}
          {sold && t('product.sold_out') ? <span className="pg-sold">{t('product.sold_out')}</span> : null}
        </p>
        <CardRating rating={p.rating} label={(average, count) => t('product.rated', { average, count })} />
      </div>
    </a>
  );
}

export default function PhotoGrid(p: Props) {
  const { t } = p;
  const anchor = useId();
  const list = p.products && typeof p.products === 'object' ? p.products : null;
  const items = Array.isArray(list?.items) ? list.items.filter((x) => x && typeof x.id === 'string') : [];
  const main = !!list && Array.isArray(list.sort_options) && list.sort_options.length > 0;
  const chosen = main && Array.isArray(list.active_filters) ? list.active_filters.length : 0;
  const none = !items.length && !chosen;
  if (none && (!main || !t('collection.empty'))) return null;
  const columns = ['2', '3', '4'].includes(p.columns ?? '') ? Number(p.columns) : 3;
  const lead = p.layout !== 'even' && items.length > columns;
  const ts = p.site?.theme_settings ?? {};
  const words = ts.card_words === 'below' ? 'below' : 'over';
  const swap = ts.card_second_photo !== false;
  const quick = ts.card_quick_add === true;
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: ts.apply_page });
  const full = p.edge !== 'contained';
  const head = p.eyebrow || p.heading || p.link_label;
  const level: 2 | 3 = p.heading ? 3 : 2;
  const filters = main && !none && p.show_filters !== 'hide' && (list.filters.length > 0 || chosen > 0);
  const countText = main && p.show_count !== 'hide' ? t('collection.count', { count: list.total }) : '';
  const vw = Math.round(100 / columns);
  const sizes = full ? `(max-width: 900px) 50vw, ${vw}vw` : `(max-width: 900px) calc(50vw - 24px), ${Math.round(1600 / columns)}px`;
  const leadSizes = full ? `(max-width: 900px) 100vw, ${vw * 2}vw` : '(max-width: 900px) calc(100vw - 48px), 1100px';
  const grid = items.length ? (
    <ul
      className={`pg-list pg-words--${words}${main ? ' pg-list--main' : ''}`}
      style={{ '--pg-cols': String(columns), '--pg-gap': gapOf(p.gap), '--pg-shape': shapeOf(p.shape) } as Record<string, string>}
    >
      {items.map((x, i) => (
        <li key={x.id} className={lead && i === 0 ? 'pg-item pg-item--lead' : 'pg-item'}>
          <Tile p={x} t={t} lead={lead && i === 0} level={level} sizes={lead && i === 0 ? leadSizes : sizes} priority={main ? i < columns : false} swap={swap} pricesHidden={hidden} />
          {quick ? <div className="pg-add"><QuickAdd product={x} full pricesHidden={hidden} labels={{ add: t('product.quick_add'), choose: t('product.choose') }} /></div> : null}
        </li>
      ))}
    </ul>
  ) : null;
  return (
    <section id={main ? anchor : undefined} className="pg" style={{ paddingTop: head || main ? undefined : 0, ...sectionColours(p) }}>
      {head || main ? (
        <Container>
          {head ? (
            <div className="pg-head">
              <div>
                {p.eyebrow ? <Eyebrow>{p.eyebrow}</Eyebrow> : null}
                {p.heading ? <Heading>{p.heading}</Heading> : null}
              </div>
              {p.link_label ? <a className="pg-more" href={p.link_href || '/products'}>{p.link_label}</a> : null}
            </div>
          ) : null}
          {none ? <p className="pg-empty">{t('collection.empty')}</p> : null}
          {main && !none ? (
            <div className="pg-bar">
              {countText ? <p className="pg-count">{countText}</p> : <span />}
              {p.show_sort !== 'hide' ? (
                <SortSelect
                  list={list}
                  anchor={anchor}
                  labels={{
                    label: t('sort.label'), apply: t('common.apply'), featured: t('sort.featured'), best_selling: t('sort.best_selling'), newest: t('sort.newest'),
                    price_asc: t('sort.price_low'), price_desc: t('sort.price_high'), name: t('sort.name'),
                  }}
                />
              ) : null}
            </div>
          ) : null}
          {filters && t('filter.button') ? (
            <>
              <details className="uk-disclosure">
                <summary>
                  {chosen ? `${t('filter.button')} (${chosen})` : t('filter.button')}
                  <Icon name="chevron" size={18} />
                </summary>
                <div style={{ maxWidth: 560 }}>
                  <FilterForm list={list} anchor={anchor} active={false} labels={{ apply: t('common.apply'), min: t('filter.min'), max: t('filter.max'), count: t('filter.count_word'), remove: t('filter.remove') }} />
                </div>
              </details>
              <ActiveFilters list={list} labels={{ remove: t('filter.remove') }} anchor={anchor} />
            </>
          ) : null}
          {!full ? grid : null}
          {main && !none && !items.length && t('filter.empty') ? <p className="pg-empty">{t('filter.empty')}</p> : null}
        </Container>
      ) : !full ? <Container>{grid}</Container> : null}
      {full ? grid : null}
      {main && list.pages > 1 && (list.prev_url || list.next_url) ? (
        <Container>
          <div className="pg-pages">
            <Pagination list={list} prev={t('pagination.previous')} next={t('pagination.next')} label={t('pagination.label')} page={t('pagination.page')} of={t('pagination.of')} anchor={anchor} />
          </div>
        </Container>
      ) : null}
    </section>
  );
}
