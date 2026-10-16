# AI tutor (王老师)

Chat with an AI Chinese teacher at `/tutor/`. Logged-in users only (logged-out visitors see a
short description with login / register links).

| Stage | What | Status |
|---|---|---|
| 1 | Text chat: DeepSeek via SiliconFlow | done |
| 2 | TTS for the tutor's Chinese sentences: MiniMax | done |
| 3 | Speech-to-text for the user | planned: OpenAI `gpt-4o-mini-transcribe` (SiliconFlow intl has no STT; it also handles Russian mixed into Chinese) |

## Services and env (`server/config/.env.dev` / `.env.prod`)

| Env | Default | Notes |
|---|---|---|
| `SILICONFLOW_API_KEY` | — | required, chat |
| `SILICONFLOW_API_URL` | `https://api.siliconflow.com/v1` | |
| `SILICONFLOW_CHAT_MODEL` | `deepseek-ai/DeepSeek-V4.1-Flash` | check ids: `GET /v1/models` |
| `MINIMAX_API_KEY` | — | required, TTS |
| `MINIMAX_API_URL` | `https://api.minimax.io/v1` | |
| `MINIMAX_TTS_MODEL` | `speech-2.8-turbo` | or `speech-2.8-hd` |
| `MINIMAX_TTS_VOICE` | `Chinese (Mandarin)_Lyrical_Voice` | the "teacher" voice (default choice) |
| `MINIMAX_TTS_SPEED` | `0.9` | only when no speed is given; users pick novice / normal / advanced |
| `TUTOR_USER_DAILY_LIMIT` | 100 | messages per user per day |
| `TUTOR_USER_DAILY_TTS` | 200 | new audio clips per user per day (existing clips are free) |
| `TUTOR_GLOBAL_DAILY_LIMIT` | 5000 | all users, per process: budget guard |
| `TUTOR_PRICE_INPUT_PER_M` / `_OUTPUT_PER_M` / `_CACHED_PER_M` | 0.15 / 0.6 / = input | USD per 1M tokens, for cost estimates |
| `TUTOR_PRICE_TTS_PER_M_CHARS` | 60 (100 if model ends with `-hd`) | USD per 1M TTS characters (MiniMax speech-2.8) |
| `METRICS_PORT` | 9464 | Prometheus metrics |

## Files

Backend (`server/`):
- `routes/api/tutor.js`: routes, mounted at `/api/tutor` in `server.js`
- `src/api/services/tutor/`
  - `send-message.js`: `POST /messages`, the main flow (below)
  - `chats.js`: list / get / delete chats, clear memory, admin list of all chats
  - `tts.js`: `POST /tts`, audio of one Chinese block
  - `prompts.js`: system prompt, summary prompt, `parseReply` (JSON → blocks), text cleaning
  - `segment.js`: nodejieba segmentation + dictionary lookup for word tooltips
  - `grammar-catalog.js`: grammar lessons offered to the model (cached 1h)
  - `summarize.js`: background "memory" updates
  - `limits.js`: daily quotas, one request at a time per user, global cap
  - `usage.js`: wraps every LLM / TTS call: log line, metrics, `TutorUsage`
  - `consts.js`: all limits
  - `index.js`: `safe()` wrapper, never sends error text to the client
- `src/api/services/_misc/siliconflow-chat.js`, `_misc/minimax-tts.js`: API clients
- `src/models/TutorChat.js`, `TutorProfile.js`, `TutorUsage.js`
- `src/metrics.js`: prom-client registry + metrics server

Frontend (`qwik/src/`):
- `routes/tutor/index.tsx`: the page (loaders, send flow, sticky toolbar and input, read-only mode)
- `components/tutor/`: `tutor-message.tsx` (bubbles, avatars, welcome), `tutor-audio-btn.tsx`,
  `tutor-chats-card.tsx` (lessons + memory), `tutor-admin-chats-card.tsx`, `tutor-tips-card.tsx`
  (suggestions per HSK level), `types.ts`
