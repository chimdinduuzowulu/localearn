import { ICourses } from "../interfaces/ICourses";

export const IsCompleted = (courseData: ICourses) => {
  const Allplayed = localStorage.getItem("played-videos") || "[]";
  const hold: string[] = JSON.parse(Allplayed);
  const videoLinksArray = courseData.videoLinks;
  const value = videoLinksArray.every((video: string) => hold.includes(video));
  return value;
};
