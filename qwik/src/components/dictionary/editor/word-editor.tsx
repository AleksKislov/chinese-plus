import { $, component$, useSignal } from '@builder.io/qwik';
import { ParsedTranslation } from '~/components/common/translation/parsed-translation';
import {
  type EditorExample,
  type EditorNode,
  type EditorState,
  type TranslationLang,
  LANG_TITLES,
  TRANSLATION_LANGS,
  emptyExample,
  emptyNode,
  findNode,
  renumber,
  senseOptions,
  toPreview,
} from './word-editor-state';

// Editor of a dictionary word (admins, moderators): pinyin, trad. chinese and its translation in
// one language (state.lang) - the senses tree with the examples of every sense - and a preview.
// Only edits the store; the pages save it (routeAction$). The language can be chosen only for a
// new word (isNew); the edit page switches languages itself.

const inputValue = (e: Event) => (e.target as HTMLInputElement).value;

const KIND_TITLES: Record<EditorNode['kind'], string> = {
  '': 'Значение',
  homonym: 'Омоним (I, II)',
  section: 'Раздел (А, Б)',
};

const ExampleEditor = component$(
  ({
    example,
    list,
    index,
    state,
  }: {
    example: EditorExample;
    list: EditorExample[];
    index: number;
    state: EditorState;
  }) => {
    const moveTo = $((uid: string) => {
      const target = uid ? findNode(state.senses, uid)?.examples : state.examples;
      if (!target || target === list) return;
      list.splice(index, 1);
      target.push(example);
    });

    return (
      <div class="flex flex-wrap gap-1 items-center ml-4 mt-1 p-1 border-l-2 border-sky-300">
        <input
          class="input input-bordered input-xs w-32"
          placeholder="例句"
          value={example.zh}
          onInput$={(e) => (example.zh = inputValue(e))}
        />
        <input
          class="input input-bordered input-xs w-28"
          placeholder="pinyin"
          value={example.pinyin}
          onInput$={(e) => (example.pinyin = inputValue(e))}
        />
        <input
          class="input input-bordered input-xs w-20"
          placeholder="пометки"
          value={example.labels}
          onInput$={(e) => (example.labels = inputValue(e))}
        />
        <input
          class="input input-bordered input-xs flex-1 min-w-48"
          placeholder="перевод"
          value={example.text}
          onInput$={(e) => (example.text = inputValue(e))}
        />
        <button
          type="button"
          class="btn btn-xs"
          title="Выше"
          disabled={index === 0}
          onClick$={() => list.splice(index - 1, 2, list[index], list[index - 1])}
        >
          ↑
        </button>
        <button
          type="button"
          class="btn btn-xs"
          title="Ниже"
          disabled={index === list.length - 1}
          onClick$={() => list.splice(index, 2, list[index + 1], list[index])}
        >
          ↓
        </button>
        <select
          class="select select-bordered select-xs w-28"
          title="Перенести к значению"
          onChange$={(e) => moveTo((e.target as HTMLSelectElement).value)}
        >
          <option value="-" selected disabled>
            перенести…
          </option>
          <option value="">без значения</option>
          {senseOptions(state).map((o) => (
            <option key={o.uid} value={o.uid}>
              {`${o.id} ${o.title}`}
            </option>
          ))}
        </select>
        <button
          type="button"
          class="btn btn-xs btn-error btn-outline"
          title="Удалить пример"
          onClick$={() => list.splice(index, 1)}
        >
          ✕
        </button>
      </div>
    );
  },
);

type SenseEditorProps = {
  node: EditorNode;
  siblings: EditorNode[];
  index: number;
  path: string;
  // the list the parent is in, for "move out"
  parentSiblings?: EditorNode[];
  parentIndex?: number;
  state: EditorState;
};

