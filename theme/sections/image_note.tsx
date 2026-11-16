import type { ImageData, SiteInfo } from 'ui-kit';
import { Container, Image, sectionColours } from 'ui-kit';

// One wide photograph with a short note pinned over its lower corner, the way a print carries a handwritten label: the
// merchant's photo, small line, heading, text and link. On phones the note follows the photo. Without a photo the
// theme's drawn art fills the frame; with no words at all, the photo stands alone.
export const schema = {
  label: 'Image with note',
  icon: 'image',
  fields: [
    { id: 'image', type: 'image', label: 'Photo' },
    { id: 'eyebrow', type: 'text', label: 'Small line above the heading' },
    { id: 'heading', type: 'text', label: 'Heading', default: 'Our story' },
    { id: 'text', type: 'textarea', label: 'Text', default: 'Learn more about who we are and what we make.' },
    { id: 'link_label', type: 'text', label: 'Link label', default: 'Read more' },
    { id: 'link_href', type: 'url', label: 'Link', default: '/pages/about' },
    { id: 'side', type: 'select', label: 'Note side', options: ['right', 'left'], default: 'right' },
    { id: 'photo_height', type: 'select', label: 'Photo height', options: ['tall', 'medium'], default: 'tall' },
    { id: 'note_tone', type: 'select', label: 'Note background', options: ['page', 'accent'], default: 'page' },
    { id: 'background_colour', type: 'color', label: 'Note background color' },
    { id: 'text_colour', type: 'color', label: 'Note text color' },
  ],
} as const;

type Words = 'eyebrow' | 'heading' | 'text' | 'link_label' | 'link_href' | 'side' | 'photo_height' | 'note_tone' | 'background_colour' | 'text_colour';
type Props = Partial<Record<Words, string>> & { site?: SiteInfo; image?: Partial<ImageData> | null };

export const styles = `
& .in{padding:var(--uk-section-sm) 0;display:grid}
& .in>*{grid-area:1/1}
& .in-wall{border-radius:0;min-height:min(86svh,900px)}
& .in[data-h=medium] .in-wall{min-height:min(64svh,640px)}
& .in-wall>img,& .in-wall>svg{position:absolute;inset:0}
& .in-pin{z-index:1;align-self:end;padding-bottom:clamp(24px,4vw,56px)}
& .in-card{inline-size:min(440px,100%);margin-inline-start:auto;padding:clamp(28px,3vw,44px);background:var(--uk-color-bg);color:var(--uk-color-ink)}
& .in[data-side=left] .in-card{margin-inline-start:0}
& .in-card[data-tone=accent]{background:var(--uk-color-accent);color:var(--uk-color-on-accent)}
& .in-kicker{margin:0 0 var(--uk-space-3);font-size:var(--uk-text-xs);font-weight:600;letter-spacing:.18em;text-transform:uppercase;opacity:.8}
& .in-card h2{margin:0;color:inherit}
& .in-say{margin:var(--uk-space-4) 0 0;line-height:1.6;opacity:.88;white-space:pre-line}
& .in-go{display:inline-block;margin-top:var(--uk-space-5);font-size:var(--uk-text-sm);font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:inherit;text-underline-offset:8px;text-decoration-thickness:1px}
@media (max-width:900px){
& .in{grid-template-rows:auto auto}
& .in-wall,& .in[data-h=medium] .in-wall{min-height:0;aspect-ratio:4/5}
& .in-pin{grid-area:2/1;padding:0 16px;margin-top:-48px}
& .in-card{inline-size:auto;margin-inline-start:0}
}
`;

export default function ImageNote(p: Props) {
  const up = p.image;
  const photo: ImageData | null = up && typeof up.url === 'string' && up.url ? { url: up.url, alt: up.alt ?? '', width: up.width, height: up.height, focal: up.focal } : null;
  const say = (p.text ?? '').trim();
  const card = p.eyebrow || p.heading || say || p.link_label;
  if (!photo && !card) return null;
  return (
    <section className="in" data-side={p.side === 'left' ? 'left' : 'right'} data-h={p.photo_height === 'medium' ? 'medium' : 'tall'}>
      <div className="uk-media in-wall">
        {photo ? <Image image={photo} sizes="100vw" /> : <svg viewBox="0 0 16 9" preserveAspectRatio="none" aria-hidden="true" />}
      </div>
      {card ? (
        <div className="in-pin">
          <Container>
            <div className="in-card" data-tone={p.note_tone === 'accent' ? 'accent' : 'page'} style={{ ...sectionColours({ background_colour: p.background_colour, text_colour: p.text_colour }) }}>
              {p.eyebrow ? <p className="in-kicker">{p.eyebrow}</p> : null}
              {p.heading ? <h2 className="uk-heading uk-heading--lg">{p.heading}</h2> : null}
              {say ? <p className="in-say">{say}</p> : null}
              {p.link_label ? <a className="in-go" href={p.link_href || '/pages/about'}>{p.link_label}</a> : null}
            </div>
          </Container>
        </div>
      ) : null}
    </section>
  );
}
