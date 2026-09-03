# HSK mock exams — authoring guide

Exams live here as JSON, one file per exam, and are imported into the `hskexams`
collection with `server/scripts/import-hsk-exams.js`. Pictures and audio are
generated separately and uploaded to Object Storage; nothing binary lives in git.

```
content/hsk-exams/{version}/{level}/{slug}.json
        │          │         │       └── must match the "slug" field inside the file
        │          │         └────────── "1".."6" (old) or "1".."9" (new)
        │          └──────────────────── "old" (HSK 1-6) or "new" (HSK 3.0)
        └─────────────────────────────── scanned recursively by the import script
```

`old/1/old-1-exam-1.json` is a complete HSK 1 paper — 20 listening + 20 reading
questions across the eight parts of the real exam — and is the starting point to
copy for a new exam.

> **Scope note.** That paper was written from knowledge of the HSK 1 format, not
> transcribed from an official 模拟题. Its vocabulary was checked to stay inside
> the HSK 1 150-word list, but the item quality has not been reviewed by a
> teacher. Treat it as a solid draft, not as an authoritative exam.

## Workflow

```bash
# 1. write or generate the JSON, then check it — fast, never touches the DB
node scripts/import-hsk-exams.js --validate-only

# 2. list every picture/audio file the exam expects, with what to generate it from
node scripts/import-hsk-exams.js --validate-only --media-manifest=media-todo.json

# 3. see what the import would do
node scripts/import-hsk-exams.js

# 4. import for real (stays hidden until published)
node scripts/import-hsk-exams.js --apply

# 5. publish when it's ready
node scripts/import-hsk-exams.js --apply --publish
```

**Fixing an exam is the same loop.** Exams are upserted on `slug`, so edit the
JSON and re-run `--apply` — the existing document is replaced in place, never
duplicated. Deleting a question from the JSON deletes it on re-import too.
`isApproved` is not reset by a re-import, so correcting a typo in a published
exam does not silently unpublish it.

Useful flags: `--dir=` to scope to one folder, `--slug=` to import a single exam.

> The API caches exam responses in memory for 10 minutes (`cacheRoute('hsk-exams')`).
> The import script is a separate process, so it cannot invalidate that cache —
> after re-importing, either wait out the TTL or restart the API to see the change.

## Where it shows up

Once an exam is imported **and published**, it appears at:

- `/hsk/exams/` — the picker, filtered by HSK version and level
- `/hsk/exams/{slug}/` — the exam itself

Served by `GET api/hsk-exams` and `GET api/hsk-exams/:slug`
(`server/src/api/services/hsk-exams/`). Unpublished exams are invisible to both,
so `--apply` without `--publish` is a safe way to stage content.

Grading happens in the browser, so the API sends answer keys and explanations
along with the paper — the same approach as the existing HSK vocabulary tests.
These are practice papers, not invigilated exams; if that ever needs to change,
strip `correctAnswer`/`explanationRu` in `get-exam-by-slug.js` and add a scoring
endpoint.

## File format

Nesting mirrors a real exam paper: `exam → section → part → question`.

