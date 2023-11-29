import { ParafiaList } from "./Parafia";

export interface DekanatList {
  id: number;
  nazwa: string;
  parafie: ParafiaList[];
}
