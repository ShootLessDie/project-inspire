//Chuck norris background change effect, not necessary

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
let currentActivity;

for (let i = 0; i < dropdownButtons.length; i++) {
  dropdownButtons[i].addEventListener("click", function () {
    console.log(this.innerText);
    let selectedActivity = this.innerText;

    document.getElementById("drowdownMainText").innerText = selectedActivity;
    getActivity(selectedActivity.toLowerCase());
  });
}

async function getActivity(activity) {
  let queryURl;
  if (activity == "any") {
    console.log("any");
    queryURl = "http://www.boredapi.com/api/activity/";
  } else {
    console.log("else loop");
    queryURl = `http://www.boredapi.com/api/activity?type=${activity}`;
  }
  let response = await fetch(queryURl);
  currentActivity = await response.json();
  console.log(currentActivity);
  $("#activity").text(currentActivity.activity);
  $("#saveActivityButton").html(
    `<button type="button" class="btn btn-info customButton">Save to favourites</button>`
  );
}

$("#saveActivityButton").on("click", function(){
  let savedActivites
  try{
  savedActivites  = JSON.parse(localStorage.getItem("favouriteActivites"))
  }
  catch{}
  savedActivites.push(currentActivity)
  localStorage.setItem("favouriteActivites", savedActivites)
})

// dropdownButtons.forEach((element) => {
//   element.addEventListener("click", function () {
//     console.log(this);
//   });
// });