```jsonc
{
  "version": "old",              // "old" | "new"
  "level": "1",
  "slug": "old-1-exam-1",        // unique, lowercase/digits/dashes — the upsert key
  "ind": 0,                      // ordering within the level
  "durationMinutes": 40,
  "title": { "cn": "…", "ru": "…" },
  "descriptionRu": "…",
  "sections": [
    {
      "type": "listening",       // "listening" | "reading" | "writing"
      "titleCn": "一、听力",
      "titleRu": "Аудирование",
      "durationMinutes": 15,
      "parts": [
        {
          "ind": 0,              // 第一部分 is ind 0
          "instructionCn": "…",
          "instructionRu": "…",
          "exampleRu": "…",      // optional worked example (例如)

          // Shared answer set for match-type parts: the A–F picture strip, or
          // the word bank of a fill-in-the-blank part. Omit for parts whose
          // questions carry their own options.
          "bank": [
            { "label": "A", "textRu": "…", "hasImage": true, "imagePrompt": "…" }
          ],

          "questions": [
            {
              "questionType": "listening-picture-match",
              "promptCn": "…",       // what the taker reads; omit for pure audio
              "promptRu": "…",
              "pinyin": "…",
              "ttsText": "…",        // exact spoken script (listening only)
              "hasAudio": true,
              "hasImage": false,
              "imagePrompt": "…",    // required when hasImage is true
              "options": [           // omit when the part has a bank
                { "label": "A", "textCn": "…", "pinyin": "…", "textRu": "…" }
              ],
              "correctAnswer": "A",  // a label from options/bank, or literal text
              "explanationRu": "…"   // shown after grading
            }
          ]
        }
      ]
    }
  ]
}
```

`ind` and `number` are filled in automatically from array order — you only need
to set them by hand to override. Question numbering runs continuously across
each section, as on the paper.

### Question types

| `questionType` | Answered from | Needs |
| --- | --- | --- |
| `listening-true-false` | `options` (✓/✗) | `ttsText`, usually a picture |
| `listening-picture-match` | part `bank` | `ttsText`, bank pictures |
| `listening-choice` | `options` | `ttsText` with dialogue + 问 |
| `reading-true-false` | `options` (✓/✗) | `promptCn`, a picture |
| `reading-picture-match` | part `bank` | `promptCn`, bank pictures |
| `reading-sentence-match` | part `bank` | `promptCn` |
| `reading-fill-blank` | part `bank` | `promptCn` with `（ ）` |
| `reading-choice` | `options` | `promptCn` passage |
| `writing-sentence-order` | literal text | `correctAnswer` = full sentence |
| `writing-character` | literal text | `pinyin`, `correctAnswer` = character |
| `writing-essay` | not auto-graded | `promptRu` |

The validator enforces this table: a bank-answered question with no bank, an
option-answered question with no options, or a `correctAnswer` that matches no
label are all hard errors that abort the whole import.

Options may carry pictures instead of text (`hasImage` + `imagePrompt` on each
option) — that is HSK 1 listening part 2, where the three choices are pictures
belonging to the question rather than to a bank shared across the part.


## Generating the text content

Prompt to give an LLM, one exam at a time:

