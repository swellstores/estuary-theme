import type { ReactElement } from 'react';
import type { ProductData, SiteInfo, Translate } from 'ui-kit';
import { Container, Icon, Image, pricesHiddenFor, ProductInfo } from 'ui-kit';

// A product shown photo first: its chosen photo fills a stage the width of the screen (the platform script swaps it for
// the chosen variant's own), the buy panel rises over the stage's lower edge on the right, and the product's other
// photos follow large, two to a row, beside the panel as it holds its place. On phones the stage, the panel and then
// the photos stack. The panel is a column of blocks the merchant orders, hides and adds to (2026-11-25, ui-kit
// ProductInfo: one product form for the price, options, purchase options, quantity and buy buttons wherever they sit).
// By default it is the layout from before blocks, all from the store: the trail, name, a reviews app's rating, price,
// options, purchase options, quantity, buy buttons, up-sells, description, bundle items and attributes; the merchant's
// notes (collapsible rows), promises, text and app blocks go anywhere between them. The theme styles the core blocks
// here (its name, small capital labels and attribute grid). Only the page's own product has the page's h1 and the
// primary form. Nothing without a product but the blocks. The retired fields are what blocks hold now (the quantity
// box, up-sells, attributes, notes).
export const schema = {
  label: 'Product stage',
  icon: 'image',
  fields: [
    { id: 'product', type: 'product', label: 'Product', default: 'current' },
    { id: 'show_quantity', type: 'select', label: 'Quantity box', options: ['show', 'hide'], retired: true },
    { id: 'pairs', type: 'product_list', label: 'Pairs with (the product\'s up-sells)', max: 4, retired: true },
    { id: 'show_attributes', type: 'select', label: 'Product attributes', options: ['show', 'hide'], retired: true },
    { id: 'stage', type: 'select', label: 'Stage height', options: ['tall', 'medium'], default: 'tall' },
    {
      id: 'extras', type: 'list', label: 'Notes on every product (shipping, returns, care)', max: 5, retired: true,
      item: [
        { id: 'label', type: 'text', label: 'Title' },
        { id: 'detail', type: 'textarea', label: 'Text' },
      ],
    },
  ],
  blocks: {
    types: [
      'product_breadcrumbs', 'product_title', 'product_rating', 'product_price', 'variant_picker', 'purchase_options', 'product_quantity', 'add_to_cart',
      'product_description', 'product_specs', 'product_stock', 'collapsible_row', 'text', 'pairs_with', 'bundle_items', 'promises', 'app_block',
    ],
    max: 30,
    default: [
      { type: 'product_breadcrumbs' }, { type: 'product_title' }, { type: 'product_rating' }, { type: 'product_price' }, { type: 'variant_picker' },
      { type: 'purchase_options' }, { type: 'product_quantity' }, { type: 'add_to_cart' }, { type: 'pairs_with', props: { products: { from: 'up_sells', limit: 3 } } },
      { type: 'product_description' }, { type: 'bundle_items' }, { type: 'product_specs' },
    ],
    required: ['add_to_cart'],
    migrate: [
      { block: 'product_quantity', when: { show_quantity: 'hide' }, hide: true },
      { block: 'product_specs', when: { show_attributes: 'hide' }, hide: true },
      { block: 'pairs_with', props: { products: 'pairs' } },
      { add: 'collapsible_row', items: 'extras', props: { title: 'label', text: 'detail' }, set: { open: 'closed' }, after: 'product_specs' },
    ],
  },
} as const;

type Props = { t: Translate; site?: SiteInfo; blocks?: ReactElement[]; product?: ProductData | null; stage?: string };

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
& .ps-panel{position:sticky;top:calc(var(--uk-header-sticky,0px) + 24px);margin-top:calc(-1 * clamp(120px,16vw,240px));padding:clamp(24px,3vw,40px);background:var(--uk-color-surface);border-top:2px solid var(--uk-color-accent);z-index:1}
& .ps-panel [data-block]:empty{display:none}
& .ps-panel [data-block-type="product_title"]>.uk-heading{margin:0;font-family:var(--uk-font-heading);font-size:var(--uk-heading-lg);font-weight:500;line-height:1.04;letter-spacing:-.02em;color:var(--uk-color-heading);text-wrap:wrap}
& .ps-panel .uk-product-rating{margin:var(--uk-space-2) 0 0}
& .ps-panel [data-block-type="product_rating"] .uk-stars{gap:2px;color:var(--uk-color-highlight)}
& .ps-panel [data-block-type="product_rating"] .uk-stars>svg{stroke:none}
& .ps-panel [data-block-type="product_rating"] .uk-stars>svg[fill="none"]{display:none}
& .ps-panel :is(.uk-pairs-heading,.uk-bundle-heading){margin:0 0 var(--uk-space-3);font-size:var(--uk-text-xs);font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--uk-color-text-muted)}
& .ps-panel .uk-specs{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
& .ps-panel .uk-spec-name{letter-spacing:.12em;text-transform:uppercase}
& .ps-panel .uk-product-rows{border-top:0}
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
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page });
  const fit = p.site?.theme_settings?.photo_fit === 'contain' ? 'contain' : 'cover';
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
            <ProductInfo product={item} primary={own} locale={p.site?.locale} pricesHidden={hidden} blocks={p.blocks} />
          </div>
        </div>
      </Container>
    </section>
  );
}
