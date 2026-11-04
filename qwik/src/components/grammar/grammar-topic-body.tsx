import { component$, type Signal } from '@builder.io/qwik';
import { GrammarExample } from './grammar-example';
import { type GrammarTopic } from './types';

type GrammarTopicBodyProps = {
  topic: GrammarTopic;
  currentWord: Signal<DictWord | null>;
  hideIntro?: boolean; // summary and items are already shown (level page card)
};

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export const GrammarTopicBody = component$(
  ({ topic, currentWord, hideIntro }: GrammarTopicBodyProps) => {
    return (
      <div>
        {!hideIntro && <p class="text-base mb-3">{topic.summary}</p>}

        {!hideIntro && topic.items.length > 0 && (
          <div class="flex flex-wrap gap-1 mb-4">
            {topic.items.map((item) => (
              <span key={item} class="badge badge-outline badge-lg">
                {item}
              </span>
            ))}
          </div>
        )}

        {topic.rules.map((rule, idx) => (
          <section key={idx} class="mt-5">
            <h3 class="font-semibold text-lg flex items-start gap-2">
              {topic.rules.length > 1 && (
                <span class="badge badge-primary mt-1">{LETTERS[idx]}</span>
              )}
              <span>{rule.title}</span>
            </h3>
            {rule.pattern && (
              <div class="my-2 px-3 py-2 rounded-lg bg-base-200 font-mono text-base w-fit">
                {rule.pattern}
              </div>
            )}
            {rule.text && <p class="my-2">{rule.text}</p>}

            <div class="divide-y divide-base-300 border-l-4 border-primary pl-4 mt-2">
              {rule.examples.map((example, exIdx) => (
                <GrammarExample key={exIdx} example={example} currentWord={currentWord} />
              ))}
            </div>
          </section>
        ))}

        {topic.notes.length > 0 && (
          <div class="alert alert-warning mt-6 flex-col items-start">
            <p class="font-semibold">Обратите внимание</p>
            <ul class="list-disc pl-5">
              {topic.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);
