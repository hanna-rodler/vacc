/**
 * This class holds all Vaccination Appointments from VaccAppointment.js
 */
export default class AppointmentList {
  #appointmentList;
  #id=0;

  constructor() {
    this.#appointmentList = new Map();
  }

  addApptm(apptm) {
    this.#appointmentList.set(apptm.getId(), apptm);
    this.#id++;
  }

  /**
   * Get apptm of specific id. (Cause for this implementation: Key might differ from
   * id after deleting appointment.)
   * @param apptmId [id of Vaccination appointment]
   * @returns {any} [Vaccination appointment]
   */
  getApptm(apptmId) {
    // return this.#appointmentList.get(apptmId);
    for (let apptm of this.#appointmentList.values()) {
      if (apptm.getId() === apptmId) {
        return apptm;
      }
    }
  }

  /**
   * Print AppointmentList and all it's Vaccination Appointments.
   */
  print() {
    for (let apptm of this.#appointmentList.values()) {
      apptm.print();
    }
  }

  getSize() {
    return this.#appointmentList.size;
  }

  getFreeId() {
    return this.#id+1;
  }


  /**
   * Checks if Appointment exists (key may differ from VaccAppointment id)
   * @param apptmId [search for this one]
   * @returns {boolean} [true if an appointment with apptmId exists, false if one
   * doesn't exist.]
   */
  apptmExists(apptmId) {
    for (let k of this.#appointmentList.keys()) {
      if (k === apptmId) {
        // console.log("apptm Exists");
        return true;
      }
    }
    // console.log("no Apptm with id "+apptmId);
    return false;
  }

  getApptmList() {
    return this;
  }

  /**
   * Delete Appointment from appointmentList.
   * @param id [id of Appointment to be deleted]
   */
  deleteApptm(id) {
    for (let apptm of this.#appointmentList.values()) {
      if (Number(id) === apptm.getId()) {
        // console.log(this.#appointmentList.delete(apptm.getId()));
        this.#appointmentList.delete(apptm.getId());
      }
    }
  }
}