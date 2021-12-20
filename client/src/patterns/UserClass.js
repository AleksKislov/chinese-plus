//password
//  и еще одно поле для особенных role / moreWords
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
    moreWords,
    date
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
    this.moreWords = moreWords;
    this.date = date;
  }

  isAdmin() {
    return this.role === "admin";
  }

  isModerator() {
    return this.role === "moderator";
  }

  get avatarPic() {
    return `https://${this.avatar}`;
  }
}

export class NullUser {
  constructor() {
    this.role = "";
    this._id = "-1";
    this.googleId = "-1";
    this.name = "Ноунэйм";
    this.role = "Ноунэйм";
  }

  isAdmin() {
    return false;
  }

  isModerator() {
    return false;
  }
}
