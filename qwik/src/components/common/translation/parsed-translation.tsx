import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import type { DictExample, TranslationInline, TranslationNode } from './types';

const Inline = ({ parts }: { parts: TranslationInline[] }) => (
  <>
    {parts.map((part, i) => {
      switch (part.type) {
        case 'label':
          return (
            <span key={i} class="text-success italic text-xs">
              {part.value}
            </span>
          );
        case 'comment':
          return (
            <span key={i} class="italic">
              {part.value}
            </span>
          );
        case 'ref':
          return (
            <Link key={i} prefetch="js" href={'/dictionary/' + encodeURIComponent(part.value)}>
              {part.value}
            </Link>
          );
        case 'pinyin':
        case 'strong':
          return (
            <span key={i} class="font-bold text-success">
              {part.value}
            </span>
          );
        case 'en':
          return (
            <span key={i} class="text-success">
              {part.value}
            </span>
          );
        default:
          return part.value;
      }
    })}
  </>
);

const Labels = ({ labels }: { labels?: string[] }) =>
  labels?.length ? <span class="text-success italic text-xs">{labels.join(' ')} </span> : null;

const Example = ({ example }: { example: DictExample }) => (
  <div class="text-sky-300 indent-5">
    {example.zh}{' '}
    {example.pinyin && <span class="font-bold text-success">{example.pinyin} </span>}
    <Labels labels={example.labels} />
    {example.content ? <Inline parts={example.content} /> : example.translation}
  </div>
);

type SenseProps = {
  node: TranslationNode;
  id: string;
  examplesBySense: Record<string, DictExample[]>;
  showExamples: boolean;
};

const Sense = ({ node, id, examplesBySense, showExamples }: SenseProps) => {
  const isGroup = node.kind === 'homonym' || node.kind === 'section';
  return (
    <div class={isGroup ? 'mt-2' : ''}>
      <div>
        {node.marker && (
          <span class={isGroup ? 'font-bold text-success' : ''}>
            {node.marker}
            {isGroup ? ' ' : ') '}
          </span>
        )}
        {node.pinyin && <span class="font-bold text-success">{node.pinyin} </span>}
        <Labels labels={node.labels} />
        {node.content ? <Inline parts={node.content} /> : node.text}
      </div>
      {showExamples &&
        (examplesBySense[id] || []).map((example) => (
          <Example key={example.order} example={example} />
        ))}
      {node.senses && (
        <div class="ml-4">
          {node.senses.map((child, i) => (
            <Sense
              key={i}
              node={child}
              id={`${id}.${i + 1}`}
              examplesBySense={examplesBySense}
              showExamples={showExamples}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ParsedTranslation = component$(
  ({
    senses,
    examples,
    showExamples,
  }: {
    senses: TranslationNode[];
    examples: DictExample[];
    showExamples: boolean;
  }) => {
    const examplesBySense: Record<string, DictExample[]> = {};
    for (const example of examples) {
      const key = example.senseId ?? '';
      (examplesBySense[key] = examplesBySense[key] || []).push(example);
    }

    return (
      <div>
        {senses.map((node, i) => (
          <Sense
            key={i}
            node={node}
            id={`${i + 1}`}
            examplesBySense={examplesBySense}
            showExamples={showExamples}
          />
        ))}
        {showExamples &&
          (examplesBySense[''] || []).map((example) => (
            <Example key={example.order} example={example} />
          ))}
      </div>
    );
  },
);
