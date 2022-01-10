import VaccAppointment from "./VaccAppointment.js";
import AppointmentList from "./AppointmentList.js";

let initUI = Symbol();
let loadFromJSON = Symbol();
let loadVaccForm = Symbol();
let toggleSeen = Symbol();

/**
 * Administration holds the appointment list
 */
export default class Administration {
  #apptmList

  /**
   * Creates instance of Administration
   */
  constructor() {
    this.#apptmList = new AppointmentList();
  }

  /**
   * Initialize the User Interface (Admin Dashboard) and load Vaccination
   * Appointments from JSON
   */
  init() {
    this[initUI]();
    this[loadFromJSON]();
  }

  /**
   * [Initializes UI with admin dashboard.]
   */
  [initUI]() {
    let tableNav = `<div id="admin" class="bottomSpace"><div class="row my-4">
    <div class="col-6">
      <button class="btn btn-primary m-sm-0 my-2" id="addAptm">neuer Termin</button>
    </div>
    <div
      class="col-6 d-flex justify-content-end m-sm-0 my-2">
      <a href="#" class="btn btn-primary">Logout</a>
    </div>
  </div>
    <h2>Verwaltung Impftermine</h2></div>`;

    let table = `<div class="overflow-auto">
    <table class="table table-striped">
      <thead>
      <tr>
        <th scope="col">Bezeichnung</th>
        <th scope="col">Datum</th>
        <th scope="col">von</th>
        <th scope="col">bis</th>
        <th scope="col">Ort</th>
        <th scope="col">Impftsoff</th>
        <th scope="col">Anmeldungen</th>
        <th scope="col">verfügbar</th>
        <th scope="col">Plätze</th>
        <th scope="col">Verwalten</th>
        <th scope="col">Löschen</th>
      </tr>
      </thead>
      <tbody id="vaccAdmin">
      </tbody>`;
    $("main").prepend(tableNav);
    $(table).insertAfter($("#admin h2"));

    $("#addAptm").on("click", (e) => {
      this[loadVaccForm]();
    });

  }

