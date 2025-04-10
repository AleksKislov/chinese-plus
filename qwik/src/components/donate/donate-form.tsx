import { component$, useContext, useSignal } from '@builder.io/qwik';
import { userContext } from '~/root';
import { cashSvg } from '../common/media/svg';

// type DonateFormProps = {};

export const DonateForm = component$(() => {
  const YOO_MONEY_ID = '41001889184273';
  const DONATE_LABEL_START = 'supportChinesePlus';
  const LABEL_SEPARATOR = '#';
  const userState = useContext(userContext);
  const { loggedIn, _id: userId } = userState;

  const isAnon = useSignal(!loggedIn);

  return (
    <div class="card w-full bg-base-300 mb-3">
      <div class="card-body">
        {/* <h2 class='card-title'>Поддержать Chinese+</h2> */}

        <div class="flex flex-col mb-1">
          <div class="label">
            <span class="label-text-alt">
              При клике вы попадете на сайт Yoomoney и сможете сделать перевод картой или через свой
              кошелек Yoomoney
            </span>
          </div>
          <div class="flex lg:flex-row flex-col">
            <div class="form-control mr-3">
              <form method="POST" action="https://yoomoney.ru/quickpay/confirm">
                <input type="hidden" name="receiver" value={YOO_MONEY_ID} />
                <input
                  type="hidden"
                  name="label"
                  value={`${DONATE_LABEL_START}${LABEL_SEPARATOR}${isAnon.value ? '' : userId}`}
                />
                <input type="hidden" name="quickpay-form" value="button" />
                <input type="hidden" name="paymentType" value="AC" />
                <input
                  type="hidden"
                  name="successURL"
                  value="https://www.chineseplus.club/donate"
                />

                <div class="join">
                  <input
                    class="input input-bordered join-item w-28"
                    type="text"
                    name="sum"
                    value="99"
                    data-type="number"
                  />
                  <select class="select select-bordered join-item">
                    <option>RUB</option>
                  </select>
                  <button class="btn join-item btn-success" type="submit">
                    {cashSvg}
                  </button>
                </div>
              </form>
            </div>

            <div class="form-control w-52">
              <div
                class="tooltip tooltip-info"
                data-tip={!loggedIn ? 'Войдите, чтобы сделать именной донат' : null}
              >
                <label class="cursor-pointer label">
                  <span class="label-text mr-1">Поддержать анонимно</span>
                  <input
                    type="checkbox"
                    bind:checked={isAnon}
                    disabled={!loggedIn}
                    class="checkbox checkbox-success"
                  />
                </label>
              </div>
            </div>
          </div>
          <div class="label">
            <span class="label-text-alt">Yoomoney удерживает 1-3% при переводах</span>
          </div>
        </div>
      </div>
    </div>
  );
});
