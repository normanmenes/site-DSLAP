import { DekanatList } from "./Dekanat";
import { DiecezjaList } from "./Diecezja";
import { fetchJSON } from "../../helpers/fileJSON";
import { itemInt } from "../../helpers/elements";

const pathToJSONFile = "/data/archPoznan.json";

export class DiecezjaClass {
  private jsonData: DiecezjaList | null = null;

  public LoadJSONData(
    callback: (data: DiecezjaList) => void,
    errorCallback: (error: any) => void
  ): void {
    fetchJSON<DiecezjaList>(pathToJSONFile)
      .then((data) => {
        this.jsonData = data;
        callback(data);
      })
      .catch((error) => {
        errorCallback(error);
      });
  }

  public GetAllDekanatyInt(): itemInt[] {
    const allDekanaty: itemInt[] = [];
    this.jsonData?.dekanaty.forEach((dekanat) => {
      allDekanaty.push({ id: dekanat.id, nazwa: dekanat.nazwa });
    });
    return allDekanaty;
  }

  public GetAllParafieInt(): itemInt[] {
    const allParafie: itemInt[] = [];
    this.jsonData?.dekanaty.forEach((dekanat) => {
      dekanat.parafie.forEach((parafia) => {
        allParafie.push({ id: parafia.id, nazwa: parafia.nazwa });
      });
    });
    return allParafie;
  }

  public GetDekanatNaPodstawieNazwyParafii(
    nazwaParafii: string
  ): DekanatList | undefined {
    return this.jsonData?.dekanaty.find(function (dekanat) {
      return dekanat.parafie.some(function (parafia) {
        return parafia.nazwa === nazwaParafii;
      });
    });
  }

  public GetDekanatNaPodstawieJegoNazwy(
    wybranaNazwaDekanatu: string
  ): DekanatList | undefined {
    return this.jsonData?.dekanaty.find(function (dekanat: DekanatList) {
      return dekanat.nazwa === wybranaNazwaDekanatu;
    });
  }
}
