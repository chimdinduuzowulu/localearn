export const storePlayedVideos = (link: string) => {
  const played = localStorage.getItem("played-videos") || "[]";
  const hold: string[] = JSON.parse(played);
  const updatedPlayed = [...hold, link];
  localStorage.setItem("played-videos", JSON.stringify(updatedPlayed));
};
