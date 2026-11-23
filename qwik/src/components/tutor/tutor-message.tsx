import {
  component$,
  type QRL,
  type Signal,
  Slot,
  useContext,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { grammarTopicUrl } from '../grammar/types';
import { WordTooltip } from '../common/tooltips/word-tooltip';
import { type FontSizeBtnsUnion, FontSizeMap } from '../common/content-cards/content-page-card';
import { type TooltipSegment } from '~/misc/helpers/content/parse-text-words';
import {
  dialectShortName,
  type TutorBlock,
  type TutorDialect,
  type TutorMessage,
  tutorAudioUrl,
} from './types';
import { SmallAvatar } from '../common/ui/small-avatar';
import { userContext } from '~/root';
import { isBrowser } from '@builder.io/qwik/build';
import { loadTutorAudio, TutorAudioBtn } from './tutor-audio-btn';

type TutorMessageProps = {
  message: TutorMessage;
  currentWord: Signal<DictWord | null>;
  showPinyin: boolean;
  showTranslation: boolean;
  fontSize: FontSizeBtnsUnion;
  chatId?: string; // set once the chat is saved; needed for audio
  ttsKey: string; // what the audio depends on: voice + speed, or the reply's dialect
  listenMode: boolean; // Chinese sentences hidden behind their audio (listening practice)
  dialect?: TutorDialect; // the reply is written and voiced in it (badge, no pinyin)
  showHints?: boolean; // the latest reply: offer its hints behind "Подсказки?"
  onHint$?: QRL<(text: string) => void>; // puts a hint into the message field
  hintsRuOnly?: boolean; // HSK 4+: hints only in Russian, the student says it in Chinese
};

// "Подсказки?": possible replies to the teacher's question, hidden until asked for
const TutorHints = component$(
  ({
    items,
    onHint$,
    ruOnly,
  }: {
    items: { text: string; ru?: string }[];
    onHint$: QRL<(text: string) => void>;
    ruOnly?: boolean;
  }) => {
    const shown = useSignal(false);
    if (!shown.value) {
      return (
        <button
          type="button"
          class="btn btn-ghost btn-xs normal-case font-normal opacity-70 mt-1"
          onClick$={() => (shown.value = true)}
        >
          Подсказки?
        </button>
      );
    }
    // HSK 4+: only the Russian idea of an answer; writing it in Chinese is the exercise
    if (ruOnly) {
      return (
        <div class="flex flex-wrap gap-1 mt-1">
          <span class="text-xs opacity-70 self-center">Скажите по-китайски:</span>
          {items
            .filter((it) => it.ru)
            .map((it, i) => (
              <span key={i} class="badge badge-outline badge-info h-auto py-1 text-sm">
                {it.ru}
              </span>
            ))}
        </div>
      );
    }
    return (
      <div class="flex flex-wrap gap-1 mt-1">
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            class="btn btn-outline btn-info btn-sm h-auto py-1 normal-case font-normal flex-col items-start"
            title="Вставить в поле ответа"
            onClick$={() => onHint$(it.text)}
          >
            <span class="text-base">{it.text}</span>
            {it.ru && <span class="text-xs opacity-70">{it.ru}</span>}
          </button>
        ))}
      </div>
    );
  },
);

// dictionary words get tooltips; Russian text and punctuation stay plain
const Segments = component$(
  ({
    segments,
    currentWord,
    showPinyin,
  }: {
    segments: TooltipSegment[];
    currentWord: Signal<DictWord | null>;
    showPinyin: boolean;
  }) => (
    <>
      {segments.map((seg, i) =>
        typeof seg === 'string' ? (
          <span key={i}>{seg}</span>
        ) : (
          <WordTooltip key={i} word={seg} currentWord={currentWord} showPinyin={showPinyin} />
        ),
      )}
    </>
  ),
);

// generated like user avatars (dicebear), with a fixed seed so it never changes
const TEACHER_AVATAR: NewAvatar = {
  type: 'bottts',
  seed: 'wang-laoshi-2026',
  background: 'b6e3f4',
};

const TeacherAvatar = () => (
  <div class="chat-image">
    <SmallAvatar userName="王老师" newAvatar={TEACHER_AVATAR} />
  </div>
);

type TutorCnBlockProps = Pick<
  TutorMessageProps,
  'chatId' | 'ttsKey' | 'currentWord' | 'showPinyin' | 'showTranslation' | 'fontSize' | 'listenMode'
> & { block: TutorBlock; blockInd: number; messageId: string; autoAudio?: boolean };

