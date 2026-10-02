import { component$, useContext, useStore, useSignal, $ } from '@builder.io/qwik';
import { type DocumentHead, Link, routeLoader$ } from '@builder.io/qwik-city';
import CONST_URLS from '~/misc/consts/urls';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { Breadcrumbs } from '~/components/common/layout/breadcrumbs';
import { JsonLd } from '~/components/common/seo/json-ld';
import { ApiService } from '~/misc/actions/request';
import { getTokenFromCookie } from '~/misc/actions/auth';
import { userContext } from '~/root';
import { ExamQuestionCard } from '~/components/hsk/exams/exam-question';
import { AdminImageSlot } from '~/components/hsk/exams/admin-image-slot';
import { useSetExamApproved } from '~/misc/actions/hsk-exams/set-approved';
import { ExamCard } from '~/components/hsk/exams/exam-card';
import {
  VERSION_NAME,
  examsPath,
  getExamVariant,
  levelLabel,
  levelName,
  ogImagePath,
  wordTestsPath,
  wordsPath,
} from '~/components/hsk/exams/levels';
import {
  type HskExamListItem,
  type HskExamType,
  SECTION_TITLES_RU,
  isCorrect,
  isUngraded,
  questionKey,
} from '~/components/hsk/exams/types';

export const useGetExam = routeLoader$(
  async ({ params, cookie, status }): Promise<HskExamType | null> => {
    // Sent whether or not the visitor is an admin - optional-admin-auth.js on the
    // backend decides what a missing/non-admin token is worth (nothing: only an
    // approved exam resolves either way).
    const token = getTokenFromCookie(cookie);
    const exam = await ApiService.get(`/api/hsk-exams/${params.slug}`, token, null);
    // A real 404 rather than a redirect to the list: a redirect reads as a "soft
    // 404" to search engines and keeps removed exams lingering in the index.
    if (!exam) status(404);
    return exam;
  },
);

// Other papers of the same version and level, for the "more variants" block.
export const useRelatedExams = routeLoader$(async (ev): Promise<HskExamListItem[]> => {
  const exam = await ev.resolveValue(useGetExam);
  if (!exam) return [];
  const token = getTokenFromCookie(ev.cookie);
  const list: HskExamListItem[] = await ApiService.get(
    `/api/hsk-exams?version=${exam.version}&lvl=${exam.level}`,
    token,
    [],
  );
  return list.filter((e) => e.slug !== exam.slug);
});

const ExamNotFound = component$(() => (
  <>
    <PageTitle txt={'Экзамен не найден'} />
    <div class="prose">
      <p>
        Этот вариант удалён или ещё не опубликован. Все варианты — на странице{' '}
        <Link prefetch="js" href={examsPath()}>
          пробных экзаменов HSK
        </Link>
        .
      </p>
    </div>
  </>
));

