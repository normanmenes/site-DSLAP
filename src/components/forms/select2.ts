import $ from "jquery";
import "select2";
import "select2/dist/css/select2.min.css";
import { DiecezjaClass } from "../../lib/strukturaKosciola/DiecezjaClass";
import { itemInt } from "../../helpers/elements";

const diecezja = new DiecezjaClass();
var fieldDekanat: JQuery<HTMLElement> = $("#dekanat");
var fieldParafia: JQuery<HTMLElement> = $("#parafia");
let czyWybranoDekanat: boolean = false;
let czyAutomatycznaZmianaDekanatu: boolean = false; // zabezpieczenie przed pętlą nieskończoną

var allDekanaty: itemInt[];
var allParafie: itemInt[];

// Wykonaj kod po załadowaniu modelu DOM
$(() => {
  fieldDekanat = $("#dekanat");
  fieldParafia = $("#parafia");

  diecezja.LoadJSONData(
    (data) => {
      console.log("Pomyślnie załadowano dane JSON:", data);

      // Wypełnij pole DEKANAT na podstawie danych
      allDekanaty = diecezja.GetAllDekanatyInt();
      uzupelnijPoleDekanat(allDekanaty);

      // Wypełnij pole PARAFIA na podstawie danych
      allParafie = diecezja.GetAllParafieInt();
      uzupelnijPoleParafia(allParafie);

      // Inicjalizacja Select2 dla pól klasy ".js-select2"
      $(".js-select2").select2();

      // Obsługa zdarzenia zmiany w polu PARAFIA
      fieldParafia.on("change", function () {
        const parafiaValue = $(this).val()?.toString();
        if (!parafiaValue) {
          //fieldDekanat.prop("disabled", false);
          if (!czyWybranoDekanat) {
            uzupelnijPoleParafia(allParafie);
            fieldDekanat.val("").trigger("change");
          }
        } else {
          //fieldDekanat.prop("disabled", true);
          const dekanatParafii =
            diecezja.GetDekanatNaPodstawieNazwyParafii(parafiaValue);
          czyAutomatycznaZmianaDekanatu = true;
          fieldDekanat.val(dekanatParafii!.nazwa).trigger("change");
          czyAutomatycznaZmianaDekanatu = false;
        }
      });

      // Obsługa zdarzenia zmiany w polu DEKANAT
      fieldDekanat.on("change", function () {
        const dekanatValue = $(this).val()?.toString();
        if (!czyAutomatycznaZmianaDekanatu) {
          if (!dekanatValue) {
            czyWybranoDekanat = false;
            uzupelnijPoleParafia(allParafie);
          } else {
            czyWybranoDekanat = true;
            const wybranyDekanat =
              diecezja.GetDekanatNaPodstawieJegoNazwy(dekanatValue);
            if (wybranyDekanat === undefined) {
              return;
            }
            uzupelnijPoleParafia(wybranyDekanat.parafie);
          }
        }
      });
    },
    (error) => {
      console.error("Błąd podczas ładowania pliku JSON:", error);
    }
  );
});

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