> You are writing a mock HSK {VERSION} level {LEVEL} exam for a Russian-speaking
> audience. Output **only** a JSON object matching the schema below — no prose,
> no markdown fence.
>
> Hard constraints:
> - Every Chinese character and word must be within the official HSK level
>   {LEVEL} vocabulary. Do not use a single word from a higher level. If you are
>   unsure whether a word is in scope, pick a different one.
> - Grammar patterns must also be level-appropriate.
> - All Russian text (`textRu`, `promptRu`, `instructionRu`, `explanationRu`) must
>   be natural Russian, not a literal calque from Chinese.
> - `pinyin` uses tone marks (nǐ hǎo), not tone numbers.
> - Exactly one option is correct; distractors must be plausible but
>   unambiguously wrong. Never make two options defensible.
> - `correctAnswer` must exactly match one `label` from that question's `options`,
>   or from the part's `bank` for match-type questions.
> - Spread the correct answers across labels — do not make A correct most of the time.
> - `explanationRu` explains *why* the answer is right, in one sentence.
>
> Structure: {paste the section/part layout you want, e.g. "listening: 5
> true-false, 5 picture-match, 5 dialogue-choice; reading: 5 picture-match, 5
> fill-blank, 5 sentence-match, 3 passage-choice; writing: 2 characters"}
>
> Schema and a worked example: {paste this README's format section and
> `new/1/new-1-exam-1.json`}

Then run `--validate-only` on the result. The validator catches broken answer
keys, missing prompts and bad labels, but it **cannot** check that vocabulary is
in level or that a distractor is genuinely wrong — read the exam before
publishing. Cross-check the words against the `hskwords` collection (new HSK) or
`lexicon` (old HSK).

## Generating pictures

Set `hasImage: true` and write an `imagePrompt` on the question (or on the bank
entry). The manifest then tells you the exact storage key for each file.

Keep every prompt in one house style so the exam does not look like a collage.
The suffix used throughout the example exam:

> `{subject description}. Simple flat vector illustration, plain white
> background, single clear subject, no text, no letters, no Chinese characters,
> bright friendly colors, textbook illustration style.`

Rules that matter for a test rather than a decoration:

- **No text of any kind in the image.** A leaked character or a Latin label can
  give the answer away or confuse the taker. Say so in the prompt every time.
- **One unambiguous subject.** The picture has to be identifiable as exactly the
  target word — a mug of tea must not read as coffee, 米饭 must not read as noodles.
- **Distractor pictures in the same bank must be clearly distinguishable** from
  each other and rendered in the same style, so the choice tests comprehension
  rather than image quality.
- Export as **WebP** (the key convention the import script emits) and keep them
  small — these are illustrations, not photographs.

## Generating audio

Set `hasAudio: true` and put the exact spoken script in `ttsText`. For dialogue
questions, write it the way the real exam is read, with speaker markers and the
question at the end:

```
女：你好，你叫什么名字？ 男：我叫王明。 问：男的叫什么名字？
```

`ttsText` is stored in the DB as well as the JSON, so transcripts can be revealed
after grading and audio can be regenerated later without the source file.

**Do not feed `ttsText` to TTS verbatim for dialogues.** The 男/女/问 markers are
transcript convention and would be read aloud. The media manifest splits them for
you into `ttsLines`:

```jsonc
{
  "kind": "audio",
  "key": "hsk-exams/old/1/old-1-exam-1/listening/p2/q0.mp3",
  "ttsText": "女：你好，你是医生吗？ 男：是，我是医生。",
  "ttsLines": [
    { "speaker": "female", "text": "你好，你是医生吗？" },
    { "speaker": "male", "text": "是，我是医生。" }
  ]
}
```

Render each line with its own voice and concatenate into one MP3. `ttsLines` is
`null` when the script has no markers — then `ttsText` is a single narrator line
and can be synthesised directly.

The project already has a Google Cloud TTS setup for HSK word audio at
`src/api/services/newhskwords/write-mp3.js` — the same client and voice config
(`languageCode: 'zh'`, `ssmlGender: 'FEMALE'`) is the natural thing to reuse.
For exam audio specifically:

- **Standard Mandarin, clearly enunciated, slightly slower than natural speech**
  at levels 1–3; closer to natural pace from level 4 up.
- Use **two distinct voices** for 男/女 dialogue lines if your TTS supports it —
  a single voice reading both sides makes dialogue questions much harder than
  they are on the real exam.
- Insert a short pause between the dialogue and the 问 question line.
- Export as **MP3** to match the key convention.

## Uploading media

`--media-manifest` writes the full list of files to produce:

```jsonc
[
  {
    "slug": "new-1-exam-1",
    "media": [
      {
        "kind": "audio",
        "key": "hsk-exams/new/1/new-1-exam-1/listening/p0/q0.mp3",
        "ttsText": "我喝茶。",
        "note": "listening part 0 question 0"
      },
      {
        "kind": "image",
        "key": "hsk-exams/new/1/new-1-exam-1/listening/p0/q0.webp",
        "prompt": "A young woman sitting at a table holding a small cup of hot tea …",
        "note": "listening part 0 question 0"
      }
    ]
  }
]
```

`key` is the object key inside the existing `buyilehu` bucket — upload each file
there and it will resolve. The keys are derived purely from the exam JSON by
`src/api/services/hsk-exams/media-paths.js`, so media can be produced and
uploaded long after the exam is imported, and re-uploading a file replaces it
without any DB change.
