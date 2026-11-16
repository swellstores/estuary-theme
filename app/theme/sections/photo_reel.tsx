import type { ProductList, SiteInfo, Translate } from 'ui-kit';
import { Container, Eyebrow, Heading, Icon, Image, pricesHiddenFor, Price, sectionColours } from 'ui-kit';

// A sideways reel of the store's products, photo first: tall frames running off the right edge of the screen, each with
// its name and price under it, and a last frame that links to the rest. It scrolls by touch, trackpad or keyboard (the
// reel takes focus) and snaps to each frame; no script. Products come from the store (newest, best selling, a category,
// the page's related products or the cart's); nothing without any.
export const schema = {
  label: 'Photo reel',
  icon: 'gallery',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Small line above the heading' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Best sellers' },
    { id: 'text', type: 'textarea', label: 'Text' },
    { id: 'products', type: 'product_list', label: 'Store products', max: 16, default: { from: 'all', sort: 'best_selling', limit: 8 } },
    { id: 'frame_size', type: 'select', label: 'Frame size', options: ['large', 'medium'], default: 'large' },
    { id: 'shape', type: 'select', label: 'Photo shape', options: ['tall', 'portrait', 'square'], default: 'tall' },
    { id: 'link_label', type: 'text', label: 'Last frame\'s link', default: 'View all' },
    { id: 'link_href', type: 'url', label: 'Last frame\'s address', default: '/products' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
  ],
} as const;

type Words = 'eyebrow' | 'heading' | 'text' | 'frame_size' | 'shape' | 'link_label' | 'link_href' | 'background_colour' | 'text_colour';
type Props = Partial<Record<Words, string>> & { t: Translate; site?: SiteInfo; products?: ProductList | null };

export const styles = `
& .pr{padding:var(--uk-section-md) 0;overflow:hidden}
& .pr-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:var(--uk-space-5);margin-bottom:var(--uk-space-6)}
& .pr-head .uk-heading{margin:0}
& .pr-text{margin:var(--uk-space-3) 0 0;max-width:40em;color:var(--uk-color-text-muted)}
& .pr-hint{display:inline-flex;align-items:center;gap:10px;margin:0;font-size:var(--uk-text-xs);letter-spacing:.14em;text-transform:uppercase;color:var(--uk-color-text-muted)}
& .pr-reel{display:grid;grid-auto-flow:column;grid-auto-columns:var(--pr-w);gap:var(--uk-space-4);margin:0;padding:0 var(--uk-gutter) var(--uk-space-4);list-style:none;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--uk-gutter);scrollbar-width:thin;scrollbar-color:var(--uk-color-line-strong) transparent}
& .pr-reel:focus-visible{outline:2px solid var(--uk-color-accent);outline-offset:-2px}
& .pr-frame{scroll-snap-align:start}
& .pr-link{display:block;color:inherit;text-decoration:none}
& .pr-photo{aspect-ratio:var(--pr-shape);border-radius:0}
& .pr-name{margin:14px 0 2px;font-size:var(--uk-text-md);font-weight:600;line-height:1.3;color:var(--uk-color-heading)}
& .pr-price{margin:0;font-size:var(--uk-text-sm);color:var(--uk-color-text-muted)}
& .pr-end{display:grid;place-items:center;aspect-ratio:var(--pr-shape);border:1px solid var(--uk-color-line-strong);color:var(--uk-color-heading);text-decoration:none;font-family:var(--uk-font-heading);font-size:var(--uk-heading-sm)}
& .pr-end span{display:inline-flex;align-items:center;gap:12px}
@media (prefers-reduced-motion:no-preference){& .pr-photo>img{transition:transform .9s cubic-bezier(.2,.7,.2,1)}& .pr-link:hover .pr-photo>img{transform:scale(1.035)}& .pr-reel{scroll-behavior:smooth}}
@media (max-width:900px){& .pr-head{grid-template-columns:minmax(0,1fr)}& .pr-hint{display:none}& .pr-reel{grid-auto-columns:min(72vw,var(--pr-w));gap:var(--uk-space-3)}}
`;

const shapeOf = (v?: string) => (v === 'portrait' ? '4 / 5' : v === 'square' ? '1 / 1' : '2 / 3');

export default function PhotoReel(p: Props) {
  const { t } = p;
  const items = Array.isArray(p.products?.items) ? p.products!.items.filter((x) => x && typeof x.id === 'string') : [];
  if (!items.length) return null;
  const width = p.frame_size === 'medium' ? 'clamp(200px, 20vw, 300px)' : 'clamp(240px, 27vw, 420px)';
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: p.site?.theme_settings?.apply_page });
  const region = p.heading || t('photo.reel');
  return (
    <section className="pr" style={{ ...sectionColours(p) }}>
      {p.eyebrow || p.heading || p.text ? (
        <Container>
          <div className="pr-head">
            <div>
              {p.eyebrow ? <Eyebrow>{p.eyebrow}</Eyebrow> : null}
              {p.heading ? <Heading>{p.heading}</Heading> : null}
              {p.text ? <p className="pr-text">{p.text}</p> : null}
            </div>
            {t('photo.reel_hint') ? <p className="pr-hint" aria-hidden="true">{t('photo.reel_hint')}<Icon name="arrow" size={16} /></p> : null}
          </div>
        </Container>
      ) : null}
      <ul className="pr-reel" tabIndex={0} aria-label={region || undefined} style={{ '--pr-w': width, '--pr-shape': shapeOf(p.shape) } as Record<string, string>}>
        {items.map((x) => {
          const sold = !!x.price && !x.available;
          return (
            <li key={x.id} className="pr-frame">
              <a className="pr-link" href={x.url}>
                <div className="uk-media pr-photo">
                  {x.image ? <Image image={x.image} alt="" sizes={`(max-width: 900px) 72vw, ${p.frame_size === 'medium' ? 300 : 420}px`} /> : <span style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={40} /></span>}
                </div>
                {p.heading ? <h3 className="pr-name">{x.name}</h3> : <h2 className="pr-name">{x.name}</h2>}
                <p className="pr-price">
                  {hidden ? <span>{hidden.label}</span> : <Price price={x.price} compare={x.compare_at} labels={{ was: t('product.was'), now: t('product.now') }} />}
                  {sold && t('product.sold_out') ? <span style={{ marginLeft: 8 }}>{t('product.sold_out')}</span> : null}
                </p>
              </a>
            </li>
          );
        })}
        {p.link_label ? (
          <li className="pr-frame">
            <a className="pr-end" href={p.link_href || '/products'}><span>{p.link_label}<Icon name="arrow" size={20} /></span></a>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
