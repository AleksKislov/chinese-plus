import { apiGetReq } from "../../helpers/api";
import PostCard from "../posts/post-card";

export default async function PostsCard() {
  const posts = (await getLastPosts()) || [];
  return (
    <>
      <h4>Последнее из Гостевой:</h4>

      {posts.map((post, ind) => (
        <PostCard key={ind} post={post} />
      ))}
    </>
  );
}

async function getLastPosts(): Promise<PostT[]> {
  return await apiGetReq(`/api/posts/infinite?skip=0`);
}
