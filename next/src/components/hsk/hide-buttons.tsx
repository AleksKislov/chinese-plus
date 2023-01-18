type HideBtnsType = {
  hideChinese: boolean;
  hideRussian: boolean;
  hidePinyin: boolean;
  setHideChinese: Function;
  setHideRussian: Function;
  setHidePinyin: Function;
};

export default function HideButtons({
  hideChinese,
  hideRussian,
  hidePinyin,
  setHideChinese,
  setHideRussian,
  setHidePinyin,
}: HideBtnsType) {
  const btns = [
    {
      txt: "Скрыть:",
      flag: false,
      func: () => {},
      disabled: "disabled",
    },
    {
      txt: "Иероглифы",
      flag: hideChinese,
      func: setHideChinese,
      disabled: "",
    },
    {
      txt: "Пиньинь",
      flag: hidePinyin,
      func: setHidePinyin,
      disabled: "",
    },
    {
      txt: "Перевод",
      flag: hideRussian,
      func: setHideRussian,
      disabled: "",
    },
  ];

  return (
    <div>
      <span className='btn-group mb-2 float-start' role='group'>
        {btns.map(({ txt, flag, func, disabled }) => (
          <button
            key={txt}
            className={`btn btn-sm btn-${flag ? "" : "outline-"}info ${disabled}`}
            type='button'
            onClick={() => func(!flag)}
          >
            {txt}
          </button>
        ))}
      </span>
    </div>
  );
}
