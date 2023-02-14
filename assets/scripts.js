// document
//   .getElementById("chuck-button")
//   .addEventListener("mouseover", function () {
//     $(".jumbotron").css(
//       "background-image",
//       "url(https://images.saymedia-content.com/.image/t_share/MTkwNzEyNjU2MjE3MzE5MzUw/5-awesome-chuck-norris-movies.jpg)"
//     );
//   });

// document
//   .getElementById("chuck-button")
//   .addEventListener("mouseleave", function () {
//     $(".jumbotron").css("background-image", "");
//   });

let dropdownButtons = document.getElementsByClassName("dropdown-item");

for (let i = 0; i < dropdownButtons.length; i++) {
  dropdownButtons[i].addEventListener("click", function () {
    console.log(this.innerText);
    document.getElementById("drowdownMainText").innerText = this.innerText
  });
}

// dropdownButtons.forEach((element) => {
//   element.addEventListener("click", function () {
//     console.log(this);
//   });
// });