- `misc/actions/tutor/tutor-api.ts`: `server$` functions (send message, audio, sample, voice /
  speed, listen mode). `server$`, not `globalAction$`: actions re-run all route loaders (the
  whole lesson with tooltips) after every click. They run on the FE server (see CLAUDE.md) and use
  plain `fetch` so the BE error message (limits) reaches the user. `delete-chat.ts` and
  `clear-memory.ts` stay `globalAction$` (rare; the reload is fine there).
- `routes/tutor/index.tsx` resets the messages only when another chat is opened (`chatData`
  changes for the same chat after any action) and scrolls only when a message is added or the
  teacher starts typing.
- Menu link "AI-учитель" in `components/common/layout/header/header.tsx`. The header has
  `relative z-30` so its menus open above sticky page elements (the tutor toolbar is z-20).

## Data (MongoDB)

- `tutorchats`: one lesson. `user`, `num` (lesson number of the user), `title` (first message),
  `level` (HSK 1-6), `summarizedCount`, `createdAt`, `updatedAt`, `messages[]`:
  - user: `{ role: 'user', text }`, shown as typed
  - assistant: `{ role: 'assistant', blocks[] }`, block = `{ kind, text, ru?, slug?, audio?, words[] }`
    - `cn`: Chinese sentence(s) + Russian translation `ru`; may get `audio`
    - `note`: Russian explanation (one per paragraph), may quote Chinese words
    - `grammar`: link to a grammar lesson, `slug` checked against the DB, `text` = lesson title
    - `words`: segmented text; on read it is replaced by `segments` (dictionary objects or plain
      strings) for `WordTooltip`, like grammar examples
- `tutorprofiles`: one per user. `tts { voice, speed }` (audio settings, keys), `memory` (summary of past lessons, ≤1500 chars), `level` (last
  chosen), `usage: { day, count, ttsCount }` (daily quotas, reset when `day` changes)
- `tutorusages`: one per user per day. Requests, tokens (prompt / completion / cached), `costUsd`,
  `ttsRequests`, `ttsChars`, `ttsCostUsd`, `failedRequests` (`costUsd` = LLM only). Per-user cost lives here, not in metrics.

## Main flow: `POST /api/tutor/messages` `{ text, level, chatId? }`

1. Validate: text ≤1000 chars after cleaning (control / invisible / bidi chars removed), level 1-6,
   chatId an ObjectId of the user's own chat. No chatId → new lesson (and the previous lesson is
   summarized in the background).
2. Limits: one request at a time per user, global daily cap, user daily quota (refunded if the
   LLM call fails).
