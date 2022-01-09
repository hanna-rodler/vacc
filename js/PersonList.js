import Person from "./Person.js";

/**
 * Map with all Person registered for a VaccAppointment.
 */
export default class PersonList {
  #personList

  constructor() {
    this.#personList = new Map();
  }

  /**
   * Add people to PersonList.
   * @param persons [object with persons]
   */
  addPersons(persons) {
    for (let p of persons) {
      let pers = new Person(p);
      this.#personList.set(p.svnr, pers);
    }
  }

  /**
   * adds a single person to PersonList.
   * @param p [person object]
   */
  addPerson(p) {
    let pers = new Person(p);
    this.#personList.set(p.svnr, pers);
  }

  /**
   * Checks if a person with svnr already exists in this.#personList
   * @param svnr [social security number of person]
   * @returns {boolean} [true if person with svnr exists, false if does not exist.]
   */
  existsSVNR(svnr) {
    for (let k of this.#personList.keys()) {
      if (svnr === k) return true;
    }
    return false;
  }

  getSize() {
    return this.#personList.size;
  }

  getPerson(id) {
    // console.log("gettin person: " + id);
    return this.#personList.get(id);
  }

  /**
   * Vaccinate (isVaccinated=true) or remove vaccinated status (isVaccianted=false)
   * for person with svnr.
   * @param svnr [social security number of person]
   * @param isVaccinated [true → vaccinate, false → remove vaccination status]
   */
  vaccinate(svnr, isVaccinated) {
    for (let p of this.#personList.values()) {
      if (p.getSVNR() === Number(svnr)) {
        p.vaccinatePerson(isVaccinated);
      }
    }
  }

  /**
   * Print Detail View after "edit" was clicked in admin dashboard. Lets user know if
   * there are no registrations yet, shows registered people with vaccination status.
   * Vaccination can be saved or canceled and edited by clicking "Öffnen". People that
   * have already received vaccination cannot be edited without clicking "Öffnen" to
   * prevent accidental removal of vaccinated status.
   */
  printDetails() {
    $("#detailV").empty();
    $("#openVacc").addClass("hidden");
    if (this.#personList.size === 0) {
      $("#detailTable").addClass("hidden");
      $("#noReg").remove();
      $("#detailHeader").after(`<p class="mt-3 text-center border hint" id="noReg">Noch keine Anmeldungen</p>`)
      $("#cancelVacc").addClass("hidden");
      $("#saveVacc").text("Okay");
    } else {
      $("#saveVacc").text("Speichern");
      $("#cancelVacc").removeClass("hidden");
      $("#noReg").remove();
      $("#detailTable").removeClass("hidden");
      for (let p of this.#personList.values()) {
        p.print();
      }
      if (this.existVaccinated()) {
        $("#openVacc").removeClass("hidden");
        $("#openVacc").on("click", () => {
          this.openCB();
        });
      }
    }
  }

  /**
   * Set disabled checkboxes to enabled again, so they can be edited again.
   */
  openCB() {
    let checkedCB = $('input[type=checkbox]:disabled');
    checkedCB.each((i, el) => {
        let $this = $(el);
        let cbID = $this.attr('id');
        $this.attr('disabled', false);
        cbID = cbID.slice(2);
        this.vaccinate(cbID, false);
      }
    )
  }

  /**
   * Checks if there are any vaccianted people in this.#personList]
   * @returns {boolean} [true if at least on person is vaccinated. false if no person
   * is vaccinated yet.]
   */
  existVaccinated() {
    for (let p of this.#personList.values()) {
      if (p.isVaccinated())
        return true;
    }
  }

}