export default component$(() => {
  const exam = useGetExam();
  const related = useRelatedExams();
  const { isAdmin } = useContext(userContext);
  const setApproved = useSetExamApproved();
  // questionKey() -> chosen label or typed text
  const answers = useStore<Record<string, string>>({});
  const isChecked = useSignal(false);

  const paper = exam.value;
  if (!paper) return <ExamNotFound />;
  // Old HSK 2 has its own line-by-line layout (see ExamQuestionCard's variant);
  // every other paper keeps the default rendering.
  const cardVariant =
    paper.version === 'old' && paper.level === '2' ? ('old-2' as const) : undefined;

  const gradeable = paper.sections.flatMap((section, sInd) =>
    section.parts.flatMap((part, pInd) =>
      part.questions
        .filter((q) => !isUngraded(q.questionType))
        .map((q) => ({ q, key: questionKey(sInd, pInd, q.ind) })),
    ),
  );

  const score = gradeable.filter(({ q, key }) => isCorrect(q, answers[key])).length;
  const answeredNum = gradeable.filter(({ key }) => answers[key]).length;

  const reset = $(() => {
    for (const key in answers) delete answers[key];
    isChecked.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const lvlLabel = levelLabel(paper.version, paper.level);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Пробные экзамены HSK', href: examsPath() },
          { name: VERSION_NAME[paper.version], href: examsPath(paper.version) },
          { name: `HSK ${lvlLabel}`, href: examsPath(paper.version, paper.level) },
          { name: `Вариант ${getExamVariant(paper)}` },
        ]}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Quiz',
          name: `Пробный экзамен ${levelName(
            paper.version,
            paper.level,
          )} — вариант ${getExamVariant(paper)}`,
          description: paper.descriptionRu || undefined,
          url: `${CONST_URLS.siteUrl}/hsk/exams/${paper.slug}/`,
          inLanguage: 'ru',
          learningResourceType: 'Пробный экзамен',
          educationalLevel: levelName(paper.version, paper.level),
          about: { '@type': 'Thing', name: 'Китайский язык, экзамен HSK' },
          isAccessibleForFree: true,
          timeRequired: paper.durationMinutes ? `PT${paper.durationMinutes}M` : undefined,
          dateModified: paper.updatedAt || undefined,
          provider: { '@type': 'Organization', name: 'Chinese+', url: CONST_URLS.siteUrl },
        }}
      />
      <PageTitle txt={paper.title.ru || paper.title.cn || paper.slug} />

      <FlexRow>
        <MainContent>
          <div class="flex flex-wrap gap-1 mb-3">
            <span class="badge badge-primary badge-sm">
              {VERSION_NAME[paper.version]} · уровень {lvlLabel}
            </span>
            {paper.durationMinutes && (
              <span class="badge badge-ghost badge-sm">{paper.durationMinutes} мин</span>
            )}
            <span class="badge badge-ghost badge-sm">{gradeable.length} заданий с проверкой</span>
            {isAdmin && (
              <span
                class={`badge badge-sm ${paper.isApproved ? 'badge-success' : 'badge-warning'}`}
              >
                {paper.isApproved ? 'одобрен' : 'не одобрен'}
              </span>
            )}
          </div>

          {isAdmin && (
            <button
              type="button"
              class="btn btn-sm btn-outline mb-4"
              onClick$={async () => {
                await setApproved.submit({
                  slug: paper.slug,
                  isApproved: !paper.isApproved,
                });
                window.location.reload();
              }}
            >
              {paper.isApproved ? 'Снять с публикации' : 'Одобрить и опубликовать'}
            </button>
          )}

          {paper.descriptionRu && (
            <div class="prose mb-4">
              <p>{paper.descriptionRu}</p>
            </div>
          )}

          {isChecked.value && (
            <div
              class={`alert mb-4 ${score === gradeable.length ? 'alert-success' : 'alert-info'}`}
            >
              <span>
                Результат: <b>{score}</b> из <b>{gradeable.length}</b> (
                {Math.round((score / (gradeable.length || 1)) * 100)}%)
              </span>
            </div>
          )}

          {paper.sections.map((section, sInd) => (
            <section key={section.type} class="mb-8">
              <div class="prose mb-3">
                <h3 class="mb-0">
                  {section.titleCn || SECTION_TITLES_RU[section.type]}
                  {section.titleRu && section.titleCn && (
                    <span class="text-base font-normal opacity-70"> — {section.titleRu}</span>
                  )}
                </h3>
                {section.durationMinutes && (
                  <p class="text-sm opacity-70 mt-1 mb-0">{section.durationMinutes} мин</p>
                )}
              </div>

              {/* One continuous recording played straight through, the way the
                  real exam is sat - the spoken instructions, examples and timed
                  pauses are all inside the track. */}
              {section.audioUrl && (
                <div class="bg-base-200 rounded-lg p-3 mb-4">
                  <p class="text-sm mb-2">
                    Запись раздела целиком — как на настоящем экзамене: инструкции, примеры и паузы
                    уже внутри. Включите её один раз и отвечайте по ходу.
                  </p>
                  <audio
                    id={`section-audio-${section.type}`}
                    src={section.audioUrl}
                    controls
                    preload="none"
                    class="w-full"
                  />
                </div>
              )}

              {section.parts.map((part, pInd) => (
                <div key={part.ind} class="mb-6">
                  {(part.instructionCn || part.instructionRu) && (
                    <div class="bg-base-200 rounded-lg p-3 mb-3">
                      {part.instructionCn && <p class="mb-1">{part.instructionCn}</p>}
                      {part.instructionRu && (
                        <p class="text-sm opacity-80 mb-0">{part.instructionRu}</p>
                      )}
                    </div>
                  )}

                  {/* Shared answer set: the A-F picture strip or word bank the
                      questions in this part are answered from. Branches on
                      bankImagePrompt (fixed at content authoring time), not
                      bankHasImage (which upload/delete flip as the file comes
                      and goes) - otherwise deleting the combined picture would
                      strand the part in the per-letter layout with no way
                      back to re-upload it. */}
                  {part.bankImagePrompt != null ? (
                    // ONE combined picture for the whole bank (all letters together) -
                    // one file to generate/upload instead of one per letter, the same
                    // idea as a listening-choice question's single 3-in-1 picture.
                    // No reference row of letters here - the picture itself carries
                    // them, and the real per-question answer buttons render inside
                    // each question card.
                    <div class="mb-3">
                      {part.bankImageUrl && (
                        <img
                          src={part.bankImageUrl}
                          alt="Варианты A-F"
                          width={440}
                          height={440}
                          loading="lazy"
                          class="rounded-lg border border-base-300 h-auto"
                          style={{ width: '440px' }}
                          // Pictures are uploaded separately; until this one exists,
                          // hide rather than show a broken-image box.
                          onError$={(_, el) => {
                            el.style.display = 'none';
                          }}
                        />
                      )}
                      {isAdmin && (
                        <AdminImageSlot
                          slug={paper.slug}
                          sectionType={section.type}
                          partInd={part.ind}
                          target="bank-combined"
                          hasImage={part.bankHasImage}
                          size={440}
                        />
                      )}
                    </div>
                  ) : (
                    !!part.bank.length && (
                      <div class="flex flex-wrap gap-3 mb-3">
                        {part.bank.map((choice) => (
                          <div
                            key={choice.label}
                            class="flex flex-col items-center border border-base-300 rounded-lg p-2 bg-base-100"
                          >
                            <span class="badge badge-neutral badge-sm mb-1">{choice.label}</span>
                            {choice.imageUrl && (
                              <img
                                src={choice.imageUrl}
                                // A descriptive alt would hand over the answer on
                                // picture-match questions - label it, don't describe it.
                                alt={`Вариант ${choice.label}`}
                                width={140}
                                height={140}
                                loading="lazy"
                                class="rounded w-[140px] h-auto"
                                // Pictures are uploaded separately; until this one
                                // exists, hide rather than show a broken-image box.
                                onError$={(_, el) => {
                                  el.style.display = 'none';
                                }}
                              />
                            )}
                            {choice.textCn && <span class="mt-1">{choice.textCn}</span>}
                            {choice.pinyin && (
                              <span class="text-xs opacity-70 lowercase">{choice.pinyin}</span>
                            )}
                            {isAdmin && (
                              <AdminImageSlot
                                slug={paper.slug}
                                sectionType={section.type}
                                partInd={part.ind}
                                target="bank"
                                label={choice.label}
                                hasImage={choice.hasImage}
                                size={140}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* Worked example(s) - 例如 - shown pre-answered with the
                      real picture the example describes, not a text caption:
                      that's what the audio actually references. */}
                  {part.examples.map((ex, exInd) => (
                    <ExamQuestionCard
                      key={`example-${exInd}`}
                      question={ex}
                      part={part}
                      answer={ex.correctAnswer ?? undefined}
                      isChecked={true}
                      exampleLabel={part.examples.length > 1 ? `Пример ${exInd + 1}` : 'Пример'}
                      variant={cardVariant}
                      admin={
                        isAdmin
                          ? { slug: paper.slug, sectionType: section.type, isExample: true }
                          : undefined
                      }
                      onAnswer$={$(() => {})}
                    />
                  ))}

                  {part.questions.map((q) => {
                    const key = questionKey(sInd, pInd, q.ind);
                    return (
                      <ExamQuestionCard
                        key={key}
                        question={q}
                        part={part}
                        answer={answers[key]}
                        isChecked={isChecked.value}
                        variant={cardVariant}
                        sectionAudioId={
                          section.audioUrl ? `section-audio-${section.type}` : undefined
                        }
                        admin={
                          isAdmin ? { slug: paper.slug, sectionType: section.type } : undefined
                        }
                        onAnswer$={$((value: string) => {
                          answers[key] = value;
                        })}
                      />
                    );
                  })}
                </div>
              ))}
            </section>
          ))}

          <div class="flex flex-wrap gap-2 sticky bottom-2 bg-base-100/90 backdrop-blur p-2 rounded-lg border border-base-300">
            {!isChecked.value ? (
              <>
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  onClick$={() => {
                    isChecked.value = true;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Проверить экзамен
                </button>
                <span class="text-sm opacity-70 self-center">
                  Отвечено: {answeredNum} из {gradeable.length}
                </span>
              </>
            ) : (
              <button type="button" class="btn btn-outline btn-sm" onClick$={reset}>
                Пройти заново
              </button>
            )}
          </div>

          <div class="prose max-w-none mt-8 mb-3">
            <h2>Ещё пробные экзамены HSK {lvlLabel}</h2>
            <p>
              Все варианты уровня — на странице{' '}
              <Link prefetch="js" href={examsPath(paper.version, paper.level)}>
                пробных экзаменов {levelName(paper.version, paper.level)}
              </Link>
              . Повторить лексику:{' '}
              <Link prefetch="js" href={wordsPath(paper.version, paper.level)}>
                список слов
              </Link>{' '}
              и{' '}
              <Link prefetch="js" href={wordTestsPath(paper.version, paper.level)}>
                тесты на слова
              </Link>{' '}
              HSK {lvlLabel}.
            </p>
          </div>
          {!!related.value.length && (
            <div class="grid gap-3 sm:grid-cols-2 mb-6">
              {related.value.slice(0, 4).map((e) => (
                <ExamCard key={e.slug} exam={e} />
              ))}
            </div>
          )}
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const exam = resolveValue(useGetExam);
  if (!exam) {
    return {
      title: 'Экзамен не найден | Chinese+',
      meta: [{ name: 'robots', content: 'noindex' }],
    };
  }

  // Search queries are "пробный экзамен HSK 1", not the paper's own title, so
  // the keywords go first and the brand last.
  const title = `Пробный экзамен ${levelName(
    exam.version,
    exam.level,
  )} онлайн — вариант ${getExamVariant(exam)} | Chinese+`;
  const description =
    exam.descriptionRu ||
    `Бесплатный пробный экзамен ${levelName(
      exam.version,
      exam.level,
    )} онлайн: мгновенная проверка ответов с пояснениями и текстами аудио.`;
  const url = `${CONST_URLS.siteUrl}/hsk/exams/${exam.slug}/`;

  return {
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      {
        property: 'og:image',
        content: `${CONST_URLS.siteUrl}${ogImagePath(exam.version, exam.level)}`,
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  };
};
