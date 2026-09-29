import { component$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import {
  ExamsCatalog,
  examsCatalogHead,
  loadExamsCatalog,
} from '~/components/hsk/exams/exams-catalog';

export const useExamsCatalog = routeLoader$((ev) => loadExamsCatalog(ev, 'new'));

export default component$(() => {
  const catalog = useExamsCatalog();
  return <ExamsCatalog data={catalog.value} />;
});

export const head: DocumentHead = ({ resolveValue }) =>
  examsCatalogHead(resolveValue(useExamsCatalog));