  /**
   * Loads data (Vaccine Appointments) from JSON file.
   */
  [loadFromJSON]() {
    fetch("../json/vaccAppointments.json").then((response) => {
      return response.json();
    }).then(data => {
      for (let apptm of data.vaccAppointments) {
        let a = new VaccAppointment(apptm, this.#apptmList);
        this.#apptmList.addApptm(a);
      }
      this.#apptmList.print();
    });
  }

  /**
   * Loads form for new Vaccine Appointment, addds clickhandlers, validates form,
   * displays error messages and adds new Vaccine Appointment to Appointment List if
   * input was valid.
   */
  [loadVaccForm]() {
    this[toggleSeen](false, true);

    // test();

    /**
     * Cancels input, hides form and shows dashboard again.
     */
    $("#cancelNew").on("click", (e) => {
      this[toggleSeen](true, false);
      resetForm();
    });

    $("#saveApptm").off('click'); // prevents clickhandler from firing twice when
    // clicked once

    /**
     * Click handler for "Speichern" button. Adds new Appointment to this.#apptmList
     * if input was valid.
     */
    $("#saveApptm").on("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      let valid = validate(this.#apptmList)

      if (valid) {
        // console.log("SUCCESS");
        resetForm();

        this[toggleSeen](true, false);
      } else {
        // console.log("MAU MAU");
        // resetForm();
      }
    });

    function resetForm() {
      $('input').css("border-color", "#CED4DA");
      $('select').css("border-color", "#CED4DA");
      $('div input').val("");
      $('#vaccine option[value=""]').prop('selected', true);
      $('#state option[value=""]').prop('selected', true);
      $("input").next().addClass("hidden");
      $("select").next().addClass("hidden");
    }

    /**
     * Function for testing purposes. Prefills some input fields.
     */
    function test() {
      $('div input[type="text"]').val("ZZZ");
      $('div input[type="number"]').val(5);
      $("#vaccine option[value='Janssen']").prop('selected', true);
      $("#state option[value='Wien']").prop('selected', true);
      $("#time_from").val("10:50");
      $("#time_to").val("11:15");
    }

    /**
     * validates form input
     * @param apptmList [this.#apptmList]
     * @returns {*} [true if validate / false if not validate okay]
     */
    function validate(apptmList) {
      let validate = [];
      // validate = [false, false, false, false, false, false, false];
      validate = [true, true, true, true, true, true, true];
      // console.log(validate);

      // resetForm();
      // date
      let date = $("#date").val();
      let now = new Date(Date.now());
      now.setHours(0, 0, 1);
      let dateObj = new Date(date);
      // console.log(dateObj)
      let dateId = "#date";
      if (isNaN(dateObj.getTime()) || dateObj.getTime() < now.getTime()) {
        if (dateObj.getTime() < now.getTime()) {
          errorMessage(dateId, "Bitte das heutige Datum oder ein späteres Datum" +
            " eingeben.");
          validate[0] = false;
        } else if (isNaN(dateObj.getTime())) {
          showErrorMessage(dateId);
          validate[0] = false;
        }
      } else {
        hideErrorMessage(dateId);
        date = dateObj.getDate() + "." + dateObj.getMonth() + 1 + "." +
          dateObj.getFullYear();
        // console.log(date);
        validate[0] = true;
      }


      // time
      let time_from = $("#time_from").val();
      let time_to = $("#time_to").val();

      let stt = new Date("November 13, 2013 " + time_from);
      stt = stt.getTime();

      let endt = new Date("November 13, 2013 " + time_to);
      endt = endt.getTime();

      if (time_from === "" || time_to === "") {
        if (time_from === "") {
          errorMessage("#time_from", "Bitte Uhrzeit eingeben");
          validate[1] = false;
        }
        if (time_to === "") {
          errorMessage("#time_to", "Bitte Uhrzeit eingeben");
          validate[1] = false;
        }
      } else if (endt <= stt) {
        errorMessage("#time_from", "Startzeit (von) muss vor der Endzeit (bis) sein.");
        errorMessage("#time_to", "");
        validate[1] = false;
      } else {
        hideErrorMessage("#time_from");
        hideErrorMessage("#time_to");
        validate[1] = true;
      }

      //address
      let address = $("#address").val();
      if (address === "") {
        showErrorMessage("#address");
        validate[2] = false;
      } else {
        hideErrorMessage("#address");
        validate[2] = true;
      }

      // zip code
      let zipCode = $("#zip-code").val();
      if (zipCode === "") {
        showErrorMessage("#zip-code");
        validate[3] = false;
      } else {
        hideErrorMessage("#zip-code");
        validate[3] = true;
      }

      // city
      let city = $("#city").val();
      if (city === "") {
        showErrorMessage("#city");
        validate[4] = false;
      } else {
        hideErrorMessage("#city");
        validate[4] = true;
      }

      // state
      let state = $("#state").val();
      if (state === null) {
        showErrorMessage("#state");
        validate[5] = false;
      } else {
        hideErrorMessage("#state");
        validate[5] = true;
      }

      // vaccine
      let vaccine = $("#vaccine").val();
      if (vaccine === null) {
        showErrorMessage("#vaccine");
        validate[6] = false;
      } else {
        hideErrorMessage("#vaccine");
        validate[6] = true;
      }

      // total Places
      let totalPlaces = $("#totalPlaces").val();
      if (totalPlaces === "" || isNaN(totalPlaces) || totalPlaces <= 0) {
        validate[7] = false;
        showErrorMessage("#totalPlaces");
      } else {
        hideErrorMessage("#totalPlaces");
        validate[7] = true;
      }

      /*console.log(date + "\n" + dateObj + "\n" + time_from + "\n" + time_to + "\n" +
        address + "\n" + zipCode + "\n" + city + "\n" + state + "\n" + vaccine + "\n" +
        totalPlaces);*/

      // check if every value of array is true. if input is valid: create new Vaccine
      // Appointment, add it to Vaccine Appointment List and print it.
      let checkTrue = validate => validate.every(v => v === true);


      // let ok = validateAll(validate);
      let ok = checkTrue(validate);
      if (ok) {
        let id = apptmList.getFreeId();
        // console.log(id);
        const apptm = {
          id: id,
          totalPlaces: totalPlaces,
          vaccine: vaccine,
          date: date,
          time_from: time_from,
          time_to: time_to,
          address: address,
          zipCode: zipCode,
          city: city,
          state: state
        }
        let a = new VaccAppointment(apptm, apptmList);
        apptmList.addApptm(a);
        apptmList.print();
      }
      return ok;
    }

    /*function validateAll(validate){
      console.log(validate.length);
      for(let i = 0; i <= validate.length; i++){
        console.log(i);
        if(validate[i] === false){
          return false;
        }
      }
      return true;
    }*/

    /**
     * Shows and sets error message for form input.
     * @param divId [id where input invalid]
     * @param message [error message]
     */
    function errorMessage(divId, message) {
      $(divId).next().text(message);
      $(divId).next().removeClass("hidden");
      $(divId).css("border-color", "#dc3545");
    }

    /**
     * Shows error message that is already pre-specified in html
     * @param divId [id where input invalid]
     */
    function showErrorMessage(divId) {
      $(divId).next().removeClass("hidden");
      $(divId).css("border-color", "#dc3545");
    }

    /**
     * Hides error message again.
     * @param divId [id where input valid]
     */
    function hideErrorMessage(divId) {
      $(divId).next().addClass("hidden");
      $(divId).css("border-color", "#198754");
    }

  }

