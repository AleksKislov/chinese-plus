import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { WHERE, type WhereType } from "../comments/comment-form";
import { getContentPath } from "~/misc/helpers/content";
import CONST_URLS from "~/misc/consts/urls";

type CardImgProps = {
  contentId: string;
  contentType: WhereType;
  picUrl: string;
  isUnapproved?: boolean;
};

export const CardImg = component$(
  ({ contentId, contentType, picUrl, isUnapproved }: CardImgProps) => {
    const imageSrc = useSignal(picUrl);

    return (
      <figure class={`lg:w-1/3 max-h-full ${contentType === WHERE.text ? "max-h-52" : ""}`}>
        <Link href={getContentPath(contentType, contentId, isUnapproved)}>
          <img
            width='400'
            height='600'
            src={imageSrc.value}
            alt='Content pic'
            class='w-full h-full lg:object-cover'
            onError$={() => (imageSrc.value = CONST_URLS.defaultTextPic)}
          />
        </Link>
      </figure>
    );
  }
);
