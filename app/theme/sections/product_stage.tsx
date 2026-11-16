import type { ReactElement } from 'react';
import type { ProductData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { Breadcrumbs, Container, Icon, Image, pricesHiddenFor, ProductForm, RichText, SellList } from 'ui-kit';

// A product shown photo first: its chosen photo fills a stage the width of the screen (the platform script swaps it for
// the chosen variant's own), the buy panel rises over the stage's lower edge on the right, and the product's other
// photos follow large, two to a row, beside the panel as it holds its place. On phones the stage, the panel and then
// the photos stack. Everything comes from the store: name, photos, price, options, stock, purchase options, up-sells,
// description, bundle items, attributes and a reviews app's rating. The merchant's own notes fold open below the
// buy box. Only the page's own product has the page's h1 and the primary form. Nothing without a product but the text
// blocks.
export const schema = {
  label: 'Product stage',
  icon: 'image',
  fields: [
    { id: 'product', type: 'product', label: 'Product', default: 'current' },
    { id: 'show_quantity', type: 'select', label: 'Quantity box', options: ['show', 'hide'], default: 'show' },
    { id: 'pairs', type: 'product_list', label: 'Pairs with (the product\'s up-sells)', max: 4, default: { from: 'up_sells', limit: 3 } },
    { id: 'show_attributes', type: 'select', label: 'Product attributes', options: ['show', 'hide'], default: 'show' },
    { id: 'stage', type: 'select', label: 'Stage height', options: ['tall', 'medium'], default: 'tall' },
    {
      id: 'extras', type: 'list', label: 'Notes on every product (shipping, returns, care)', max: 5,
      item: [
        { id: 'label', type: 'text', label: 'Title' },
        { id: 'detail', type: 'textarea', label: 'Text' },
      ],
      default: [],
    },
  ],
  blocks: { types: ['text'], max: 4 },
} as const;

type Note = { label?: string; detail?: string };
type Props = Partial<Record<'show_quantity' | 'show_attributes' | 'stage', string>> & {
  t: Translate; site?: SiteInfo; blocks?: ReactElement[]; product?: ProductData | null; pairs?: ProductList | null; extras?: Note[];
};

export const styles = `
& .ps{padding:0 0 var(--uk-section-md)}
& .ps-stage{height:min(84svh,880px);border-radius:0}
& .ps--medium .ps-stage{height:min(64svh,660px)}
& .ps-stage>img{object-fit:var(--ps-fit,cover)}
& .ps-body{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(360px,1fr);gap:clamp(24px,4vw,64px);align-items:start}
& .ps-photos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;margin:var(--uk-space-7) 0 0;padding:0;list-style:none}
& .ps-photos li:first-child:nth-last-child(odd){grid-column:span 2}
& .ps-photo{aspect-ratio:4/5;border-radius:0}
& .ps-photos li:first-child:nth-last-child(odd) .ps-photo{aspect-ratio:3/2}
& .ps-panel{position:sticky;top:calc(var(--uk-header-sticky,0px) + 24px);display:grid;gap:var(--uk-space-5);margin-top:calc(-1 * clamp(120px,16vw,240px));padding:clamp(24px,3vw,40px);background:var(--uk-color-surface);border-top:2px solid var(--uk-color-accent);z-index:1}
& .ps-name{margin:var(--uk-space-3) 0 0;font-family:var(--uk-font-heading);font-size:var(--uk-heading-lg);font-weight:500;line-height:1.04;letter-spacing:-.02em;color:var(--uk-color-heading)}
& .ps-rating{display:flex;align-items:center;gap:10px;margin:var(--uk-space-2) 0 0;font-size:var(--uk-text-sm);color:var(--uk-color-text-muted)}
& .ps-label{margin:0 0 var(--uk-space-3);font-size:var(--uk-text-xs);font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--uk-color-text-muted)}
& .ps-desc{font-size:var(--uk-text-md);color:var(--uk-color-text-muted)}
& .ps-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:var(--uk-space-4);margin:0;padding:var(--uk-space-4) 0;border-top:1px solid var(--uk-color-line);border-bottom:1px solid var(--uk-color-line)}
& .ps-facts dt{font-size:var(--uk-text-xs);letter-spacing:.12em;text-transform:uppercase;color:var(--uk-color-text-muted)}
& .ps-facts dd{margin:var(--uk-space-1) 0 0;font-weight:600;color:var(--uk-color-heading)}
& .ps-bundle{display:grid;gap:6px;margin:0;padding:0;list-style:none;font-size:var(--uk-text-sm)}
@media (max-width:900px){
& .ps-stage,& .ps--medium .ps-stage{height:auto;aspect-ratio:4/5}
& .ps-body{grid-template-columns:minmax(0,1fr)}
& .ps-panel{position:relative;top:0;margin-top:-32px;padding:var(--uk-space-5) var(--uk-space-4)}
& .ps-gallery{order:2}
& .ps-photos{margin-top:var(--uk-space-5)}
}
`;

export default function ProductStage(p: Props) {
  const { t } = p;
  const item = p.product && typeof p.product === 'object' ? p.product : null;
  if (!item) return <>{p.blocks}</>;
  const own = p.site?.page.kind === 'product' && item.url === p.site.page.path;
  const main = item.selected?.image ?? item.image;
  const rest = (Array.isArray(item.images) ? item.images : []).filter((ph) => ph && ph.url && ph.url !== main?.url);
  const notes = (p.extras ?? []).filter((d) => d && (d.label || d.detail));
  const attributes = p.show_attributes === 'hide' ? [] : item.attributes.filter((a) => a.values.length);
  const rating = item.rating && t('product.rating') ? item.rating : null;
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page });
  const fit = p.site?.theme_settings?.photo_fit === 'contain' ? 'contain' : 'cover';
  const labels = {
    add: t('product.add_to_cart'), sold_out: t('product.sold_out'), unavailable: t('product.unavailable'), preorder: t('product.preorder'), backorder: t('product.backorder'),
    was: t('product.was'), now: t('product.now'), quantity: p.show_quantity === 'hide' ? '' : t('common.quantity'), purchase: t('product.purchase_options'), one_time: t('product.one_time'),
    subscribe: t('product.subscribe'), trial: t('product.trial'), save: (percent: number) => t('product.save', { percent }),
    delivered: (every: string) => t('product.delivered', { every }), billed: (every: string) => t('product.billed', { every }),
    payments: (count: number) => t('product.payments', { count }), trial_then: (days: string, price: string) => t('product.trial_then', { days, price }),
    promise: t('product.promise'),
  };
  return (
    <section className={`ps${p.stage === 'medium' ? ' ps--medium' : ''}`}>
      <div className="uk-media ps-stage" style={{ '--ps-fit': fit } as Record<string, string>}>
        {main ? <Image image={main} sizes="100vw" priority variantImage /> : <span style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={80} /></span>}
      </div>
      <Container>
        <div className="ps-body">
          <div className="ps-gallery">
            {rest.length ? (
              <>
                {t('photo.more_photos') ? <h2 className="uk-visually-hidden">{t('photo.more_photos')}</h2> : null}
                <ul className="ps-photos">
                  {rest.map((ph, i) => (
                    <li key={ph.url}>
                      <div className="uk-media ps-photo">
                        <Image image={ph} alt={ph.alt && ph.alt !== item.name ? ph.alt : t('product.photo', { number: i + 2 }) || `${item.name} ${i + 2}`} sizes="(max-width: 900px) 50vw, 30vw" />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <div className="ps-panel">
            <div>
              <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, item.category, { name: item.name, url: item.url }]} label={t('navigation.breadcrumb')} />
              {own ? <h1 className="ps-name">{item.name}</h1> : <h2 className="ps-name">{item.name}</h2>}
              {rating ? (
                <p className="ps-rating">
                  <span aria-hidden="true" style={{ display: 'inline-flex', gap: 2, color: 'var(--uk-color-highlight)' }}>
                    {Array.from({ length: Math.round(Math.min(5, Math.max(0, rating.average))) }, (_, i) => <Icon key={i} name="star" size={16} />)}
                  </span>
                  {t('product.rating', { average: String(Math.round(rating.average * 10) / 10), count: String(rating.count) })}
                </p>
              ) : null}
            </div>
            <ProductForm product={item} labels={labels} primary={own} locale={p.site?.locale} pricesHidden={hidden} />
            {p.blocks}
            {p.pairs?.items?.length ? (
              <div>
                {t('product.pairs_with') ? <h2 className="ps-label">{t('product.pairs_with')}</h2> : null}
                <SellList list={p.pairs} pricesHidden={hidden} labels={{ add: t('product.quick_add'), choose: t('product.choose'), was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }} />
              </div>
            ) : null}
            {item.description.length ? <div className="ps-desc"><RichText value={item.description} /></div> : null}
            {item.bundle.length && t('product.bundle') ? (
              <div>
                <h2 className="ps-label">{t('product.bundle')}</h2>
                <ul className="ps-bundle">
                  {item.bundle.map((b, i) => (
                    <li key={i}>
                      {`${b.quantity} × `}
                      {b.url ? <a href={b.url} style={{ color: 'inherit', textUnderlineOffset: 3 }}>{b.name}</a> : b.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {attributes.length ? (
              <dl className="ps-facts">
                {attributes.map((a) => (
                  <div key={a.id}>
                    <dt>{a.name}</dt>
                    <dd>{a.values.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {notes.length ? (
              <div>
                {notes.map((d, i) => (
                  <details key={i} className="uk-disclosure">
                    <summary>
                      {d.label}
                      <Icon name="chevron" size={18} />
                    </summary>
                    <p>{d.detail}</p>
                  </details>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
