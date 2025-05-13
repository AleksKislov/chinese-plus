import { component$ } from '@builder.io/qwik';
import { type DonateWallet } from './donate-crypto';
import { copySvg } from '../common/media/svg';

type QRCodeModalProps = {
  modalId: string;
  wallet: DonateWallet;
};

export const QRCodeModal = component$(({ modalId, wallet }: QRCodeModalProps) => {
  return (
    <>
      <input type="checkbox" id={modalId} class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative">
          <label for={modalId} class="btn btn-sm btn-circle absolute right-2 top-2">
            ✕
          </label>

          <h2 class="text-lg font-bold mb-2">{wallet.name}</h2>
          <div class="text-warning text-sm">
            <div>
              Отправляйте только активы {wallet.name} на этот адрес. Остальные активы будут утеряны.
            </div>
          </div>
          <div class="flex justify-center text-sm my-2">
            {wallet.address}{' '}
            <div class="tooltip tooltip-warning tooltip-left" data-tip="Скопировать адрес кошелька">
              <button
                class="btn btn-xs btn-warning"
                onClick$={() => {
                  navigator.clipboard.writeText(wallet.address);
                }}
              >
                {copySvg}
              </button>
            </div>
          </div>

          <div class="">
            <figure>
              <img src={wallet.qrCodeUrl} width="414" height="498" alt="qr-code" />
            </figure>
          </div>
        </div>
      </div>
    </>
  );
});
