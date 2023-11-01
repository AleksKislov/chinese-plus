import { WHERE, type WhereType } from "~/components/common/comments/comment-form";

export const getContentPath = (
  contentType: WhereType,
  contentId: string,
  isUnapproved?: boolean
): string => {
  const s = isUnapproved ? "unapproved-" : "";

  switch (contentType) {
    case WHERE.text:
      return `/read/${s}texts/${contentId}`;
    case WHERE.video:
      return `/watch/${s}videos/${contentId}`;
    case WHERE.post:
      return `/feedback/${contentId}`;
  }
  return "/";
};