3. Prompt = system prompt (rules + HSK level + grammar lessons of this level and the one below +
   the student's memory) + last 16 messages + the new message. JSON mode, max 1500 tokens.
4. `parseReply`: strict JSON → blocks; broken or cut-off JSON keeps only complete blocks (never
   shows raw JSON); plain text becomes a note; URLs and markdown stripped; grammar slugs only from
   the list offered (max 2, deduped); limits on block count and length.
5. `cn` / `note` blocks are segmented (nodejieba on Chinese runs only), the message pair is saved,
   tooltips attached, response `{ chat, messages, usage }`.
6. Every 20 new messages the chat is folded into `TutorProfile.memory` in the background.

## Lesson types (`lesson-focus.js`, `TutorChat.focus`)

Chosen under the teacher's greeting of a new lesson (`tutor-lesson-picker.tsx`); fixed for the
whole lesson. Typing a message without choosing = a normal chat.

- `chat` "Свободный разговор": nothing extra.
- `vocab` "Повторить мои слова": up to 50 words from «Мой словарик» (`userwords` → `Dictionary`)
  + «Мой словарик HSK» (`words` → `Lexicon`): the 20 newest + random older ones, picked once at
  the start and saved in `focus.words` (stable prompt → prompt cache). Chinese only, no
  translations. The prompt asks for batches of 3-5 words with quizzes.
- `text` "Обсудить текст": 3 suggestions (`GET /api/tutor/texts?level=`): bookmarks (Закладки =
  `User.finished_texts`) first, then random approved texts of the level (HSK 1-2 → text level 1,
  3-4 → 2, 5-6 → 3), or a link to a text page. The link is never opened: only the id is taken
  from `/read/texts/<id>`, and only approved texts are loaded. Chinese of the first page
  (`pages[0]` for long texts), ≤1500 chars, `<` `>` removed, saved in `focus.text`, sent inside
  `<lesson_text>` marked as user-written data.
- `vocab` / `text` start without a student message: `POST /messages { lesson, text: '' }`; the
  model gets `LESSON_KICKOFF` as the user turn (not stored, and put back in front of the history
  later so it starts with a user turn).
- Lesson head shows the type (and a link to the text); titles: "Повторение моих слов",
  "Текст: …". Clients get `focus` without `words` / `text`.

## Teaching rules (in `prompts.js`)

- HSK 1-3: explanations in Russian (`note`), examples and conversation in Chinese (`cn`).
- HSK 4-6: Chinese only (in `cn` blocks, translation behind the button); Russian only when the
  student asks, clearly doesn't understand, or a nuance can't be explained simply.
- Encouragement: earned and specific praise (correct sentence, new word used, mistake fixed), every few
  messages, short Chinese phrases (很好！你进步了！); progress vs. old mistakes from the memory.
- Short replies (~120 words, 2-6 blocks) unless the student asks for detail. No pinyin, no
  markdown (the site shows pinyin and translations).
- FE defaults: pinyin on for HSK 1-2, translation hidden for HSK 4+.

## TTS (stage 2)

- Only `cn` blocks get a ▶ button; Russian is never voiced.
- `POST /api/tutor/tts { chatId, messageId, block }`. The text is read from the DB, never sent
  by the client, so the endpoint can't voice arbitrary text.
- File: Yandex bucket (`YA_S3_BUCKET`, shared by dev and prod), key
  `audio/tutor/{sha1(model|voice|speed|text)[0:16]}.mp3`, public-read, immutable cache.
  Played from `CONST_URLS.myAudioURL + 'tutor/….mp3'`. The same phrase is generated once for all
  users; changing voice / speed / model gives new files automatically.
- The path is saved on the block (`messages.$.blocks.N.audio`) for the last settings used.
- `tutoraudios` collection: index of clips that exist in the bucket (`path`, unique), written on
  generation and on bucket hits. `markAvailableAudio` (in `getChat` and the send-message reply)
  sets `audio` on every `cn` block whose clip exists for the viewer's voice + speed (one `$in`
  query) and removes it from the rest.
- FE: a filled ▶ (btn-info) = audio exists, plays at once; a faded ghost ▶ = generated on the
  first click. After a voice / speed change all buttons show "not generated" until clicked.
- Generated on the first click, not in advance (pay only for what is listened to).
- Speed: a clip exists if it is in the `tutoraudios` index (no bucket request; clips from before
  the index are generated once more). A new clip is returned to the client right away as base64
  (`data`) and played from it; the upload, the index entry and the block's `audio` happen in the
  background, in that order, so a path is recorded only once the file is in the bucket (a failed
  upload records nothing; the next click generates it again). The block lookup loads only the
  requested message (`messages.$` projection), in parallel with the user's settings.

### Listening mode

- Toolbar toggle "Аудирование" (remembered per user: `TutorProfile.listenMode`, `PUT /api/tutor/listen-mode`,
  returned by `GET /chats`): every `cn` block shows only its ▶ and
  "Показать текст" (`TutorCnBlock` in `tutor-message.tsx`); a click reveals that sentence.
  Turning the mode on again hides all sentences again. Russian `note` blocks stay visible.

### Voice and speed (per user)

