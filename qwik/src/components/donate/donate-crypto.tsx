import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { QRCodeModal } from './qr-code-modal';

export type DonateWallet = {
  address: string;
  name: string;
  qrCodeUrl: string;
};

type DonateWalletProps = {
  wallets: DonateWallet[];
};

export const DonateCrypto = component$(({ wallets }: DonateWalletProps) => {
  const modalId = 'donate-crypto-modal';

  return (
    <div class="card w-full bg-base-200 mb-3">
      <div class="card-body">
        <h2 class="card-title">Донат в крипте</h2>

        {wallets?.map((wallet, index) => (
          <div class="flex flex-col mb-1" key={index}>
            <label for={modalId + index} class={`btn btn-sm btn-info btn-outline`}>
              {wallet.name}
            </label>
            <QRCodeModal modalId={modalId + index} wallet={wallet} />
          </div>
        ))}

        <p class="text-sm">
          Если хотите поддержать криптой неанонимно, то напишите{' '}
          <Link href="/contacts" class="link hover:link-success">
            админу
          </Link>
        </p>
      </div>
    </div>
  );
});
