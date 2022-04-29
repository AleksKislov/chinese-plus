import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export class YoutubeService {
  static getSrcLink(videoId) {
    return `https://youtu.be/${videoId}`;
  }

  static getVideoPicUrl(videoId) {
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  static getVideoCaption(id, lang) {
    return axios.get(`/gcloud/youtube/getSubs?videoId=${id}&lang=${lang}`);
  }

  static getVideoInfo(id) {
    return axios.get(`/gcloud/youtube/getInfo?videoId=${id}`);
  }

  static updateVideo(body) {
    return axios.post(`/api/videos/update`, body, config);
  }

  static createVideo(body) {
    return axios.post(`/api/videos/create`, body, config);
  }
}
