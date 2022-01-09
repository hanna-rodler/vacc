import PersonList from "./PersonList.js";

/**
 * This class holds all Vaccination Appointments included in
 * AppointmentList.js
 */
export default class VaccAppointment {
  #id;
  #totalPlaces; // Max umber of possible registrations
  #vaccine;
  #date;
  #time_from;
  #time_to;
  #address;
  #zipCode;
  #city;
  #state;
  #personList; // list for registered people
  #registeredNum; // numbered of people who registerd
  #availableNum; // places available for registrations
  #apptmList; // appointment List that Vacc Appointment is part of.

  /**
   * Constructor for new Vaccination Appointment.
   * @param id
   * @param totalPlaces [Maximum umber of possible registrations for Vaccination
   * Appointment.]
   * @param vaccine [Type of Vaccine]
   * @param date [date for appointment]
   * @param time_from [time appointment starts]
   * @param time_to [time appointment ends]
   * @param address [street and street number where appointment is at]
   * @param zipCode [zip code of where appointment is at]
   * @param city [city where appointment is at]
   * @param state [state where appointment is at]
   * @param persons [object of persons that are registered for appointment]
   */
  constructor({
                id, totalPlaces, vaccine, date, time_from, time_to, address, zipCode,
                city, state, persons
              }, apptmList) {
    this.#id = id;
    this.#totalPlaces = totalPlaces;
    this.#vaccine = vaccine;
    this.#date = date;
    this.#time_from = time_from;
    this.#time_to = time_to;
    this.#address = address;
    this.#zipCode = zipCode;
    this.#city = city;
    this.#state = state;
    this.#personList = new PersonList();
    if (persons !== undefined) {
      this.#personList.addPersons(persons);
    }
    this.#registeredNum = this.#personList.getSize();
    this.#availableNum = this.#totalPlaces - this.#registeredNum;
    this.#apptmList = apptmList;
    // this.testPrint();
  }

  getPersonList() {
    return this.#personList;
  }

  getAvailable() {
    return this.#availableNum;
  }

  getId() {
    return this.#id;
  }

  getApptm() {
    return this;
  }

  /**
   * Returns message for successful registration.
   * @returns {string}
   */
  getMessage() {
    return "Sie haben sich erfoglreich zur Impfung mit " + this.#vaccine + " am " +
      this.#date + " von " + this.#time_from + " bis " + this.#time_to + " in " +
      this.#address + " " + this.#zipCode + " " + this.#state + "angemeldet";
  }

  testPrint() {
    console.log("Date: " + this.#date + "\n id:" + this.#id + "\nVon:" + this.#time_from +
      "\nBis:" + this.#time_to + "\n Address" +
      this.#address + "\n PLZ" + this.#zipCode + "\nStadt" + this.#city + "\nLand" +
      this.#state + "\nI:" + this.#vaccine + "\nAnzahl" +
      this.#totalPlaces + "\n" + this.#personList);

  }

  /**
   * Prints tr for vaccination appointment and creates clickhandlers for editing and
   * deleting appointment.
   */
  print() {
    $("#apptm_" + this.#id).remove();

    this.#registeredNum = this.#personList.getSize();
    this.#availableNum = this.#totalPlaces - this.#registeredNum;
    let tr = `<tr id="apptm_${this.#id}">
                    <td>Impftermin ${this.#id}</td>
                    <td>${this.#date}</td>
                    <td>${this.#time_from}</td>
                    <td>${this.#time_to}</td>
                    <td>${this.#address}<br> ${this.#city}, ${this.#state}</td>
                    <td>${this.#vaccine}</td>
                    <td class="text-center">${this.#registeredNum}</td>
                    <td class="text-center">${this.#availableNum}</td>
                    <td class="text-center">${this.#totalPlaces}</td>
                    <td class="text-center"><span
                        class="material-icons" id="edit_${this.#id}">edit</span></td>
        
                    <td class="text-center"><span
                        class="material-icons" id="delete_${this.#id}">delete</span></td>
                  </tr>`

    $("#vaccAdmin").append(tr);

    this.createClickHandlers();
  }

  /**
   * Edit clicked: Loads detailed View of appoinment.
   * Delete clicked: creates Modal for deletion.
   */
  createClickHandlers() {
    $("#edit_" + this.#id).on("click", (e) => {
      this.loadDetailView();
    });
    $("#delete_" + this.#id).on("click", (e) => {
      // this.deleteVaccApptm(e);
      this.createDeleteModal(e.currentTarget.id.slice(7))
    });
  }

