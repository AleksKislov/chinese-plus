"use client";
import { createContext, useContext, Dispatch, SetStateAction, useState } from "react";

export class User {
  private _id;
  private _role;
  private _name;
  private googleId;
  private email;
  private date;
  private avatar;
  public readTodayNum;
  public readTodayArr;
  public dailyReadingGoal;
  public finishedTexts;
  public seenVideos;
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
  }: UserFromBE) {
    this._id = _id;
    this._role = role || "Изучающий";
    this._name = name;
    this.googleId = googleId;
    this.email = email;
    this.avatar = avatar;
    this.readTodayArr = read_today_arr;
    this.readTodayNum = read_today_num;
    this.dailyReadingGoal = daily_reading_goal;
    this.finishedTexts = finished_texts;
    this.seenVideos = seenVideos;
    this.date = date;
  }

  get isLoggedIn() {
    return true;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name;
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
}

export class NullUser {
  private _role = "Ноунэйм";
  private _id = "-1";
  private googleId = "-1";
  private _name = "Ноунэйм";
  private avatar = "";
  private date = "";
  public seenVideos = [];
  public finishedTexts = [];
  public email = "";
  public readTodayNum = 0;
  public readTodayArr = [];
  public dailyReadingGoal = 0;

  get isLoggedIn() {
    return false;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name;
  }

  get isAdmin() {
    return false;
  }

  get isModerator() {
    return false;
  }

  get avatarPic() {
    return "";
  }
}

interface ContextProps {
  user: User | NullUser;
  setUser: Dispatch<SetStateAction<User | NullUser>>;
}

const GlobalContext = createContext<ContextProps>({
  user: new NullUser(),
  setUser: (): User | NullUser => new NullUser(),
});

export const AuthCtxProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | NullUser>(new NullUser());

  return <GlobalContext.Provider value={{ user, setUser }}>{children}</GlobalContext.Provider>;
};

export const useAuthCtx = () => useContext(GlobalContext);
