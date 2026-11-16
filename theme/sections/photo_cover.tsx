import type { ImageData, ProductData, SiteInfo } from 'ui-kit';
import { Container, Image, sectionColours } from 'ui-kit';

// The opening photograph, edge to edge and as tall as the screen allows, with the merchant's words set low over it and
// an optional caption line in the far corner, as a photo book prints one. The photo is the merchant's upload (a taller
// crop for phones optional). Without one, the first photo of the product picked as a stand-in shows, so a new store
// opens on its own photography; with neither, the theme's drawn art fills the frame. The shade under the words is the
// page's own color, so the words stay readable in a light palette too.
export const schema = {
  label: 'Photo cover',
  icon: 'image',
  fields: [
    { id: 'eyebrow', type: 'text', label: 'Small line above the heading' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Look closer' },
    { id: 'text', type: 'textarea', label: 'Text' },
    { id: 'image', type: 'image', label: 'Photo' },
    { id: 'image_phone', type: 'image', label: 'Photo on phones (optional, a taller crop)' },
    { id: 'stand_in', type: 'product', label: 'Without a photo: show this product\'s first photo' },
    { id: 'caption', type: 'text', label: 'Caption in the corner (a place, a season, a credit)' },
    { id: 'primary_label', type: 'text', label: 'Button', default: 'Shop all' },
    { id: 'primary_href', type: 'url', label: 'Button link', default: '/products' },
    { id: 'secondary_label', type: 'text', label: 'Second link' },
    { id: 'secondary_href', type: 'url', label: 'Second link address', default: '/categories' },
    { id: 'height', type: 'select', label: 'Height', options: ['screen', 'tall', 'wide'], default: 'screen' },
    { id: 'position', type: 'select', label: 'Words', options: ['bottom_left', 'bottom_right', 'middle'], default: 'bottom_left' },
    { id: 'shade', type: 'select', label: 'Shade under the words', options: ['soft', 'deep', 'none'], default: 'soft' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Button color' },
  ],
} as const;

type Words = 'eyebrow' | 'heading' | 'text' | 'caption' | 'primary_label' | 'primary_href' | 'secondary_label' | 'secondary_href' | 'height' | 'position' | 'shade' | 'text_colour' | 'accent_colour';
type Upload = Partial<ImageData> | null;
type Props = Partial<Record<Words, string>> & { site?: SiteInfo; image?: Upload; image_phone?: Upload; stand_in?: ProductData | null };

export const styles = `
& .pc{display:grid;padding:0;background:var(--uk-color-tile);isolation:isolate}
& .pc>*{grid-area:1/1}
& .pc-shot{border-radius:0;min-height:max(560px,100svh)}
& .pc[data-h=tall] .pc-shot{min-height:min(84svh,900px)}
& .pc[data-h=wide] .pc-shot{min-height:0;aspect-ratio:21/9}
& .pc-shot>img,& .pc-shot>svg{position:absolute;inset:0}
& .pc-shot--phone{display:none}
& .pc-veil{z-index:1}
& .pc-over{z-index:2;align-self:end;padding:calc(var(--uk-space-9) + 48px) 0 var(--uk-space-8);color:var(--uk-color-heading)}
& .pc[data-at=middle] .pc-over{align-self:center;text-align:center}
& .pc-lines{max-width:min(860px,100%)}
& .pc[data-at=bottom_right] .pc-lines{margin-inline-start:auto;text-align:end}
& .pc[data-at=middle] .pc-lines{margin-inline:auto}
& .pc-kicker{margin:0 0 var(--uk-space-4);font-size:var(--uk-text-sm);letter-spacing:.18em;text-transform:uppercase}
& .pc-lines h1,& .pc-lines h2{margin:0;color:inherit}
& .pc-say{margin:var(--uk-space-4) 0 0;max-width:36em;font-size:var(--uk-text-lg);line-height:1.5;white-space:pre-line}
& .pc[data-at=bottom_right] .pc-say{margin-inline-start:auto}
& .pc[data-at=middle] .pc-say{margin-inline:auto}
& .pc-do{display:flex;flex-wrap:wrap;align-items:center;gap:var(--uk-space-5);margin-top:var(--uk-space-6)}
& .pc[data-at=bottom_right] .pc-do{justify-content:flex-end}
& .pc[data-at=middle] .pc-do{justify-content:center}
& .pc-also{color:inherit;font-size:var(--uk-text-sm);font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-underline-offset:8px;text-decoration-thickness:1px}
& .pc-credit{display:flex;justify-content:space-between;gap:var(--uk-space-5);margin-top:var(--uk-space-7);padding-top:var(--uk-space-4);border-top:1px solid currentColor;font-size:var(--uk-text-xs);letter-spacing:.14em;text-transform:uppercase;opacity:.82}
& .pc-credit a{color:inherit;text-decoration:none}
@media (prefers-reduced-motion:no-preference){& .pc-shot>img{animation:drift 2.4s cubic-bezier(.2,.7,.2,1) both}}
@keyframes drift{from{transform:scale(1.06)}}
@media (max-width:900px){
& .pc-shot{min-height:max(520px,88svh)}
& .pc[data-h=tall] .pc-shot{min-height:min(76svh,680px)}
& .pc[data-h=wide] .pc-shot{min-height:0;aspect-ratio:4/5}
& .pc-shot--phone{display:grid}
& .pc-shot--phone~.pc-shot--wide{display:none}
& .pc-over{padding:var(--uk-space-9) 0 var(--uk-space-6)}
& .pc[data-at=bottom_right] .pc-lines,& .pc[data-at=bottom_right] .pc-say{margin-inline-start:0;text-align:start}
& .pc[data-at=bottom_right] .pc-do{justify-content:flex-start}
& .pc-say{font-size:var(--uk-text-md)}
& .pc-do .uk-button{flex:1 1 100%}
}
`;

// An uploaded image field as store image data (alt '' when the merchant gave none), else null.
const asImage = (v?: Upload): ImageData | null => (v && typeof v.url === 'string' && v.url ? { url: v.url, alt: v.alt ?? '', width: v.width, height: v.height, focal: v.focal } : null);
const oneOf = (v: string | undefined, first: string, ...rest: string[]) => (v !== undefined && rest.includes(v) ? v : first);

export default function PhotoCover(p: Props) {
  const h = oneOf(p.height, 'screen', 'tall', 'wide');
  const at = oneOf(p.position, 'bottom_left', 'bottom_right', 'middle');
  const veil = oneOf(p.shade, 'soft', 'deep', 'none');
  const own = asImage(p.image);
  const product = p.stand_in && typeof p.stand_in === 'object' ? p.stand_in : null;
  const shot = own ?? (product?.image ? { ...product.image, alt: '' } : null);
  const tall = own ? asImage(p.image_phone) : null;
  const mix = (n: number) => `color-mix(in srgb, var(--uk-color-bg) ${n}%, transparent)`;
  const shade = veil === 'none' ? undefined
    : at === 'middle' ? mix(veil === 'deep' ? 58 : 36)
      : `linear-gradient(180deg, ${mix(34)} 0, transparent 26%, transparent 42%, ${mix(veil === 'deep' ? 88 : 72)} 100%)`;
  const heading = p.heading ? (p.site?.page.kind === 'home' ? <h1 className="uk-heading uk-heading--display">{p.heading}</h1> : <h2 className="uk-heading uk-heading--display">{p.heading}</h2>) : null;
  const credit = p.caption ? <span>{p.caption}</span> : product && !own ? <a href={product.url}>{product.name}</a> : null;
  return (
    <section className="pc" data-h={h} data-at={at}>
      {tall ? <div className="uk-media pc-shot pc-shot--phone"><Image image={tall} sizes="100vw" priority /></div> : null}
      <div className="uk-media pc-shot pc-shot--wide">{shot ? <Image image={shot} sizes="100vw" priority /> : <svg viewBox="0 0 16 9" aria-hidden="true" />}</div>
      <div className="pc-veil" style={{ background: shade }} />
      <div className="pc-over" style={{ ...sectionColours({ text_colour: p.text_colour, accent_colour: p.accent_colour }) }}>
        <Container>
          <div className="pc-lines">
            {p.eyebrow ? <p className="pc-kicker">{p.eyebrow}</p> : null}
            {heading}
            {p.text ? <p className="pc-say">{p.text.trim()}</p> : null}
            {p.primary_label || p.secondary_label ? (
              <p className="pc-do">
                {p.primary_label ? <a className="uk-button uk-button--primary" href={p.primary_href || '/products'}>{p.primary_label}</a> : null}
                {p.secondary_label ? <a className="pc-also" href={p.secondary_href || '/categories'}>{p.secondary_label}</a> : null}
              </p>
            ) : null}
          </div>
          {credit ? <p className="pc-credit">{credit}</p> : null}
        </Container>
      </div>
    </section>
  );
}
