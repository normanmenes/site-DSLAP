import { DekanatList } from "./Dekanat";

export interface DiecezjaList {
  id: number;
  nazwa: string;
  dekanaty: DekanatList[];
}
