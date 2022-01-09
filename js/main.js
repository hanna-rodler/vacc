import Administration from "./Administration.js";

window.administration = new Administration();

$(function () {
  $("#myModal").modal('hide');
  administration.init();
});


