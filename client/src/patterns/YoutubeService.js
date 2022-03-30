export class YoutubeService {
  static getSrcLink(videoId) {
    return `https://youtu.be/${videoId}`;
  }

  static getVideoPicUrl(videoId) {
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }
}
