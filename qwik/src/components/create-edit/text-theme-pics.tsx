import { component$ } from "@builder.io/qwik";
import { type NewTextStore, type ThemePicType } from "~/routes/(content)/create/text";
import { FlexRow } from "../common/layout/flex-row";

type TextThemePicsType = {
  pics: ThemePicType[];
  store: NewTextStore;
};

export const TextThemePics = component$(({ pics, store }: TextThemePicsType) => {
  return (
    <FlexRow>
      {pics.map((pic: ThemePicType, ind) => (
        <img
          key={ind}
          src={pic.small}
          class={`object-contain h-48 w-48 rounded-md ${
            pic.small === store.picUrl ? "border-2 border-primary" : ""
          }}`}
          onClick$={() => (store.picUrl = pic.small)}
        />
      ))}
    </FlexRow>
  );
});
