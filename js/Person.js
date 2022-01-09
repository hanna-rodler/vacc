export default class Person {
  #svnr;
  #firstName;
  #lastName;
  #vacced; // true if vaccinated, false if not vaccinated yet

  constructor({firstName, lastName, svnr}) {
    this.#svnr = svnr;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#vacced = false;
  }

  /**
   * Sets (isVaccinated = true) or removes vaccinated status (isVaccinated=false)
   * from person.
   * @param isVaccinated [true for vaccinated, false for removing vaccination status]
   */
  vaccinatePerson(isVaccinated) {
    this.#vacced = isVaccinated;
  }

    /**
     * Prints table row for detail View.
     */
  print() {
    let vaccinated;
    if (this.#vacced) {
      vaccinated = `<input type="checkbox" disabled="true" id="p_${this.#svnr}" checked></td>`;
    } else {
      vaccinated = `<input type="checkbox" id="p_${this.#svnr}"></td>`;
    }

    let tr = `<tr>
                  <td><label for="p_${this.#svnr}">${this.#svnr}</label></td>
                  <td>${this.#firstName}</td>
                  <td>${this.#lastName}</td>
                  <td>${vaccinated}</td>
               </tr>`;
    $("#detailV").append(tr);
  }

  getSVNR() {
    return this.#svnr;
  }

    /**
     * Check if person is vaccinated.
     * @returns {*} [true for vaccinated, false for not vaccinated]
     */
  isVaccinated() {
    return this.#vacced
  }
}