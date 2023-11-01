type ObjectId = string; // e.g, "5f04853868566a15a9ffb577"
type CommentId = { _id: ObjectId };
type NumString = string; // e.g. '3.56'
type ISODate = string; // e.g. '2022-05-12T19:56:17.731Z'

type ContentLike = {
  _id: ObjectId;
  user: ObjectId; // user id
  name: string; // user name
};

type DictWord = {
  _id: ObjectId;
  chinese: string; // e.g. "炫";
  pinyin: string; // e.g. ' xuàn',
  russian: string; // e.g. " [m1]1) я; мой[/m]"
  previous: {
    chinese: string;
    pinyin: string;
    russian: string;
  }[];
};

type NewAvatar = {
  type: string;
  background: string;
  seed: string;
};

type ShortUserInfo = {
  _id: ObjectId;
  name: string;
  newAvatar?: NewAvatar;
};
