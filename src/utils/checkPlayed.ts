export const checkPlayed = (link: string) => {
  const played = localStorage.getItem("played-videos") || "[]";
  const hold = JSON.parse(played);
  if (!hold.includes(link)) {
    return false;
  }
  return true;
};
