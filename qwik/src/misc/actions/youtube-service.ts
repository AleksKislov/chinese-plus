import { ApiService } from "./request";

export class YoutubeService {
  static getSrcLink(videoId: string) {
    return `https://youtu.be/${videoId}`;
  }

  static getVideoPicUrl(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  static getVideoCaption(id: string, lang: string, token: string) {
    return ApiService.get(`/gcloud/youtube/getSubs?videoId=${id}&lang=${lang}`, token);
  }

  static getVideoInfo(id: string, token: string) {
    return ApiService.get(`/gcloud/youtube/getInfo?videoId=${id}`, token);
  }

  static updateVideo(body: Object) {
    return ApiService.post(`/api/videos/update`, body);
  }

  static getTextPinyin(body: Object) {
    return ApiService.post(`/api/dictionary/getTextPinyin`, body);
  }
}
