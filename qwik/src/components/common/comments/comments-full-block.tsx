import { type Signal, component$ } from '@builder.io/qwik';
import { CommentsBlockTitle } from './comments-block-title';
import { type Addressee, CommentForm, type CommentIdToReply, type WhereType } from './comment-form';
import { CommentsBlock } from './comments-block';
import { type CommentType } from './comment-card';

type CommentsFullBlockProps = {
  contentId: ObjectId;
  where: WhereType;
  path?: string;
  commentIdToReply: CommentIdToReply;
  addressees: Signal<Addressee[]>;
  comments: CommentType[];
  author?: Addressee; // content author, addressable even if they haven't commented yet
};

// who can be @-mentioned: everyone in this comment thread, plus the content's author
const getMentionCandidates = (comments: CommentType[], author?: Addressee): Addressee[] => {
  const candidates = new Map<string, Addressee>();
  if (author) candidates.set(author.id, author);
  comments.forEach(({ user }) => {
    if (!candidates.has(user._id)) candidates.set(user._id, { id: user._id, name: user.name });
  });
  return Array.from(candidates.values());
};

export const CommentsFullBlock = component$(
  ({
    contentId,
    where,
    path,
    commentIdToReply,
    addressees,
    comments,
    author,
  }: CommentsFullBlockProps) => {
    const mentionCandidates = getMentionCandidates(comments, author);

    return (
      <div class={'mt-2'}>
        <CommentsBlockTitle />
        <CommentsBlock
          comments={comments}
          commentIdToReply={commentIdToReply}
          addressees={addressees}
        />
        <CommentForm
          contentId={contentId}
          where={where}
          path={path}
          commentIdToReply={commentIdToReply}
          addressees={addressees}
          mentionCandidates={mentionCandidates}
        />
      </div>
    );
  },
);
