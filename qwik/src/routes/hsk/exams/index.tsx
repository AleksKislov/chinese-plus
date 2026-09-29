import { component$ } from '@builder.io/qwik';
import { type DocumentHead, type RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
import {
  ExamsCatalog,
  examsCatalogHead,
  loadExamsCatalog,
} from '~/components/hsk/exams/exams-catalog';
import { type HskVersion, HSK_LEVELS, examsPath } from '~/components/hsk/exams/levels';

// Filters used to be query params (?version=old&lvl=1); they are real pages now.
// Send old links and bookmarks there permanently so their ranking carries over.
export const onGet: RequestHandler = ({ query, redirect }) => {
  const version = query.get('version');
  const lvl = query.get('lvl') || '';
  if (version !== 'old' && version !== 'new') return;
  throw redirect(
    301,
    examsPath(version, HSK_LEVELS[version as HskVersion].includes(lvl) ? lvl : ''),
  );
};

export const useExamsCatalog = routeLoader$((ev) => loadExamsCatalog(ev, ''));

export default component$(() => {
  const catalog = useExamsCatalog();
  return <ExamsCatalog data={catalog.value} />;
});

export const head: DocumentHead = ({ resolveValue }) =>
  examsCatalogHead(resolveValue(useExamsCatalog));
