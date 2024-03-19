var toggle = document.querySelector(".toggle");
var selectors = [
  ".sideNav",
  ".mainBoard",
  ".cardGroup",
  ".headerNav",
  ".displayer",
  ".form-container form"
];

var elements = selectors.map(selector => document.querySelector(selector));

toggle.addEventListener("click", function() {
  console.log("Toggle button clicked"); // Check if the toggle button event is firing
  elements.forEach(element => {
    if (element) {
      element.classList.toggle("active");
    } else {
      console.log("Element not found for selector");
    }
  });
});