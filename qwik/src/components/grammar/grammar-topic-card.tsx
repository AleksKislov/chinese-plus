import { $, component$, type Signal, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { GrammarTopicBody } from './grammar-topic-body';
import {
  type GrammarTopic,
  type GrammarTopicResponse,
  type GrammarTopicSummary,
  grammarTopicUrl,
} from './types';

type GrammarTopicCardProps = {
  topic: GrammarTopicSummary;
  currentWord: Signal<DictWord | null>;
};

// collapsed: title + summary; the rules and examples are fetched on first open
export const GrammarTopicCard = component$(({ topic, currentWord }: GrammarTopicCardProps) => {
  const full = useSignal<GrammarTopic | null>(null);
  const loading = useSignal(false);
  const failed = useSignal(false);

  // the handler is lazy-loaded, so the event is stale by the time it runs
  // (currentTarget is null, <details> may already be toggled) — rely on state only;
  // the first click always opens the card, so loading then is right
  const loadTopic = $(async () => {
    if (full.value || loading.value) return;

    loading.value = true;
    failed.value = false;
    const res: GrammarTopicResponse | null = await ApiService.get(
      `/api/grammar/topic/${topic.slug}`,
      undefined,
      null,
    );
    if (res?.topic) full.value = res.topic;
    else failed.value = true;
    loading.value = false;
  });

  return (
    <details
      id={topic.slug}
      class="collapse collapse-arrow bg-base-100 border border-primary my-2 overflow-visible"
    >
      <summary class="collapse-title" onClick$={loadTopic}>
        <span class="font-semibold text-lg">
          {topic.ind + 1}. {topic.title.ru}
        </span>{' '}
        <span class="opacity-70">{topic.title.cn}</span>
        <p class="mt-1 opacity-80">{topic.summary}</p>
      </summary>

      <div class="collapse-content">
        {topic.items.length > 0 && (
          <div class="flex flex-wrap gap-1 mb-2">
            {topic.items.map((item) => (
              <span key={item} class="badge badge-outline badge-lg">
                {item}
              </span>
            ))}
          </div>
        )}

        {loading.value && (
          <div class="flex justify-center py-6">
            <span class="loading loading-spinner loading-md"></span>
          </div>
        )}
        {failed.value && (
          <div class="alert alert-warning my-2">
            Не удалось загрузить тему. Попробуйте открыть её отдельно.
          </div>
        )}
        {full.value && <GrammarTopicBody topic={full.value} currentWord={currentWord} hideIntro />}

        <div class="mt-4 text-right">
          <Link href={grammarTopicUrl(topic.slug)} class="link link-primary">
            Открыть тему отдельно →
          </Link>
        </div>
      </div>
    </details>
  );
});
