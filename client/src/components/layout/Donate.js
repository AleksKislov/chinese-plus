import React, { Fragment } from "react";
import { qrURL } from "../../constants/urls.json";
import { Link } from "react-router-dom";

const Donate = () => {
  return (
    <Fragment>
      <div className='row'>
        <h2>Поддержать Проект</h2>
      </div>
      <div className='row'>
        <div className='col-sm-6 mb-3'>
          <h5>1. Регулярное</h5>
          <p>
            Лучше всего - ощущать регулярную поддержку. Для этого еть проверенный сервис{" "}
            <strong>
              <a href='https://www.patreon.com/buyilehu' target='_blank'>
                Patreon
              </a>
            </strong>
          </p>
        </div>

        <div className='col-sm-6 mb-3'>
          <div className='card border-primary mb-3'>
            <div className='card-body'>
              <p className='card-text'>
                Cпасибо всем большое за поддержку! Если вы не хотите быть анонимным спонсором, то
                просим писать в <Link to='/posts'>Гостевой</Link> или{" "}
                <Link to='/contacts'>админу</Link>
              </p>
            </div>
          </div>
        </div>

        <div className='col-sm-12'>
          <h5>2. Карта, СМС или Яндекс.Деньги</h5>
          <p>
            <iframe
              src='https://yoomoney.ru/quickpay/shop-widget?writer=seller&targets=%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D1%82%D1%8C%20Chinese%2B&targets-hint=%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B0%D1%82%D1%8C%20Chinese%2B&default-sum=&button-text=14&payment-type-choice=on&mobile-payment-type-choice=on&mail=on&hint=&successURL=https%3A%2F%2Fwww.chineseplus.club%2Fdonate&quickpay=shop&account=41001889184273'
              width='360'
              height='222'
              frameBorder='0'
              allowtransparency='true'
              scrolling='no'
            ></iframe>
          </p>
        </div>

        <div className='col-sm-12 mb-3'>
          <h5>3. Paypal</h5>
          <a
            style={{ color: "#fff", width: "6rem" }}
            type='button'
            className='btn btn-success btn-link'
            href='https://www.paypal.com/paypalme/buyilehu'
            target='_blank'
          >
            Paypal
          </a>
        </div>

        <div className='col-sm-12 mb-3'>
          <h5>4. Wechat</h5>
          <img
            src={`${qrURL}wechatpay.jpg`}
            alt='wechatpay'
            style={{ width: "24rem" }}
            className='img-fluid'
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Donate;
