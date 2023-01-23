type UserFromBE = {
  _id: string;
  role: string;
  name: string;
  googleId: string;
  email: string;
  avatar: string;
  read_today_num: number;
  read_today_arr: { [key: string]: number[] };
  daily_reading_goal: number;
  finished_texts: string[];
  seenVideos: string[];
  date: Date;
};
