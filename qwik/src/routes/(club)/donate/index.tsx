import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead, routeAction$ } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PageTitle } from "~/components/common/layout/title";
import { ApiService } from "~/misc/actions/request";
import { DonateCard } from "~/components/donate/donate-card";
import { DonateForm } from "~/components/donate/donate-form";
import { DonateGoals } from "~/components/donate/donate-goals";
import { Loader } from "~/components/common/ui/loader";

export type Donate = {
  _id: ObjectId;
  userId: ShortUserInfo | null;
  amount: number;
  currency: string; // RUB only
  createdAt: ISODate;
};

export type DonateGoal = {
  _id: ObjectId;
  desc: string;
  amountCollected: number;
  amountNeeded: number;
  priority: 1 | 2 | 3;
  title: string;
  isFinished: boolean;
  currency: string; // RUB only
  createdAt: ISODate;
};

export const useGetDonatesAndGoals = routeAction$(
  async (): Promise<{ donates: Donate[]; goals: DonateGoal[] }> => {
    return ApiService.post(`/api/donate/history`, {}, undefined, {});
  }
);

export default component$(() => {
  const getDonatesAndGoals = useGetDonatesAndGoals();
  const donates = useSignal<Donate[] | null>(null);
  const goals = useSignal<DonateGoal[] | null>(null);

  useVisibleTask$(() => {
    getDonatesAndGoals.submit();
  });

  useVisibleTask$(({ track }) => {
    const res = track(() => getDonatesAndGoals.value);
    if (res) {
      donates.value = res.donates;
      goals.value = res.goals;
    }
  });

  return (
    <>
      <PageTitle txt={"Донат и цели проекта"} />
      <FlexRow>
        <div class='w-full md:w-1/2 mb-3 mr-4'>
          <DonateForm />
          <DonateGoals goals={goals.value || []} />
        </div>

        <div class='w-full md:w-1/2'>
          <div class='card bg-base-300 mb-3'>
            <div class='card-body'>
              <h3 class='card-title'>Все донаты</h3>
              <p>
                После перевода сразу будет виден результат - насколько приблизилось достижение одной
                из целей.
              </p>
            </div>
          </div>

          {donates.value ? (
            donates.value.map((donate, ind) => <DonateCard donate={donate} key={ind} />)
          ) : (
            <Loader />
          )}
        </div>
      </FlexRow>
    </>
  );
});

export const head: DocumentHead = {
  title: "Chinese+ Донат",
  meta: [
    {
      name: "description",
      content: "Прозрачная поддержка клуба",
    },
  ],
};