  /**
   * Loads detailed View with all registrations for Vaccination Appointment. Creates
   * Clickhandlers for canceling Vaccination and Saving Vaccination. By clicking
   * "Öffnen" it is possible to edit the vaccination status of people who have already
   * been marked as vaccinated.
   */
  loadDetailView() {
    $("#detailView").removeClass("hidden");
    $("#admin").addClass("hidden");
    $("#detailHeader").empty();
    let infos = `<h2>Impftermin am <span id="vaccDate">${this.#date}</span></h2>` +
      `<div><span class="material-icons-outlined">schedule</span>` +
      `${this.#time_from} Uhr - ${this.#time_to} Uhr</div>` +
      `<div></div><span class="material-icons-outlined">place</span>${this.#address} von ${this.#city} bis ${this.#state}</div>`;

    $("#detailHeader").append(infos);
    this.#personList.printDetails();

    $("#cancelVacc").on("click", () => {
      $("#detailView").addClass("hidden");
      $("#admin").removeClass("hidden");
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    // "vaccinates" people. Sets checkbox to disabled so people cannot get
    // "unvaccinated" on accident.
    $("#saveVacc").on("click", () => {
        let cB = $('input[type=checkbox]');
        cB.each((i, el) => {
          let $this = $(el);
          let cbID = $this.attr('id');
          cbID = cbID.slice(2);
          if($this.is(':checked')){
            $this.attr('disabled', true);
            this.#personList.vaccinate(cbID, true);
          }else{
            this.#personList.vaccinate(cbID, false);
          }
        })
        $("#detailView").addClass("hidden");
        $("#admin").removeClass("hidden");
      }
    )
    ;
  }

  /**
   * Creates Modal for confirming deletion / showing that deletion is not
   * possible if there are registrations already. Clickhandlers for deleting and canceling
   * deletion.
   * @param targetId
   */
  createDeleteModal(targetId) {
    let mHead = $(".modal-header");
    let mBody = $(".modal-body");
    let mFoot = $(".modal-footer");
    let m = $(".modal");
    m.removeClass("hidden");
    // console.log(m);
    let headContent;
    let bodyContent;
    let footContent;
    if (this.#registeredNum !== 0) {
      headContent = `<h5 class="modal-title" id="exampleModalLabel">Anmeldungen vorhanden!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
      bodyContent = `<div>In dem Termin am ${this.#date} von ${this.#time_from} bis ${this.#time_to} sind ${this.#registeredNum}` +
        ` Anmeldungen vorhanden. Der Termin kann nicht gelöscht werden.</div>`;
      footContent = `<button type="button" class="btn btn-primary" id="dismiss" data-bs-dismiss="modal">Schließen</button>`;
    } else {
      console.assert(this.#registeredNum === 0);
      headContent = `<h5 class="modal-title" id="exampleModalLabel">Diesen Termin wirklich löschen?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
      bodyContent = `<div>Termin am ${this.#date} von ${this.#time_from} bis ${this.#time_to}`;
      footContent = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal">Abbrechen</button>
                    <button type="button" class="btn btn-delete" id="confDel_${targetId}">Löschen</button>`;
    }
    /*m.removeClass(".hidden");*/

    mHead.append(headContent);
    mBody.append(bodyContent);
    mFoot.append(footContent);

    $("#myModal").modal('show');

    $(".btn-delete").on("click", (e) => {
      // console.log(e.currentTarget.id.slice(8));
      $("#myModal").modal('hide');

      this.deleteVaccApptm(e.currentTarget.id.slice(8));
    });

    $("#myModal").on('hidden.bs.modal', function (e) {
      $(".modal-header").empty();
      $(".modal-body").empty();
      $(".modal-footer").empty();
    })
  }

  /**
   * Deteles Vaccination Appointment from this.#apptmList and removes it from html.
   * @param targetId [id of clicked trash can]
   */
  deleteVaccApptm(targetId) {
    // console.log("apptm_" + targetId);
    this.#apptmList.getApptmList().deleteApptm(targetId);
    $("#apptm_" + targetId).remove();
    this.#apptmList.print();
    // console.log(this.#apptmList.getApptmList());
    // .delete(targetId);
  }
}