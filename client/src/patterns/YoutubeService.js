import axios from "axios";

export class YoutubeService {
  static getSrcLink(videoId) {
    return `https://youtu.be/${videoId}`;
  }

  static getVideoPicUrl(videoId) {
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  static getVideoCaptions() {}

  static getVideoInfo(id) {
    return axios.get(`/gcloud/youtube/getInfo?videoId=${id}`);
  }
}
