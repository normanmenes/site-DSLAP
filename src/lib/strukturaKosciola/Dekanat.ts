import { parafia } from "./Parafia";

export interface dekanat {
  id: number;
  nazwa: string;
  parafie: parafia[];
}
