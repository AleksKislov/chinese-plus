import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import {
  GrammarLevelPage,
  grammarLevelHead,
  loadGrammarLevels,
  loadGrammarTopics,
} from '~/components/grammar/grammar-level-page';

export const useGrammarLevels = routeLoader$(() => loadGrammarLevels());
export const useGrammarTopics = routeLoader$(() => loadGrammarTopics('1'));

export default component$(() => {
  const levels = useGrammarLevels();
  const topics = useGrammarTopics();
  return <GrammarLevelPage level="1" levels={levels.value} topics={topics.value} />;
});

export const head: DocumentHead = ({ resolveValue }) =>
  grammarLevelHead('1', resolveValue(useGrammarTopics));
