import { MouseEventHandler, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type HskSearchFormProps = {
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  setChineseWord: Function;
};

export default function HskSearchForm({ onSubmit, setChineseWord }: HskSearchFormProps) {
  function getInput(e: FormEvent<HTMLInputElement>) {
    const trgt = e.target as HTMLInputElement;
    setChineseWord(trgt.value);
  }

  return (
    <div className='input-group mb-3'>
      <input
        type='text'
        className='form-control'
        placeholder='汉字...'
        autoComplete='off'
        onInput={getInput}
      />
      <button className='btn btn-primary' onClick={onSubmit} type='button'>
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
}
