import { component$ } from "@builder.io/qwik";
import { WHERE } from "~/components/common/comments/comment-form";
import { type MarkedText, type MarkedVideo } from "~/routes/me/marked";
import { commentSvg, eyeSvg, heartSvg } from "~/components/common/media/svg";
import { MarkedTableRow } from "./marked-table-row";
import CONSTANTS from "~/misc/consts/consts";

type MarkedTableProps = {
  content: MarkedText[] | MarkedVideo[];
  contentType: "text" | "video";
};

export const MarkedTable = component$(({ content, contentType }: MarkedTableProps) => {
  const isVideo = contentType === WHERE.video;
  return (
    <table class='table text-base-content'>
      <thead>
        <tr>
          <th>Автор</th>
          <th>Название</th>
          <th>{heartSvg}</th>
          <th>{commentSvg}</th>
          <th>{eyeSvg}</th>
        </tr>
      </thead>
      <tbody>
        {content.map((cnt) => (
          <MarkedTableRow
            contentId={cnt._id}
            user={cnt.user}
            title={cnt.title}
            category={
              isVideo
                ? CONSTANTS.videoCategories[(cnt as MarkedVideo).category]
                : CONSTANTS.textCategories[(cnt as MarkedText).categoryInd]
            }
            commentsTotal={cnt.comments_id?.length || 0}
            likesTotal={cnt.likes?.length || 0}
            hitsTotal={cnt.hits}
            isVideo={isVideo}
          />
        ))}
      </tbody>
    </table>
  );
});
