"use client";
import { ChangeEvent, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

import { allPinyinSounds } from "../../helpers/constants/pinyin";
import { playAudioFromBtn } from "./play-audio";

type AnswersObj = {
  [key: string]: string;
};

const separator = "_";

export default function PinyinTests() {
  const columns = [1, 2, 3];
  const answers = [1, 2, 3, 4]; // 4 per column
  const answersNum = columns.length * answers.length;

  const [inputs, setInputs] = useState<AnswersObj>({});
  const [sounds, setSounds] = useState([""]);

  useEffect(() => {
    init();
  }, []);

  function getRandAnswers(): string[] {
    const sounds: string[] = [];
    while (sounds.length < answersNum) {
      const randSound = allPinyinSounds[Math.floor(Math.random() * allPinyinSounds.length)];
      if (!sounds.includes(randSound)) {
        sounds.push(randSound);
      }
    }
    return sounds;
  }

  function init() {
    const randSounds = getRandAnswers();
    setSounds(randSounds);
    setInputs(setEmptyAnswers(randSounds));
    setTimeout(() => {
      for (let i = 0; i < randSounds.length; i++) {
        const ansBtn = document.getElementById(randSounds[i]);
        ansBtn?.classList.remove("bg-success", "bg-danger", "bg-warning");
        const userInput = document.getElementById(getInputId(randSounds[i])) as HTMLInputElement;
        if (userInput) userInput.value = "";
      }
    }, 300);
  }

  function getInputId(sound: string): string {
    return `${separator}${sound}`;
  }

  function setEmptyAnswers(answers: string[]): AnswersObj {
    const ansObj: AnswersObj = {};
    answers.forEach((sound) => {
      ansObj[getInputId(sound)] = "";
    });
    return ansObj;
  }

  function checkAnswers() {
    for (let i = 0; i < sounds.length; i++) {
      const answer = sounds[i];
      const userInput = inputs[getInputId(answer)];
      const ansBtn = document.getElementById(answer);
      ansBtn?.classList.add(userInput === answer ? "bg-success" : "bg-danger");
    }
  }

  const showAnswers = () => {
    for (let i = 0; i < sounds.length; i++) {
      const ans = sounds[i];
      const ansBtn = document.getElementById(ans);
      ansBtn?.classList.remove("bg-success", "bg-danger");
      ansBtn?.classList.add("bg-warning");
      const userInput = document.getElementById(getInputId(ans)) as HTMLInputElement;
      if (userInput) userInput.value = ans;
    }
  };

  const receiveAnswer = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setInputs({ ...inputs, [target.id]: target.value });
  };

  return (
    <>
      <div className='row my-2'>
        {/* <div className='col-sm-4'>
          <div className='input-group'></div>
        </div>
        <div className='col-sm-4'>
          <div className='input-group'></div>
        </div>
        <div className='col-sm-4'>
          <div className='input-group'></div>
        </div> */}
        {columns.map((col, k) => (
          <div className='col-sm-4' key={col}>
            {answers.map((quest, i) => (
              <div className='input-group my-2' key={quest}>
                <button
                  className='btn btn-secondary'
                  id={sounds[i + answers.length * k]}
                  type='button'
                  onClick={playAudioFromBtn}
                >
                  {/* <FontAwesomeIcon icon={faPlay} /> */}
                  {sounds[i + answers.length * k]}
                </button>

                <input
                  type='text'
                  className='form-control'
                  id={getInputId(sounds[i + answers.length * k])}
                  onChange={(e) => receiveAnswer(e)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className='pinyinButtons'>
        <button type='button' className='btn btn-primary btn-sm' onClick={checkAnswers}>
          Проверить
        </button>
        <button type='button' className='btn btn-primary btn-sm' onClick={showAnswers}>
          Показать Ответы
        </button>
        <button type='button' className='btn btn-primary btn-sm' onClick={init}>
          <FontAwesomeIcon icon={faSyncAlt} />
        </button>
      </div>
    </>
  );
}
