import { component$, type Signal, Slot, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { grammarTopicUrl } from '../grammar/types';
import { WordTooltip } from '../common/tooltips/word-tooltip';
import { type FontSizeBtnsUnion, FontSizeMap } from '../common/content-cards/content-page-card';
import { type TooltipSegment } from '~/misc/helpers/content/parse-text-words';
import { type TutorBlock, type TutorMessage, tutorAudioUrl } from './types';
import { SmallAvatar } from '../common/ui/small-avatar';
import { userContext } from '~/root';
import { TutorAudioBtn } from './tutor-audio-btn';

type TutorMessageProps = {
  message: TutorMessage;
  currentWord: Signal<DictWord | null>;
  showPinyin: boolean;
  showTranslation: boolean;
  fontSize: FontSizeBtnsUnion;
  chatId?: string; // set once the chat is saved; needed for audio
  ttsKey: string; // current voice + speed
  listenMode: boolean; // Chinese sentences hidden behind their audio (listening practice)
};

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
> & { block: TutorBlock; blockInd: number; messageId: string };

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
  }: TutorCnBlockProps) => {
    const revealed = useSignal(false);
    // audio state of the sentence (see TutorAudioBtn): kept here, because the button is
    // re-created when the sentence is revealed
    const playUrl = useSignal(block.audio ? tutorAudioUrl({ audio: block.audio }) : undefined);
    const lastTtsKey = useSignal(ttsKey);

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
      <TutorAudioBtn chatId={chatId} messageId={messageId} block={blockInd} playUrl={playUrl} />
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

    return (
      <div class="chat chat-start">
        <TeacherAvatar />
        <div class="chat-header mb-1 opacity-70">王老师</div>
        <div
          class={`chat-bubble bg-base-200 text-base-content ${showPinyin ? 'leading-[2.2]' : ''}`}
        >
          {message.blocks?.map((block, i) =>
            block.kind === 'grammar' && block.slug ? (
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
                chatId={chatId}
                ttsKey={ttsKey}
                currentWord={currentWord}
                showPinyin={showPinyin}
                showTranslation={showTranslation}
                fontSize={fontSize}
                listenMode={listenMode}
              />
            ) : (
              <div key={i} class="my-1">
                <Segments
                  segments={block.segments}
                  currentWord={currentWord}
                  showPinyin={showPinyin}
                />
              </div>
            ),
          )}
        </div>
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