const SenseEditor = component$(
  ({ node, siblings, index, path, parentSiblings, parentIndex, state }: SenseEditorProps) => {
    const moveOut = $(() => {
      if (!parentSiblings || parentIndex === undefined) return;
      siblings.splice(index, 1);
      parentSiblings.splice(parentIndex + 1, 0, node);
    });

    const moveIn = $(() => {
      if (index === 0) return;
      siblings.splice(index, 1);
      siblings[index - 1].senses.push(node);
    });

    const remove = $(() => {
      const nested = node.senses.length || node.examples.length;
      if (nested && !confirm(`Удалить значение ${path} вместе с подзначениями и примерами?`))
        return;
      siblings.splice(index, 1);
    });

    return (
      <div class="mt-2 p-2 rounded border border-base-300 bg-base-100">
        <div class="flex flex-wrap gap-1 items-center">
          <span class="text-xs opacity-60 w-8">{path}</span>
          <select
            class="select select-bordered select-xs"
            onChange$={(e) =>
              (node.kind = (e.target as HTMLSelectElement).value as EditorNode['kind'])
            }
          >
            {(Object.keys(KIND_TITLES) as EditorNode['kind'][]).map((kind) => (
              <option key={kind} value={kind} selected={node.kind === kind}>
                {KIND_TITLES[kind]}
              </option>
            ))}
          </select>
          <input
            class="input input-bordered input-xs w-12"
            placeholder="№"
            title="Номер: 1, а, I, А"
            value={node.marker}
            onInput$={(e) => (node.marker = inputValue(e))}
          />
          <input
            class="input input-bordered input-xs w-24"
            placeholder="pinyin"
            value={node.pinyin}
            onInput$={(e) => (node.pinyin = inputValue(e))}
          />
          <input
            class="input input-bordered input-xs w-32"
            placeholder="пометки: гл. | разг."
            value={node.labels}
            onInput$={(e) => (node.labels = inputValue(e))}
          />
          <div class="flex gap-1 ml-auto">
            <button
              type="button"
              class="btn btn-xs"
              title="Выше"
              disabled={index === 0}
              onClick$={() => siblings.splice(index - 1, 2, siblings[index], siblings[index - 1])}
            >
              ↑
            </button>
            <button
              type="button"
              class="btn btn-xs"
              title="Ниже"
              disabled={index === siblings.length - 1}
              onClick$={() => siblings.splice(index, 2, siblings[index + 1], siblings[index])}
            >
              ↓
            </button>
            <button
              type="button"
              class="btn btn-xs"
              title="Уровнем выше"
              disabled={!parentSiblings}
              onClick$={moveOut}
            >
              ←
            </button>
            <button
              type="button"
              class="btn btn-xs"
              title="Сделать подзначением предыдущего"
              disabled={index === 0}
              onClick$={moveIn}
            >
              →
            </button>
            <button
              type="button"
              class="btn btn-xs btn-error btn-outline"
              title="Удалить значение"
              onClick$={remove}
            >
              ✕
            </button>
          </div>
        </div>

        <textarea
          class="textarea textarea-bordered textarea-xs w-full mt-1 leading-snug"
          rows={2}
          placeholder="Текст значения"
          value={node.text}
          onInput$={(e) => (node.text = (e.target as HTMLTextAreaElement).value)}
        />

        {node.examples.map((example, i) => (
          <ExampleEditor
            key={example.uid}
            example={example}
            list={node.examples}
            index={i}
            state={state}
          />
        ))}

        <div class="flex gap-1 mt-1">
          <button
            type="button"
            class="btn btn-xs btn-ghost"
            onClick$={() => node.examples.push(emptyExample())}
          >
            + пример
          </button>
          <button
            type="button"
            class="btn btn-xs btn-ghost"
            onClick$={() => node.senses.push(emptyNode())}
          >
            + подзначение
          </button>
          <button
            type="button"
            class="btn btn-xs btn-ghost"
            onClick$={() => siblings.splice(index + 1, 0, emptyNode())}
          >
            + значение после
          </button>
        </div>

        {node.senses.length > 0 && (
          <div class="ml-4">
            {node.senses.map((child, i) => (
              <SenseEditor
                key={child.uid}
                node={child}
                siblings={node.senses}
                index={i}
                path={`${path}.${i + 1}`}
                parentSiblings={siblings}
                parentIndex={index}
                state={state}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

export const WordEditor = component$(
  ({ state, isNew }: { state: EditorState; isNew?: boolean }) => {
    const showHelp = useSignal(false);
    const preview = toPreview(state);

    return (
      <div>
        <div class="flex flex-wrap gap-2">
          <label class="form-control">
            <span class="label-text">Слово</span>
            <input
              class="input input-bordered input-sm w-40"
              placeholder="汉字"
              value={state.chinese}
              disabled={!isNew}
              onInput$={(e) => (state.chinese = inputValue(e))}
            />
          </label>
          <label class="form-control">
            <span class="label-text">Традиционное написание</span>
            <input
              class="input input-bordered input-sm w-40"
              placeholder="漢字"
              value={state.tradChinese}
              onInput$={(e) => (state.tradChinese = inputValue(e))}
            />
          </label>
          <label class="form-control">
            <span class="label-text">Пиньинь</span>
            <input
              class="input input-bordered input-sm w-56"
              placeholder="hànzì"
              value={state.pinyin}
              onInput$={(e) => (state.pinyin = inputValue(e))}
            />
          </label>
          {isNew && (
            <label class="form-control">
              <span class="label-text">Язык перевода</span>
              <select
                class="select select-bordered select-sm select-warning"
                onChange$={(e) =>
                  (state.lang = (e.target as HTMLSelectElement).value as TranslationLang)
                }
              >
                {TRANSLATION_LANGS.map((lang) => (
                  <option key={lang} value={lang} selected={state.lang === lang}>
                    {LANG_TITLES[lang]}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div class="flex flex-wrap gap-2 items-center mt-4">
          <h3 class="text-lg font-bold">
            Перевод: <span class="badge badge-warning badge-lg">{LANG_TITLES[state.lang]}</span>
          </h3>
          <button type="button" class="btn btn-xs" onClick$={() => renumber(state.senses)}>
            Перенумеровать
          </button>
          <button
            type="button"
            class="link link-hover link-secondary text-sm"
            onClick$={() => (showHelp.value = !showHelp.value)}
          >
            {showHelp.value ? 'Скрыть разметку' : 'Разметка текста'}
          </button>
        </div>

        {showHelp.value && (
          <div class="text-sm bg-base-200 rounded p-2 mt-1">
            <div>
              {'{c:…}'} комментарий, {'{ref:上海}'} ссылка на слово, {'{l:разг.}'} пометка в тексте,
              {' {en:…}'} английский, {'{py:…}'} пиньинь, {'{b:…}'} жирный.
            </div>
            <div>
              Пример: <code>{'сын ({c:также о себе}); см. {ref:儿子}'}</code>. Пометки значения и
              примера разделяются «|». Номер ставится у значений, «Перенумеровать» выставляет номера
              по порядку.
            </div>
          </div>
        )}

        {state.senses.map((node, i) => (
          <SenseEditor
            key={node.uid}
            node={node}
            siblings={state.senses}
            index={i}
            path={`${i + 1}`}
            state={state}
          />
        ))}

        <div class="mt-2 text-sm opacity-70">Примеры без значения</div>
        {state.examples.map((example, i) => (
          <ExampleEditor
            key={example.uid}
            example={example}
            list={state.examples}
            index={i}
            state={state}
          />
        ))}

        <div class="flex gap-1 mt-2">
          <button
            type="button"
            class="btn btn-sm btn-outline"
            onClick$={() => state.senses.push(emptyNode())}
          >
            + значение
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost"
            onClick$={() => state.examples.push(emptyExample())}
          >
            + пример без значения
          </button>
        </div>

        <h3 class="text-lg font-bold mt-4">Предпросмотр</h3>
        <div class="p-3 rounded bg-base-200">
          <div class="font-bold text-xl text-success">{state.pinyin}</div>
          <ParsedTranslation
            senses={preview.senses}
            examples={preview.examples}
            showExamples={true}
          />
        </div>
      </div>
    );
  },
);
