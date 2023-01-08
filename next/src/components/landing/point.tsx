import { ReactElement } from "react";

export default function SellPoint({
  icon,
  headTxt,
  text,
}: {
  icon: ReactElement;
  headTxt: String;
  text: ReactElement;
}) {
  return (
    <div className='col-sm-4 px-4'>
      <div className='card border-light mb-3'>
        <div className='card-header h5'>{headTxt}</div>
        <div className='card-body row'>
          <div className='col-2'>
            <h2>{icon}</h2>
          </div>
          <div className='col-10'>
            <p className='card-text'>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
