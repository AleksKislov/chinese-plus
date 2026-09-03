import { component$, useStore, useSignal, $ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { FlexRow } from '~/components/common/layout/flex-row';
import { MainContent } from '~/components/common/layout/main-content';
import { PageTitle } from '~/components/common/layout/title';
import { BackBtn } from '~/components/common/ui/back-btn';
import { ApiService } from '~/misc/actions/request';
import { ExamQuestionCard } from '~/components/hsk/exams/exam-question';
import {
  type HskExamType,
  SECTION_TITLES_RU,
  isCorrect,
  isUngraded,
  questionKey,
} from '~/components/hsk/exams/types';

export const useGetExam = routeLoader$(async ({ params, redirect }): Promise<HskExamType> => {
  const exam = await ApiService.get(`/api/hsk-exams/${params.slug}`, undefined, null);
  if (!exam) throw redirect(302, '/hsk/exams/');
  return exam;
});

export default component$(() => {
  const exam = useGetExam();
  // questionKey() -> chosen label or typed text
  const answers = useStore<Record<string, string>>({});
  const isChecked = useSignal(false);

  const gradeable = exam.value.sections.flatMap((section, sInd) =>
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

  return (
    <>
      <BackBtn path={'/hsk/exams/'} />
      <PageTitle txt={exam.value.title.ru || exam.value.title.cn || exam.value.slug} />

      <FlexRow>
        <MainContent>
          <div class="flex flex-wrap gap-1 mb-3">
            <span class="badge badge-primary badge-sm">
              {exam.value.version === 'new' ? 'HSK 3.0' : 'HSK 2.0'} · уровень {exam.value.level}
            </span>
            {exam.value.durationMinutes && (
              <span class="badge badge-ghost badge-sm">{exam.value.durationMinutes} мин</span>
            )}
            <span class="badge badge-ghost badge-sm">{gradeable.length} заданий с проверкой</span>
          </div>

          {exam.value.descriptionRu && (
            <div class="prose mb-4">
              <p>{exam.value.descriptionRu}</p>
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

          {exam.value.sections.map((section, sInd) => (
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

              {section.parts.map((part, pInd) => (
                <div key={part.ind} class="mb-6">
                  {(part.instructionCn || part.instructionRu) && (
                    <div class="bg-base-200 rounded-lg p-3 mb-3">
                      {part.instructionCn && <p class="mb-1">{part.instructionCn}</p>}
                      {part.instructionRu && (
                        <p class="text-sm opacity-80 mb-0">{part.instructionRu}</p>
                      )}
                      {part.exampleRu && (
                        <p class="text-sm opacity-70 mt-1 mb-0">{part.exampleRu}</p>
                      )}
                    </div>
                  )}

                  {/* Shared answer set: the A-F picture strip or word bank the
                      questions in this part are answered from. */}
                  {!!part.bank.length && (
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
                              // exists, fall back to the bank entry's Russian gloss.
                              onError$={(_, el) => {
                                el.style.display = 'none';
                              }}
                            />
                          )}
                          {choice.textCn && <span class="mt-1">{choice.textCn}</span>}
                          {choice.pinyin && (
                            <span class="text-xs opacity-70 lowercase">{choice.pinyin}</span>
                          )}
                          {choice.textRu && !choice.imageUrl && (
                            <span class="text-xs opacity-70">{choice.textRu}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {part.questions.map((q) => {
                    const key = questionKey(sInd, pInd, q.ind);
                    return (
                      <ExamQuestionCard
                        key={key}
                        question={q}
                        part={part}
                        answer={answers[key]}
                        isChecked={isChecked.value}
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
        </MainContent>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const exam = resolveValue(useGetExam);
  const title = exam?.title.ru || exam?.title.cn || 'Пробный экзамен HSK';
  return {
    title: `Chinese+ ${title}`,
    meta: [
      {
        name: 'description',
        content:
          exam?.descriptionRu ||
          'Полноформатный пробный экзамен HSK с проверкой ответов и пояснениями.',
      },
    ],
  };
};
