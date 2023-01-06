export default function getBaseUrl(href: string): string {
  return href.includes("localhost") ? "http://localhost:5000" : "https://www.chineseplus.club";
}
