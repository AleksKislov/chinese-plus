enum TagsEnum {
  wish = "wish",
  bug = "bug",
  news = "news",
}
type PostT = {
  _id: string;
  tag: tagsEnum;
  avatar: string;
  title: string;
  text: string;
  name: string;
  date: string;
  user: string;
  comments_id: { _id: string }[];
};

type CommentT = {
  _id: string;
  path: string;
  destination: string;
  post_id: string;
  text: string;
  name: string;
  date: string;
};
