import { component$ } from "@builder.io/qwik";
import { getContentPath } from "~/misc/helpers/content";
import { type SimilarText } from "~/routes/read/texts/[id]";
import { WHERE } from "../common/comments/comment-form";

type SimilarTxtImgProps = {
  txt: SimilarText;
};

export const SimilarTxtImg = component$(({ txt }: SimilarTxtImgProps) => {
  return (
    <div
      class='card w-full image-full bg-cover h-56'
      style={`background-image: url(${txt.picUrl})`}
    >
      <div class='card-body'>
        <a href={getContentPath(WHERE.text, txt._id)}>
          <h2 class='card-title hover:text-secondary'>{txt.title}</h2>
        </a>
      </div>
    </div>
  );
});
