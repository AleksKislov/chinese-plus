// -password
export class User {
  constructor({
    _id,
    role,
    name,
    googleId,
    email,
    avatar,
    read_today_num,
    read_today_arr,
    daily_reading_goal,
    finished_texts,
    seenVideos,
    date,
  }) {
    this._id = _id;
    this.role = role || "Изучающий";
    this.name = name;
    this.googleId = googleId;
    this.email = email;
    this.avatar = avatar;
    this.read_today_arr = read_today_arr;
    this.read_today_num = read_today_num;
    this.daily_reading_goal = daily_reading_goal;
    this.finished_texts = finished_texts;
    this.seenVideos = seenVideos;
    this.date = date;
  }

  get isAdmin() {
    return this.role === "admin";
  }

  get isModerator() {
    return this.role === "moderator";
  }

  get avatarPic() {
    return `https://${this.avatar}`;
  }

  get isNull() {
    return false;
  }
}

export class NullUser {
  constructor() {
    this.role = "";
    this._id = "-1";
    this.googleId = "-1";
    this.name = "Ноунэйм";
    this.role = "Ноунэйм";
    this.seenVideos = [];
    this.finished_texts = [];
  }

  get isNull() {
    return true;
  }

  get isAdmin() {
    return false;
  }

  get isModerator() {
    return false;
  }
}
