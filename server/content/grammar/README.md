# Grammar content

Grammar topics by HSK 3.0 level, following the grammar syllabus
(HSK 考试大纲, 2025-11 — HSK（一级）语法 etc.). One file per level:
`{level}.json` with level `1`..`6` or `789`.

Imported into the `grammars` collection by `scripts/import-grammar.js` and
shown on `/start/textbook/?lvl={level}` (level page) and
`/start/textbook/{slug}/` (topic page).

## Workflow

Run from `server/`:

```bash
node scripts/import-grammar.js --validate-only    # checks the files, no DB
node scripts/import-grammar.js                    # dry run: what would be created / updated / deleted
node scripts/import-grammar.js --apply            # write (add --level=1 for one file)
node scripts/generate-grammar-audio.js            # list examples without audio
node scripts/generate-grammar-audio.js --apply    # SiliconFlow TTS -> bucket -> `audio` field
```

Then clear the cache: `POST /api/project/cache/refresh?tag=grammar` (or restart the server).

Re-running the import is safe: topics are upserted on `slug`, topics that
were removed from a file are deleted, and audio is kept for every sentence
whose `cn` did not change. Edited or new sentences get audio on the next
`generate-grammar-audio.js --apply`.

## File format

```jsonc
{
  "level": "1",
  "source": "HSK 考试大纲 (2025-11), HSK（一级）语法",
  "topics": [
    {
      "slug": "hsk1-modal-verbs",          // unique across all levels, [a-z0-9-]
      "category": "word-classes",          // see categories below
      "group": "词类 · 动词",               // syllabus path, informational
      "title": { "cn": "能愿动词", "ru": "Модальные глаголы: 会、能、想、要、可以" },
      "items": ["会", "能", "想", "要", "可以"],   // syllabus items the topic covers
      "summary": "One or two sentences: what it is and when it is used.",
      "rules": [
        {
          "title": "会 — уметь, 能 — мочь",
          "pattern": "会 / 能 + глагол",     // optional
          "text": "Optional explanation.",   // optional
          "examples": [                      // 2-3 per rule
            { "cn": "我会说汉语。", "py": "Wǒ huì shuō Hànyǔ.", "ru": "Я умею говорить по-китайски." }
          ]
        }
      ],
      "notes": ["Optional: common mistakes, exceptions."]
    }
  ]
}
```

Topic order in the file is the order on the site. Categories, in syllabus order:

| key | syllabus | on the site |
|---|---|---|
| `morphemes` | 语素 | Морфемы |
| `word-classes` | 词类 | Части речи |
| `phrases` | 短语 | Словосочетания |
| `sentence-parts` | 句子成分 | Члены предложения |
| `sentence-types` | 句子的类型 | Типы предложений |
| `aspects` | 动作的态 | Виды действия |
| `expressions` | 特殊表达法 | Особые способы выражения |
| `discourse` | 语段（句群） | Связный текст |

### Examples

- `cn` — the sentence with Chinese punctuation, segmented into words with
  single spaces, following the words of `py`: `"小 王，你 好！"`. Punctuation
  sticks to the word before it. The spaces give the word tooltips (a sentence
  without spaces falls back to nodejieba and gets an import warning); they are
  removed for TTS and for the audio file name, so re-segmenting keeps the audio.
- `py` — sentence case, word-segmented, same punctuation as `cn`
  (`?` for `？`). Mark 不 / 一 tone changes as spoken (`bú shì`, `yí ge`,
  `yìqiān`); 3rd-tone sandhi is not marked.
- `ru` — natural Russian, not word-for-word.
- Use vocabulary of the topic's level or lower. The import warns about words
  above the level (checked against `content/hsk-words/hsk3-2025.json`; words
  named in the syllabus grammar items, like 杯 or 没, count as known).

## Audio

`scripts/generate-grammar-audio.js` synthesizes every example without
`audio` with SiliconFlow and uploads it to the bucket as
`audio/grammar/{sha1(cn) first 16 hex}.mp3`; the site plays it from
`CONST_URLS.myAudioURL + audio`. The file name depends only on the sentence,
so identical sentences share one file and a file already in the bucket is
reused without calling TTS.

Env (in `config/.env.dev` / `.env.prod`):

| var | default |
|---|---|
| `SILICONFLOW_API_KEY` | required |
| `SILICONFLOW_API_URL` | `https://api.siliconflow.com/v1` (`https://api.siliconflow.cn/v1` for a .cn account) |
| `SILICONFLOW_TTS_MODEL` | `fishaudio/fish-speech-1.5` (or `FunAudioLLM/CosyVoice2-0.5B`) |
| `SILICONFLOW_TTS_VOICE` | `anna` (also alex, bella, benjamin, charles, claire, david, diana) |
| `SILICONFLOW_TTS_SPEED` | `0.75` |

Try a few first: `--apply --limit=3 --out=./audio/grammar` keeps local copies to listen to.
