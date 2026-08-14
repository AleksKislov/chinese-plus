import { component$, useSignal } from '@builder.io/qwik';
import { type BlogBlock, getVideoEmbedUrl } from '~/misc/helpers/content';
import { Paragraph } from './paragraph';
import { FontSizeBtns } from '../common/content-cards/content-page-card';
import { BlogCarousel } from './blog-carousel';
import { VideoEmbed } from './video-embed';
import { LinkedText } from '../common/linked-text';

type BlogContentProps = {
  content: BlogBlock[];
  tooltipsByBlock?: ((string | DictWord)[][] | null)[];
};

// rendered inside a `<div class="prose">` by the caller, so it stays a plain fragment
export const BlogContent = component$(({ content, tooltipsByBlock }: BlogContentProps) => {
  const currentWord = useSignal<DictWord | null>(null);

  return (
    <>
      {content.map((block, ind) => {
        if (block.type === 'text') {
          return block.text
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line, i) => (
              <p key={`${ind}-${i}`}>
                <LinkedText text={line} />
              </p>
            ));
        }

        if (block.type === 'image') {
          return block.url ? (
            <BlogCarousel
              key={ind}
              images={[{ url: block.url, caption: block.caption }]}
              idPrefix={`image-${ind}`}
            />
          ) : null;
        }

        if (block.type === 'carousel') {
          return <BlogCarousel key={ind} images={block.images} idPrefix={`carousel-${ind}`} />;
        }

        if (block.type === 'video') {
          const embedUrl = getVideoEmbedUrl(block.url);
          return embedUrl ? <VideoEmbed key={ind} src={embedUrl} /> : null;
        }

        if (block.type === 'chinese') {
          const tooltipParags = tooltipsByBlock?.[ind];
          if (!tooltipParags) return null;
          return (
            <div key={ind} class="not-prose [&_.bg-base-200]:bg-transparent">
              {tooltipParags.map((parag, i) => (
                <Paragraph
                  key={i}
                  ind={i}
                  fontSize={FontSizeBtns.md}
                  tooltipedParag={parag}
                  translation={''}
                  strLen={0}
                  currentWord={currentWord}
                  showTranslation={false}
                  forEditing={true}
                  hideParagNum={true}
                />
              ))}
            </div>
          );
        }

        return null;
      })}
    </>
  );
});