- Toolbar dropdown (`tutor-voice-settings.tsx`): voice select, 3 speeds, "Прослушать" sample.
- Choices live in `server/src/api/services/tutor/consts.js`: `TTS_VOICES` (key → MiniMax id +
  Russian label; `teacher` = `MINIMAX_TTS_VOICE`) and `TTS_SPEEDS` (novice 0.75, normal 1,
  advanced 1.2). The client only sends keys; ids never leave the server. Verify / change voice
  ids with `~/Desktop/mm-test.sh voices`.
- Saved in `TutorProfile.tts { voice, speed }` via `PUT /api/tutor/settings`; returned by
  `GET /chats` with `ttsChoices`.
- `POST /api/tutor/tts/sample { voice, speed }` voices the fixed `TTS_SAMPLE_TEXT` (cached like
  any clip), so the user can try a voice.
- On the FE, the audio state of a sentence (`playUrl`) lives in `TutorCnBlock`, not in
  `TutorAudioBtn` (re-created by "Показать текст"); a new `ttsKey(voice, speed)` drops it.

## Security model

- The model has no tools and no data access. The prompt holds only rules, public grammar titles,
  the user's own memory and the user's own chat. Nothing secret is in it; API keys exist only in
  the BE env. Worst case of a prompt injection: an off-topic reply.
- Every query is scoped to `req.user.id`. Exception: admins (`getUserPrivileges`) can read any
  chat and its audio (read-only). Sending, deleting, clearing memory are owner-only even for
  admins. Someone else's chat answers 404, same as a missing one.
- Model output is parsed and rendered as escaped text (no `dangerouslySetInnerHTML`). Links come
  only from `grammar` blocks, whose URLs the site builds from checked slugs.
- Upstream errors (SiliconFlow, MiniMax) are logged, never sent to the client.
- Planned for DB data (texts, dictionary): give the model a few fixed, read-only, parameter-validated
  lookup functions over public content only; send texts as title / level / tags (user-written texts
  may contain injected instructions); the server builds every link.

## Admin

- Sidebar card "Уроки пользователей (админ)": latest 50 lessons of all users
  (`GET /api/tutor/all-chats`, `adminAuth`; note: `adminAuth` lets everyone in in development).
- Opening one shows it read-only (`readOnly: true`, `owner` in the response; input hidden).

## Monitoring

- Logs (Loki via Alloy): `{container="chin_plus_be"} |= "tutor: llm call"` (and `tutor: tts call`),
  with user, kind, tokens / chars, seconds, cost.
- Metrics: `src/metrics.js` on port 9464, NOT published (port 10000 is public), scraped by Alloy
  (`monitoring/alloy-config.alloy`, job `chin_plus_be`; `expose: 9464` in `docker-compose.prod.yml`).
  `tutor_llm_requests_total{kind,status}`, `tutor_llm_tokens_total{kind,type}`,
  `tutor_llm_cost_usd_total{kind}`, `tutor_llm_request_duration_seconds{kind}`,
  `tutor_rejected_total{reason}`, `tutor_tts_requests_total{status}`, `tutor_tts_chars_total`,
  `tutor_tts_cost_usd_total`.
  No user labels (cardinality); per-user numbers are in `tutorusages`.

## Known limits / next steps

- Limits and locks are in process memory: fine for one BE container, move to the DB if scaled out.
- No streaming yet: the reply arrives in one piece (3-10 s).
- Stage 3 (STT): see the table at the top. Learners' STT auto-corrects mistakes; real pronunciation
  feedback would need a pronunciation-assessment API (Azure Speech zh-CN, SpeechSuper).
- Dialects: MiniMax has Cantonese (`language_boost: "Chinese,Yue"`), no Sichuanese.
  CosyVoice (SiliconFlow) claims dialects via an instruction like "用四川话说"; untested via API.
- DB lookups for the model (texts, dictionary) via function calling: designed above, not built.
