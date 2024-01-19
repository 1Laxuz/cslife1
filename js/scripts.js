

  var toggle = document.querySelector(".toggle");
  var sidenav = document.querySelector(".sideNav");
  var mainboard = document.querySelector(".mainBoard");
  var cards = document.querySelector(".cardGroup");
  var header = document.querySelector(".headerNav");
  var displayer = document.querySelector(".displayer");
  var form = document.querySelector(".form-container form");

  toggle.onclick = function(e){
  sidenav.classList.toggle("active");
  header.classList.toggle("active");
  mainboard.classList.toggle("active");
  cards.classList.toggle("active");
  displayer.classList.toggle("active");
    form.classList.toggle("active");
}


