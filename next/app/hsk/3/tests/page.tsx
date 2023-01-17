"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { apiGetReq } from "../../../../src/helpers/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faSyncAlt } from "@fortawesome/free-solid-svg-icons";

import constUrls from "../../../../src/helpers/constants/urls";
import { parseRussian } from "../../../../src/helpers/translation";
import TableCard from "../../../../src/components/hsk/table-card";
import { getRandElem } from "../../../../src/helpers/tools";
import { shuffleArr } from "../../../../src/helpers/tools/shuffle-arr";
import TypingGame from "../../../../src/components/hsk/typing-game";

const OPTIONS_NUM = 5;
const QUEST_NUM = 5;

type TestAnswers = {
  [key: number]: number;
};

enum QuestKinds {
  Chars,
  Pinyin,
  Audio,
}

export default function NewHskTests({}) {
  const searchParams = useSearchParams();
  const [level, setLevel] = useState("1");
  const [hskWords, setHskWords] = useState<TestWord[] | null>(null);
  const [audioQuests, setAudioQuests] = useState<TestWord[] | null>(null);
  const [pinyinQuests, setPinyinQuests] = useState<TestWord[] | null>(null);
  const [charsQuests, setCharsQuests] = useState<TestWord[] | null>(null);
  const [audioAnswers, setAudioAnswers] = useState<TestAnswers>({});
  const [pinyinAnswers, setPinyinAnswers] = useState<TestAnswers>({});
  const [charsAnswers, setCharsAnswers] = useState<TestAnswers>({});

  useEffect(() => {
    preInit();
  }, [level]);

  function preInit() {
    const lvl = searchParams.get("lvl") || "1";
    setLevel(lvl);
    loadRandWords(lvl);
  }

  useEffect(() => {
    init(hskWords);
  }, [hskWords]);

  function collectOptions(answer: TestWord): TestWord[] | null {
    if (!hskWords) return null;
    const arr: TestWord[] = [];
    arr[0] = answer;
    while (arr.length < OPTIONS_NUM) {
      const randOpt = getRandElem(hskWords)!;
      if (!arr.some((x) => x.id === randOpt.id)) {
        arr.push(randOpt);
      }
    }
    shuffleArr(arr);
    return arr;
  }

  async function loadRandWords(lvl: string) {
    setHskWords(null);
    try {
      const data = await apiGetReq(`/api/newhskwords/all?hsk_level=${lvl}`);
      setHskWords(data.map((x: NewHskWordType) => new TestWord(x)));
    } catch (err) {
      console.log(err);
    }
  }

  function init(hskWords: TestWord[] | null) {
    if (hskWords) {
      setCharsQuests(hskWords.slice(0, QUEST_NUM));
      setPinyinQuests(hskWords.slice(QUEST_NUM, QUEST_NUM * 2));
      setAudioQuests(hskWords.slice(QUEST_NUM * 2, QUEST_NUM * 3));
    } else {
      setCharsQuests(null);
      setPinyinQuests(null);
      setAudioQuests(null);
    }
    setAudioAnswers({});
    setPinyinAnswers({});
    setCharsAnswers({});
  }

  const clickCheckBtn = (q: QuestKinds) => {
    let ansObj = null;
    let questObj = null;
    let classPrefix = "bg"; // or btn
    switch (q) {
      case QuestKinds.Chars:
        questObj = charsQuests;
        ansObj = charsAnswers;
        break;
      case QuestKinds.Pinyin:
        questObj = pinyinQuests;
        ansObj = pinyinAnswers;
        break;
      case QuestKinds.Audio:
        questObj = audioQuests;
        ansObj = audioAnswers;
        classPrefix = "btn";
        break;
    }
    for (let i = 0; i < QUEST_NUM; i++) {
      const id = questObj![i].id;
      const questNode = document.getElementById(`${q}_${id}`);
      questNode?.classList.remove(
        `${classPrefix}-info`,
        `${classPrefix}-success`,
        `${classPrefix}-danger`
      );
      const isCorrect = ansObj[id] === id;
      questNode?.classList.add(isCorrect ? `${classPrefix}-success` : `${classPrefix}-danger`);
    }
  };

  const pronounce = (id: number, lvl: string) => {
    new Audio(`${constUrls.myAudioURL}newhsk/band${lvl}/${id}.mp3`).play();
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>, corAnswer: TestWord, q: QuestKinds) => {
    const trgt = e.target as HTMLSelectElement;
    const input = { [corAnswer.id]: +trgt.value };
    switch (q) {
      case QuestKinds.Chars:
        setCharsAnswers({ ...charsAnswers, ...input });
        break;
      case QuestKinds.Pinyin:
        setPinyinAnswers({ ...pinyinAnswers, ...input });
        break;
      case QuestKinds.Audio:
        setAudioAnswers({ ...audioAnswers, ...input });
        break;
    }
  };

  const SelectOptions = (corAnswer: TestWord, q: QuestKinds) => {
    const options = collectOptions(corAnswer);
    return (
      <select onChange={(e) => handleSelect(e, corAnswer, q)} className='form-select'>
        <option value='default'>Выберите верное...</option>
        {options &&
          options.map((opt) => (
            <option
              value={opt.id}
              key={opt.id}
              dangerouslySetInnerHTML={{ __html: opt.translation }}
            ></option>
          ))}
      </select>
    );
  };

  const Buttons = (q: QuestKinds) => (
    <div className='my-3'>
      <button type='button' className='btn btn-primary btn-sm' onClick={() => clickCheckBtn(q)}>
        Проверить
      </button>
    </div>
  );

  return (
    <div className='row'>
      <div className='col-sm-3'>
        <TableCard level={level} setLevel={setLevel} isOldHsk={false} isForTests={true} />
      </div>

      <div className='col-sm-9'>
        <h1>Тесты на знание HSK 3</h1>
        <TypingGame words={hskWords} testStarted={() => {}} level={level} />

        <button type='button' className='btn btn-primary btn-sm mb-3' onClick={preInit}>
          Обновить тесты <FontAwesomeIcon icon={faSyncAlt} />
        </button>
        <div>
          <h5>Выберите верный перевод для иероглифов</h5>
          <hr />

          {charsQuests &&
            charsQuests.map((word) => (
              <div className='input-group mb-1' key={word.id}>
                <label
                  className='input-group-text bg-info text-white'
                  id={`${QuestKinds.Chars}_${word.id}`}
                >
                  {word.chinese}
                </label>
                {word && SelectOptions(word, QuestKinds.Chars)}
              </div>
            ))}
          {Buttons(QuestKinds.Chars)}
        </div>

        <div>
          <h5>... пиньиня</h5>
          <hr />

          {pinyinQuests &&
            pinyinQuests.map((word) => (
              <div className='input-group mb-1' key={word.id}>
                <label
                  className='input-group-text bg-info text-white'
                  id={`${QuestKinds.Pinyin}_${word.id}`}
                >
                  {word.pinyin}
                </label>
                {word && SelectOptions(word, QuestKinds.Pinyin)}
              </div>
            ))}
          {Buttons(QuestKinds.Pinyin)}
        </div>

        <div>
          <h5>... и аудио</h5>
          {/* <hr /> */}

          {audioQuests &&
            audioQuests.map((word) => (
              <div className='input-group mb-1' key={word.id}>
                <button
                  className='btn btn-sm btn-info'
                  onClick={() => pronounce(word.id, word.level)}
                  id={`${QuestKinds.Audio}_${word.id}`}
                >
                  <FontAwesomeIcon icon={faPlay} className='px-2' />
                </button>

                {word && SelectOptions(word, QuestKinds.Audio)}
              </div>
            ))}
          {Buttons(QuestKinds.Audio)}
        </div>
      </div>
    </div>
  );
}

class TestWord {
  chinese: string;
  level: string;
  id: number;
  pinyin: string;
  translation: string;
  constructor({ cn, lvl, id, py, ru }: NewHskWordType) {
    this.chinese = cn;
    this.level = lvl;
    this.id = id;
    this.pinyin = py;
    this.translation = parseRussian(ru, false);
  }
}
