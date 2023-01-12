import PinyinTests from "../../../src/components/start/pinyin-tests";

export default function PinyinTestsPage() {
  return (
    <div className='row'>
      <div className='col-sm-3'>
        <div className='card border-primary mb-3'>
          <div className='card-body'>
            <h4 className='card-title'>Пиньинь</h4>
            <p className='card-text'>
              Пиньинь - первое, чем нужно овладеть изучающим китайский язык.{" "}
            </p>
            <p className='card-text'>
              Проверьте насколько хорошо вы понимаете на слух звуки и тоны китайского языка.
            </p>
          </div>
        </div>
      </div>
      <div className='col-sm-9'>
        <h3>Тест на владение пиньинем</h3>
        <small>
          Введите соответствующий пиньинь для аудио в виде [латынь][цифра], например,{" "}
          <span className='text-info'>huang2</span> или <span className='text-info'>lv4</span>
        </small>

        <PinyinTests />
      </div>
    </div>
  );
}
