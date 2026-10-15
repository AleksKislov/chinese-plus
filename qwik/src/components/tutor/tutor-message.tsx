import { component$, type Signal, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { grammarTopicUrl } from '../grammar/types';
import { WordTooltip } from '../common/tooltips/word-tooltip';
import { type FontSizeBtnsUnion, FontSizeMap } from '../common/content-cards/content-page-card';
import { type TooltipSegment } from '~/misc/helpers/content/parse-text-words';
import { type TutorMessage } from './types';
import { SmallAvatar } from '../common/ui/small-avatar';
import { userContext } from '~/root';

type TutorMessageProps = {
  message: TutorMessage;
  currentWord: Signal<DictWord | null>;
  showPinyin: boolean;
  showTranslation: boolean;
  fontSize: FontSizeBtnsUnion;
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

export const TutorMessageBubble = component$(
  ({ message, currentWord, showPinyin, showTranslation, fontSize }: TutorMessageProps) => {
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
              <div key={i} class="my-1">
                <div class={FontSizeMap[fontSize]}>
                  <Segments
                    segments={block.segments}
                    currentWord={currentWord}
                    showPinyin={showPinyin}
                  />
                </div>
                {showTranslation && block.ru && (
                  <div class="text-sm italic opacity-70 leading-normal">{block.ru}</div>
                )}
              </div>
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

// before the first message
export const TutorWelcomeBubble = component$(({ level }: { level: number }) => (
  <div class="chat chat-start">
    <TeacherAvatar />
    <div class="chat-header mb-1 opacity-70">王老师</div>
    <div class="chat-bubble bg-base-200 text-base-content">
      <p class="text-lg">你好！我是王老师。</p>
      {level >= 4 ? (
        <p>
          С HSK 4 я говорю с вами только по-китайски: перевод моих фраз — кнопкой вверху, а если
          что-то непонятно, попросите объяснить по-русски. 我们开始吧！
        </p>
      ) : (
        <p>
          Я ваш учитель китайского. Напишите мне что-нибудь — по-китайски или по-русски. Можно
          спросить про слово, грамматику или просто поболтать. Идеи — в карточке «Попробуйте
          спросить».
        </p>
      )}
    </div>
  </div>
));
