import $ from "jquery";
import "select2";
import "select2/dist/css/select2.min.css";
import { Diecezja } from "../../lib/strukturaKosciola/Diecezja";
import { itemInt } from "../../helpers/interfaces";

$(document).ready(async function () {
  const diecezja = new Diecezja();
  const fieldDekanat: JQuery<HTMLElement> = $("#dekanat");
  const fieldParafia: JQuery<HTMLElement> = $("#parafia");
  let czyWybranoDekanat: boolean = false;
  let czyAutomatycznaZmianaDekanatu: boolean = false; // zabezpieczenie przed pętlą nieskończoną

  function uzupelnijPole(field: JQuery<HTMLElement>, array: itemInt[]): void {
    array.forEach(function (item) {
      field.append(
        '<option value="' + item.nazwa + '">' + item.nazwa + "</option>"
      );
    });
  }

  function uzupelnijPoleDekanat(array: itemInt[]): void {
    fieldDekanat.empty();
    if (array.length > 1) {
      fieldDekanat.append('<option value="">Wybierz dekanat</option>');
    }
    uzupelnijPole(fieldDekanat, array);
  }

  function uzupelnijPoleParafia(array: itemInt[]): void {
    fieldParafia.empty();
    fieldParafia.append('<option value="">Wybierz parafię</option>');
    uzupelnijPole(fieldParafia, array);
  }

  // Wypełnij pole DEKANAT na podstawie danych
  const allDekanaty = diecezja.GetAllDekanatyInt();
  uzupelnijPoleDekanat(await allDekanaty);

  // Wypełnij pole PARAFIA na podstawie danych
  const allParafie = diecezja.GetAllParafieInt();
  uzupelnijPoleParafia(await allParafie);

  // Inicjalizacja Select2 dla pól klasy ".js-select2"
  $(".js-select2").select2();

  // Obsługa zdarzenia zmiany w polu PARAFIA
  fieldParafia.on("change", async function () {
    const parafiaValue = $(this).val()?.toString();
    if (!parafiaValue) {
      fieldDekanat.prop("disabled", false);
      if (!czyWybranoDekanat) {
        uzupelnijPoleParafia(await allParafie);
        fieldDekanat.val("").trigger("change");
      }
    } else {
      fieldDekanat.prop("disabled", true);
      const dekanatParafii = await diecezja.GetDekanatNaPodstawieNazwyParafii(
        parafiaValue
      );
      if (dekanatParafii === undefined) {
        return;
      }
      czyAutomatycznaZmianaDekanatu = true;
      fieldDekanat.val(dekanatParafii.nazwa).trigger("change");
      czyAutomatycznaZmianaDekanatu = false;
    }
  });

  // Obsługa zdarzenia zmiany w polu DEKANAT
  fieldDekanat.on("change", async function () {
    if (!czyAutomatycznaZmianaDekanatu) {
      const dekanatValue = $(this).val()?.toString();
      if (dekanatValue === undefined) {
        return;
      }
      if (!dekanatValue) {
        czyWybranoDekanat = false;
        uzupelnijPoleParafia(await allParafie);
      } else {
        czyWybranoDekanat = true;
        const wybranyDekanat = await diecezja.GetDekanatNaPodstawieJegoNazwy(
          dekanatValue
        );
        if (wybranyDekanat === undefined) {
          return;
        }
        uzupelnijPoleParafia(wybranyDekanat.parafie);
      }
    }
  });
});
