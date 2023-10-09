import { dekanat } from "./Dekanat";
import { readJSONFile } from "../../helpers/readJSONFile";
import { itemInt } from "../../helpers/interfaces";

const pathToJSONFile = "../../data/archPoznan.json";

interface jsonFile {
  diecezja: diecezja;
}

interface diecezja {
  id: number;
  nazwa: string;
  dekanaty: dekanat[];
}

export class Diecezja {
  private jsonData: jsonFile | null = null;
  private loadPromise: Promise<void> | null = null;

  private loadJSONData(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const file = await readJSONFile<jsonFile>(pathToJSONFile);
        if (file) {
          this.jsonData = file;
          resolve();
        } else {
          console.error("Nie udało się wczytać pliku JSON.");
          reject("Nie udało się wczytać pliku JSON.");
        }
      } catch (error) {
        console.error("Błąd odczytu pliku JSON:", error);
        reject(error);
      }
    });

    return this.loadPromise;
  }

  constructor() {
    this.loadPromise = this.loadJSONData();
  }

  public async GetAllDekanatyInt(): Promise<itemInt[]> {
    if (this.loadPromise && this.loadPromise instanceof Promise) {
      await this.loadPromise;
    }
    const allDekanaty: itemInt[] = [];
    this.jsonData?.diecezja.dekanaty.forEach((dekanat) => {
      allDekanaty.push({ id: dekanat.id, nazwa: dekanat.nazwa });
    });
    return allDekanaty;
  }

  public async GetAllParafieInt(): Promise<itemInt[]> {
    if (this.loadPromise && this.loadPromise instanceof Promise) {
      await this.loadPromise;
    }
    const allParafie: itemInt[] = [];
    this.jsonData?.diecezja.dekanaty.forEach((dekanat) => {
      dekanat.parafie.forEach((parafia) => {
        allParafie.push({ id: parafia.id, nazwa: parafia.nazwa });
      });
    });
    return allParafie;
  }

  public async GetDekanatNaPodstawieNazwyParafii(
    nazwaParafii: string
  ): Promise<dekanat | undefined> {
    if (this.loadPromise && this.loadPromise instanceof Promise) {
      await this.loadPromise;
    }
    return this.jsonData?.diecezja.dekanaty.find(function (dekanat) {
      return dekanat.parafie.some(function (parafia) {
        return parafia.nazwa === nazwaParafii;
      });
    });
  }

  public async GetDekanatNaPodstawieJegoNazwy(
    wybranaNazwaDekanatu: string
  ): Promise<dekanat | undefined> {
    if (this.loadPromise && this.loadPromise instanceof Promise) {
      await this.loadPromise;
    }
    return this.jsonData?.diecezja.dekanaty.find(function (dekanat: dekanat) {
      return dekanat.nazwa === wybranaNazwaDekanatu;
    });
  }
}