  /**
   * Shows / hides admin dashboard and form for new Vaccination Appointment.
   *
   * @param seeAdmin [should admin dashboard be visible? true = visible, false = hidden]
   * @param seeNewApptm [new appointment form visible? true = visible, false = hidden]
   */
  [toggleSeen](seeAdmin, seeNewApptm) {
    if (seeAdmin === false) {
      $("#admin").addClass("hidden");
    } else {
      $("#admin").removeClass("hidden");
    }
    if (seeNewApptm === false) {
      $("#newVaccApptm").addClass("hidden");
    } else {
      $("#newVaccApptm").removeClass("hidden");
    }
  }

  /**
   * For Testing: Let's people register from console by writing
   * administration.register(..)
   *
   * @param apptmId [id of the vaccine appointment (z.B: "1" for Impftermin "1")]
   * @param firstName [first Name of person registering]
   * @param lastName [last Name of person registering]
   * @param svnr [social security number of person registering]
   */
  register(apptmId, firstName, lastName, svnr) {
    let apptm = this.#apptmList.getApptm(apptmId);
    // console.log(apptm);

    let person = {
      firstName: firstName,
      lastName: lastName,
      svnr: svnr
    }

    if (person.svnr < 1000000000 || person.svnr >= 10000000000) {
      console.error("Ungültige Sozialversicherungsnummer!");
    }else
      if (!this.#apptmList.apptmExists(apptmId)) {
        console.error("Diesen Termin gibt es nicht.");
      } else if (apptm.getAvailable() === 0) {
        console
        .error(
          "Zu viele Anmeldungen, bitte nehmen Sie einen anderen Termin"
        );
      } else {
        let personList = apptm.getPersonList();

        if (personList.existsSVNR(person.svnr)) {
          console.error("Sie haben sich zu diesem Termin schon angemeldet.");
        } else {
          personList.addPerson(person);


          this.#apptmList.print(person);
          console.info(apptm.getMessage());
        }
      }
    }
}
