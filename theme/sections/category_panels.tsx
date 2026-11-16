import type { CollectionData, SiteInfo } from 'ui-kit';
import { Container, Eyebrow, Heading, Image, sectionColours } from 'ui-kit';

// The store's categories as tall photographs set side by side, edge to edge: each one's own image fills its panel, with
// its name large over the foot of the photo and the merchant's link word under it. Three or more panels can also
// stack as wide bands. A category without an image gets the theme's drawn art. Everything comes from the store's
// categories (the top-level ones, or ones picked by hand); nothing without any.
export const schema = {
  label: 'Category panels',
  icon: 'columns',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Small line above the heading' },
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'collections', type: 'collection_list', label: 'Store collections', max: 6, default: { from: 'top', limit: 3 } },
    { id: 'layout', type: 'select', label: 'Layout', options: ['side_by_side', 'bands'], default: 'side_by_side' },
    { id: 'panel_height', type: 'select', label: 'Panel height', options: ['tall', 'medium'], default: 'tall' },
    { id: 'link_label', type: 'text', label: 'Word under each name', default: 'Shop now' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
  ],
} as const;

type Words = 'eyebrow' | 'heading' | 'layout' | 'panel_height' | 'link_label' | 'background_colour' | 'text_colour';
type Props = Partial<Record<Words, string>> & { site?: SiteInfo; collections?: CollectionData[] | null };

export const styles = `
& .cp{padding:var(--uk-section-sm) 0 0}
& .cp--bare{padding-top:0}
& .cp-head{margin-bottom:var(--uk-space-6)}
& .cp-head .uk-heading{margin:0}
& .cp-list{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:2px;margin:0;padding:0;list-style:none}
& .cp--bands .cp-list{grid-auto-flow:row}
& .cp-panel{position:relative;display:block;min-height:min(78svh,820px);color:var(--uk-color-heading);text-decoration:none;overflow:hidden}
& .cp--medium .cp-panel{min-height:min(56svh,560px)}
& .cp--bands .cp-panel{min-height:min(46svh,460px)}
& .cp-photo{position:absolute;inset:0;border-radius:0}
& .cp-photo img{width:100%;height:100%;object-fit:cover}
& .cp-words{position:absolute;left:0;right:0;bottom:0;padding:120px clamp(20px,3vw,40px) clamp(20px,3vw,40px);background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--uk-color-bg) 82%,transparent))}
& .cp--bands .cp-words{top:0;display:flex;flex-direction:column;justify-content:flex-end;max-width:none;background:linear-gradient(90deg,color-mix(in srgb,var(--uk-color-bg) 80%,transparent),transparent 70%)}
& .cp-name{margin:0;font-family:var(--uk-font-heading);font-size:var(--uk-heading-lg);font-weight:500;line-height:1;letter-spacing:-.02em;color:inherit;overflow-wrap:break-word}
& .cp-go{display:inline-block;margin-top:var(--uk-space-3);font-size:var(--uk-text-xs);font-weight:600;letter-spacing:.16em;text-transform:uppercase;border-bottom:1px solid currentColor;padding-bottom:4px}
@media (prefers-reduced-motion:no-preference){& .cp-photo img{transition:transform 1.1s cubic-bezier(.2,.7,.2,1)}& .cp-panel:hover .cp-photo img,& .cp-panel:focus-visible .cp-photo img{transform:scale(1.04)}}
@media (max-width:900px){
& .cp-list{grid-auto-flow:row;grid-auto-columns:auto}
& .cp-panel,& .cp--medium .cp-panel{min-height:0;aspect-ratio:4/5}
& .cp--bands .cp-panel{aspect-ratio:3/2}
& .cp-name{font-size:var(--uk-heading-md)}
}
`;

export default function CategoryPanels(p: Props) {
  const list = (Array.isArray(p.collections) ? p.collections : []).filter((c) => c && typeof c.url === 'string').slice(0, 6);
  if (!list.length) return null;
  const bands = p.layout === 'bands';
  const head = p.eyebrow || p.heading;
  const across = bands ? 1 : list.length;
  return (
    <section className={`cp cp--${p.panel_height === 'medium' ? 'medium' : 'tall'}${bands ? ' cp--bands' : ''}${head ? '' : ' cp--bare'}`} style={{ ...sectionColours(p) }}>
      {head ? (
        <Container>
          <div className="cp-head">
            {p.eyebrow ? <Eyebrow>{p.eyebrow}</Eyebrow> : null}
            {p.heading ? <Heading>{p.heading}</Heading> : null}
          </div>
        </Container>
      ) : null}
      <ul className="cp-list">
        {list.map((c) => (
          <li key={c.slug || c.url}>
            <a className="cp-panel" href={c.url}>
              <div className="uk-media cp-photo">
                {c.image ? <Image image={c.image} alt="" sizes={`(max-width: 900px) 100vw, ${Math.round(100 / across)}vw`} /> : <svg viewBox="0 0 4 5" aria-hidden="true" />}
              </div>
              <div className="cp-words">
                {p.heading ? <h3 className="cp-name">{c.name}</h3> : <h2 className="cp-name">{c.name}</h2>}
                {p.link_label ? <span className="cp-go" aria-hidden="true">{p.link_label}</span> : null}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
