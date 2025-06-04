import { component$ } from '@builder.io/qwik';
import { UserDateDiv } from '../common/comments/user-with-date';
import { SmallAvatar } from '../common/ui/small-avatar';
import { type Donate } from '~/routes/(club)/donate';

type DonateCardProps = {
  donate: Donate;
};

export const DonateCard = component$(({ donate }: DonateCardProps) => {
  const { userId: userInfo, createdAt: date, amount, currency, isCryptoAnon } = donate;

  const userName = isCryptoAnon ? 'Анонимный CRYPTO BRO' : userInfo?.name || 'Aноним';
  return (
    <div class="card w-full bg-base-200 mb-3">
      <div class="card-body">
        <div class="flex">
          <div class="avatar mr-3">
            <SmallAvatar newAvatar={userInfo?.newAvatar} userName={userInfo?.name || 'anon'} />
          </div>
          <div>
            <h3 class="card-title mb-1">
              {amount} {currency}
            </h3>
            <div class="flex">
              <div class="mr-1">
                <small>Спасибо,</small>
              </div>
              <UserDateDiv
                userId={userInfo?._id || ''}
                userName={userName}
                date={date}
                isAnon={!userInfo}
                ptNum={2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
