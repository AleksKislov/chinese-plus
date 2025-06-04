import { type CommentType } from '~/components/common/comments/comment-card';
import { type WHERE } from '~/components/common/comments/comment-form';
import { ApiService } from './request';

export const getContentComments = (where: WHERE, contentId: ObjectId): Promise<CommentType[]> => {
  return ApiService.get(`/api/comments?where=${where}&id=${contentId}`, undefined, []);
};

export const getBookPageComments = (
  where: WHERE,
  chapterId: ObjectId,
  pageInd: string | null,
): Promise<CommentType[]> => {
  return ApiService.get(
    `/api/comments?where=${where}&chapter_id=${chapterId}&page_ind=${pageInd}`,
    undefined,
    [],
  );
};
