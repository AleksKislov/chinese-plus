import { type CommentType } from "~/components/common/comments/comment-card";
import { type WHERE } from "~/components/common/comments/comment-form";
import { ApiService } from "./request";

export const getContentComments = (where: WHERE, contentId: ObjectId): Promise<CommentType[]> => {
  return ApiService.get(`/api/comments?where=${where}&id=${contentId}`, undefined, []);
};
