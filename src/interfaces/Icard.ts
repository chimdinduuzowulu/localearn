import { ReactNode } from "react";

export interface ICard {
  title: string;
  subModules: number;
  totalVideos: number;
  svg: ReactNode;
  translate?: string;
  path?: string;
}
