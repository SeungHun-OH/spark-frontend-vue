export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  // ✅ 한국시간(KST) 보정
  const diff = (now - date - 9 * 60 * 60 * 1000) / 1000; // 초 단위 차이

  if (diff < 60) return "방금 전";
  if (diff < 3600) return Math.floor(diff / 60) + "분 전";
  if (diff < 86400) return Math.floor(diff / 3600) + "시간 전";
  if (diff < 604800) return Math.floor(diff / 86400) + "일 전";

  const isThisYear = now.getFullYear() === date.getFullYear();
  if (isThisYear) {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  } else {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
}
