import { $, component$ } from '@builder.io/qwik';
import { newBlogBlock, type BlogBlock } from '~/misc/helpers/content';
import { BlockEditor } from './blog-blocks/block-editor';

type BlogBlocksEditorProps = {
  content: BlogBlock[];
};

// media blocks are always followed by a text block, so users always have somewhere to keep typing
export const BlogBlocksEditor = component$(({ content }: BlogBlocksEditorProps) => {
  const insertAt = $((ind: number, type: BlogBlock['type']) => {
    content.splice(ind, 0, newBlogBlock(type));
    const next = content[ind + 1];
    if (!next || next.type !== 'text') {
      content.splice(ind + 1, 0, newBlogBlock('text'));
    }
  });

  const removeAt = $((ind: number) => {
    content.splice(ind, 1);
    if (content.length === 0) content.push(newBlogBlock('text'));
  });

  const moveAt = $((ind: number, dir: -1 | 1) => {
    const target = ind + dir;
    if (target < 0 || target >= content.length) return;
    const tmp = content[ind];
    content[ind] = content[target];
    content[target] = tmp;
  });

  return (
    <div>
      {content.map((block, ind) => (
        <BlockEditor
          key={ind}
          block={block}
          canRemove={content.length > 1}
          canMoveUp={ind > 0}
          canMoveDown={ind < content.length - 1}
          onInsertAfter$={(type) => insertAt(ind + 1, type)}
          onRemove$={() => removeAt(ind)}
          onMove$={(dir) => moveAt(ind, dir)}
        />
      ))}
    </div>
  );
});
