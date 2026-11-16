import type { CollectionData, Translate } from 'ui-kit';
import { Breadcrumbs, Container, Image } from 'ui-kit';

// A category's opening: its own image edge to edge under its trail (Home › parent › it), name and description, with its
// subcategories as links along the foot. On a collection page it is the page's own category by default. Without an
// image the name is set large on a plain band instead; without a category, the heading and text written here (nothing
// when they are empty).
export const schema = {
  label: 'Collection cover',
  icon: 'image',
  fields: [
    { id: 'collection', type: 'collection', label: 'Collection', default: 'current' },
    { id: 'heading', type: 'text', label: 'Heading (when there is no collection)' },
    { id: 'description', type: 'textarea', label: 'Text (when there is no collection)' },
    { id: 'height', type: 'select', label: 'Height with an image', options: ['tall', 'short'], default: 'tall' },
    { id: 'show_children', type: 'select', label: 'Subcategories', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

type Props = { t: Translate; collection?: CollectionData | null; heading?: string; description?: string; height?: string; show_children?: string };

export const styles = `
& .cc{position:relative;padding:0;overflow:hidden}
& .cc-frame{position:relative;display:flex;align-items:flex-end;min-height:min(68svh,720px)}
& .cc--short .cc-frame{min-height:min(44svh,440px)}
& .cc--plain .cc-frame{min-height:0;border-bottom:1px solid var(--uk-color-line)}
& .cc-photo{position:absolute;inset:0;border-radius:0}
& .cc-photo img{width:100%;height:100%;object-fit:cover}
& .cc-shade{position:absolute;inset:0;background:linear-gradient(180deg,color-mix(in srgb,var(--uk-color-bg) 30%,transparent),transparent 22%,color-mix(in srgb,var(--uk-color-bg) 72%,transparent) 52%,color-mix(in srgb,var(--uk-color-bg) 92%,transparent))}
& .cc-copy{position:relative;width:100%;padding:var(--uk-space-9) 0 var(--uk-space-7);color:var(--uk-color-heading)}
& .cc--plain .cc-copy{padding:var(--uk-space-8) 0 var(--uk-space-6)}
& .cc-title{margin:var(--uk-space-3) 0 0;font-family:var(--uk-font-heading);font-size:var(--uk-heading-display);font-weight:500;line-height:.98;letter-spacing:-.025em;color:inherit;overflow-wrap:break-word}
& .cc-text{margin:var(--uk-space-4) 0 0;max-width:46em;font-size:var(--uk-text-lg);color:var(--uk-color-ink)}
& .cc-kids{display:flex;flex-wrap:wrap;gap:8px 28px;margin:var(--uk-space-6) 0 0;padding:var(--uk-space-4) 0 0;list-style:none;border-top:1px solid var(--uk-color-line-strong)}
& .cc-kids a{font-size:var(--uk-text-sm);font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:inherit;text-decoration:none}
& .cc-kids a:hover{text-decoration:underline;text-underline-offset:6px}
@media (max-width:900px){& .cc-frame{min-height:min(60svh,520px)}& .cc--short .cc-frame{min-height:min(40svh,340px)}& .cc-text{font-size:var(--uk-text-md)}}
`;

export default function CollectionCover({ t, collection, heading, description, height, show_children }: Props) {
  const c = collection && typeof collection === 'object' ? collection : null;
  const title = c ? c.name : heading;
  const text = c ? (Array.isArray(c.description) ? c.description.map((b) => b.text).filter(Boolean) : []) : description ? [description] : [];
  const image = c?.image ?? null;
  const children = c && show_children !== 'hide' && Array.isArray(c.children) ? c.children : [];
  if (!title && !text.length && !image) return null;
  return (
    <section className={`cc ${image ? `cc--${height === 'short' ? 'short' : 'tall'}` : 'cc--plain'}`}>
      <div className="cc-frame">
        {image ? (
          <>
            <div className="uk-media cc-photo"><Image image={image} alt="" sizes="100vw" priority /></div>
            <div className="cc-shade" />
          </>
        ) : null}
        <div className="cc-copy">
          <Container>
            {c ? <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, c.parent, { name: c.name, url: c.url }]} label={t('navigation.breadcrumb')} /> : null}
            {title ? <h1 className="cc-title">{title}</h1> : null}
            {text.slice(0, 3).map((x, i) => <p key={i} className="cc-text">{x}</p>)}
            {children.length ? (
              <nav aria-label={t('collection.subcategories') || undefined}>
                <ul className="cc-kids">
                  {children.map((k) => <li key={k.slug}><a href={k.url}>{k.name}</a></li>)}
                </ul>
              </nav>
            ) : null}
          </Container>
        </div>
      </div>
    </section>
  );
}
