import { component$, type QRL } from '@builder.io/qwik';
import { xMarkSvg } from '~/components/common/media/svg';
import { type BlogBlock } from '~/misc/helpers/content';
import { TextBlockEditor } from './text-block-editor';
import { ImageBlockEditor } from './image-block-editor';
import { CarouselBlockEditor } from './carousel-block-editor';
import { VideoBlockEditor } from './video-block-editor';
import { ChineseBlockEditor } from './chinese-block-editor';
import { BlockInsertMenu, type InsertableBlockType } from './block-insert-menu';

type BlockEditorProps = {
  block: BlogBlock;
  canRemove: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onInsertAfter$: QRL<(type: InsertableBlockType) => void>;
  onRemove$: QRL<() => void>;
  onMove$: QRL<(dir: -1 | 1) => void>;
};

export const BlockEditor = component$(
  ({
    block,
    canRemove,
    canMoveUp,
    canMoveDown,
    onInsertAfter$,
    onRemove$,
    onMove$,
  }: BlockEditorProps) => {
    return (
      <div class="group relative flex items-start gap-1">
        <div class="flex flex-col items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <BlockInsertMenu onInsert$={onInsertAfter$} />

          {(canMoveUp || canMoveDown || canRemove) && (
            <div class="flex flex-col items-center">
              {canMoveUp && (
                <button type="button" class="btn btn-xs btn-ghost" onClick$={() => onMove$(-1)}>
                  ↑
                </button>
              )}
              {canMoveDown && (
                <button type="button" class="btn btn-xs btn-ghost" onClick$={() => onMove$(1)}>
                  ↓
                </button>
              )}
              {canRemove && (
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-error"
                  onClick$={onRemove$}
                >
                  {xMarkSvg}
                </button>
              )}
            </div>
          )}
        </div>

        <div class="flex-1 min-w-0">
          {block.type === 'text' && <TextBlockEditor block={block} />}
          {block.type === 'image' && <ImageBlockEditor block={block} />}
          {block.type === 'carousel' && <CarouselBlockEditor block={block} />}
          {block.type === 'video' && <VideoBlockEditor block={block} />}
          {block.type === 'chinese' && <ChineseBlockEditor block={block} />}
        </div>
      </div>
    );
  },
);
