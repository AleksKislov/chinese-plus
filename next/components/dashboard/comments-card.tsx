import Link from "next/link";

import { apiGetReq } from "../../helpers/api";
import { fromNow } from "../../helpers/ui";

export default async function CommentsCard() {
  const comments = (await getLastComments()) || [];
  return (
    <>
      <h4>Последние комментарии:</h4>
      <ul className='list-group'>
        {comments.map((comment) => (
          <Link
            href={`/${comment.destination}s/${comment.path || comment.post_id}`}
            className='list-group-item list-group-item-action'
            key={comment._id}
          >
            <span className='text-success'>{comment.name}</span>
            <span className='badge bg-primary float-end'>{fromNow(comment.date)}</span>
            <p dangerouslySetInnerHTML={{ __html: comment.text }}></p>
          </Link>
        ))}
      </ul>
    </>
  );
}

async function getLastComments(): Promise<CommentT[]> {
  return await apiGetReq("/api/comments/last");
}