// a Chinese sentence with its audio; in listening mode only the audio until "Показать текст"
const TutorCnBlock = component$(
  ({
    block,
    blockInd,
    messageId,
    chatId,
    ttsKey,
    currentWord,
    showPinyin,
    showTranslation,
    fontSize,
    listenMode,
    autoAudio,
  }: TutorCnBlockProps) => {
    const revealed = useSignal(false);
    // audio state of the sentence (see TutorAudioBtn): kept here, because the button is
    // re-created when the sentence is revealed
    const playUrl = useSignal(block.audio ? tutorAudioUrl({ audio: block.audio }) : undefined);
    const loading = useSignal(false);
    const error = useSignal('');
    const lastTtsKey = useSignal(ttsKey);
    const autoStarted = useSignal(false);

    // a reply that just arrived: generate its audio right away (in order, one clip at a
    // time), so ▶ plays instantly. Not for old replies (they'd cost clips nobody plays).
    // Waits for chatId: a new lesson gets it right after its first reply.
    useTask$(({ track }) => {
      const id = track(() => chatId);
      if (!isBrowser || !autoAudio || !id || autoStarted.value || playUrl.value) return;
      autoStarted.value = true;
      loadTutorAudio({ chatId: id, messageId, block: blockInd }, { playUrl, loading, error });
    });

    // voice or speed changed: the clip no longer fits, ask the BE for the new one on click
    useTask$(({ track }) => {
      const key = track(() => ttsKey);
      if (key === lastTtsKey.value) return;
      lastTtsKey.value = key;
      playUrl.value = undefined;
    });

    // listening mode switched on again: hide everything again
    useTask$(({ track }) => {
      if (track(() => listenMode)) revealed.value = false;
    });

    // audio only for Chinese sentences, never for Russian explanations
    const audioBtn = chatId && (
      <TutorAudioBtn
        chatId={chatId}
        messageId={messageId}
        block={blockInd}
        state={{ playUrl, loading, error }}
      />
    );

    if (listenMode && chatId && !revealed.value) {
      return (
        <div class="my-1 flex items-center gap-2">
          {audioBtn}
          <span class="opacity-40 tracking-widest select-none" aria-hidden="true">
            ・・・
          </span>
          <button
            type="button"
            class="btn btn-ghost btn-xs normal-case font-normal opacity-70"
            onClick$={() => (revealed.value = true)}
          >
            Показать текст
          </button>
        </div>
      );
    }

    return (
      <div class="my-1">
        <div class={FontSizeMap[fontSize]}>
          <Segments segments={block.segments} currentWord={currentWord} showPinyin={showPinyin} />
          {audioBtn}
        </div>
        {showTranslation && block.ru && (
          <div class="text-sm italic opacity-70 leading-normal">{block.ru}</div>
        )}
      </div>
    );
  },
);

export const TutorMessageBubble = component$(
  ({
    message,
    currentWord,
    showPinyin,
    showTranslation,
    fontSize,
    chatId,
    ttsKey,
    listenMode,
    dialect,
    showHints,
    onHint$,
    hintsRuOnly,
  }: TutorMessageProps) => {
    const { name, newAvatar } = useContext(userContext);

    if (message.role === 'user') {
      // shown as typed; JSX escapes it
      return (
        <div class="chat chat-end">
          <div class="chat-image">
            <SmallAvatar userName={name} newAvatar={newAvatar} />
          </div>
          <div class="chat-bubble chat-bubble-primary whitespace-pre-wrap break-words">
            {message.text}
          </div>
        </div>
      );
    }

    const hints = message.blocks?.find((b) => b.kind === 'hints');

    // pinyin comes from the Mandarin dictionary: wrong for a reply written in a dialect
    const pinyin = showPinyin && !message.dialect;

    return (
      <div class="chat chat-start">
        <TeacherAvatar />
        <div class="chat-header mb-1 flex items-center gap-2">
          <span class="opacity-70">王老师</span>
          {message.dialect && (
            <span
              class="badge badge-info badge-outline badge-sm inline-flex tooltip tooltip-info tooltip-right"
              data-tip={`Ответ на диалекте: ${
                dialect?.label.replace(/,.*$/, '') || message.dialect
              }`}
            >
              {dialectShortName(dialect, message.dialect)}
            </span>
          )}
        </div>
        <div class={`chat-bubble bg-base-200 text-base-content ${pinyin ? 'leading-[2.2]' : ''}`}>
          {message.blocks?.map((block, i) =>
            block.kind === 'hints' ? null : block.kind === 'grammar' && block.slug ? (
              <Link
                key={i}
                href={grammarTopicUrl(block.slug)}
                class="btn btn-sm btn-outline btn-info h-auto py-1 my-1 normal-case font-normal text-left"
              >
                Грамматика: {block.text} →
              </Link>
            ) : block.kind === 'cn' ? (
              <TutorCnBlock
                key={i}
                block={block}
                blockInd={i}
                messageId={message._id}
                autoAudio={message.autoAudio}
                chatId={chatId}
                ttsKey={ttsKey}
                currentWord={currentWord}
                showPinyin={pinyin}
                showTranslation={showTranslation}
                fontSize={fontSize}
                listenMode={listenMode}
              />
            ) : (
              <div key={i} class="my-1">
                <Segments segments={block.segments} currentWord={currentWord} showPinyin={pinyin} />
              </div>
            ),
          )}
        </div>
        {showHints && onHint$ && hints?.items?.length ? (
          <div class="chat-footer">
            <TutorHints items={hints.items} onHint$={onHint$} ruOnly={hintsRuOnly} />
          </div>
        ) : null}
      </div>
    );
  },
);

export const TutorTypingBubble = component$(() => (
  <div class="chat chat-start">
    <TeacherAvatar />
    <div class="chat-header mb-1 opacity-70">王老师</div>
    <div class="chat-bubble bg-base-200 text-base-content">
      <span class="loading loading-dots loading-sm"></span>
    </div>
  </div>
));

// before the first message; the lesson picker comes in the slot
export const TutorWelcomeBubble = component$(({ level }: { level: number }) => (
  <div class="chat chat-start">
    <TeacherAvatar />
    <div class="chat-header mb-1 opacity-70">王老师</div>
    <div class="chat-bubble bg-base-200 text-base-content">
      <p class="text-lg">你好！我是王老师。</p>
      {level >= 4 ? (
        <p>
          С HSK 4 я говорю с вами только по-китайски: перевод моих фраз — кнопкой вверху, а если
          что-то непонятно, попросите объяснить по-русски. 今天我们做什么？
        </p>
      ) : (
        <p>
          Я ваш учитель китайского. Чем займёмся сегодня? Выберите урок или просто напишите мне —
          по-китайски или по-русски.
        </p>
      )}
      <Slot />
    </div>
  </div>
));
