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
let currentFact;
let savedActivites = JSON.parse(localStorage.getItem("favouriteActivites"));
let savedFacts = JSON.parse(localStorage.getItem("favouriteFacts"));
let currentDogResponse;
let isGettingDoggyPics = false

for (let i = 0; i < dropdownButtons.length; i++) {
  dropdownButtons[i].addEventListener("click", function () {
    let selectedActivity = this.innerText;

    document.getElementById("drowdownMainText").innerText = selectedActivity;
    getActivity(selectedActivity.toLowerCase());
  });
}

async function getActivity(activity) {
  let queryURl;
  if (activity == "any") {
    queryURl = "http://www.boredapi.com/api/activity/";
  } else {
    queryURl = `http://www.boredapi.com/api/activity?type=${activity}`;
  }
  let response = await fetch(queryURl);
  currentActivity = await response.json();
  $("#activity").text(currentActivity.activity);
  $("#saveActivityButton").html(
    `<button type="button" class="btn btn-info customButton">Save to favourites</button>`
  );
}

$("#saveActivityButton").on("click", function () {
  if (!savedActivites) {
    let toSaveActivites = [];
    toSaveActivites.push(currentActivity);
    localStorage.setItem("favouriteActivites", JSON.stringify(toSaveActivites));
  }
  // Checks if the previous value is the same as the current one, to stop double saving by double clicking by accident.
  else if (
    currentActivity.key != savedActivites[savedActivites.length - 1].key
  ) {
    savedActivites.push(currentActivity);
    localStorage.setItem("favouriteActivites", JSON.stringify(savedActivites));
  }
  savedActivites = JSON.parse(localStorage.getItem("favouriteActivites"));
  addedActivityNotification();
});

//Populate favourites table when the button is pressed to bring up the modal.
$("#seeFavouritesButton").on("click", function () {
  if (!savedActivites) {
    $("#activityTableArea").text("You have no activites saved.");
  } else {
    seeFavouriteActivites();
  }
});

function seeFavouriteActivites() {
  if (!savedActivites) {
    tableArea = $("#activityTableArea")
      .html("")
      .text("You have no activites saved.");
  } else {
    let tableArea = $("#activityTableArea");
    tableArea.html("");
    let table = $("<table></table>");
    table.addClass("table table-bordered table-hover ");
    let tableHead = $("<thead></thead>");
    tableHead
      .html(
        `<tr>
  <th scope="col">Activity</th>
  <th scope="col">Activitiy Type</th>
  <th scope="col">Completed?</th>
</tr>`
      )
      .appendTo(table);
    let tableBody = $("<tbody></tbody>").appendTo(table);

    for (let i = 0; i < savedActivites.length; i++) {
      let tableRow = $("<tr></tr>").appendTo(tableBody);
      let activity = $("<td></td>")
        .text(savedActivites[i].activity)
        .appendTo(tableRow);
      let type = $("<td></td>")
        .text(savedActivites[i].type)
        .addClass("activityType")
        .appendTo(tableRow);
      let completed = $("<td></td>")
        .html(
          `<button type="button" class="btn btn-outline-danger removeButton" id = "${savedActivites[i].key}">Remove</button>
        `
        )
        .appendTo(tableRow);

      completed.children().on("click", deleteFavouriteActivity);
    }

    tableArea.append(table);
  }
}

function addedActivityNotification() {
  // Removes notification when 3s has passed
  setTimeout(
    function () {
      $("#favActivityConfirmation").fadeOut();
    },

    2000
  );

  $("#favActivityConfirmation")
    .html(
      `<div class="alert alert-success" role="alert">
  <span class="font-weight-bold">${currentActivity.activity}</span> has been added to your favourites!
</div>`
    )
    .fadeIn(0)
    .fadeOut(0)
    .fadeIn();
}

function addedFactNotification() {
  // Removes notification when 3s has passed
  setTimeout(
    function () {
      $("#favFactConfirmation").fadeOut();
    },

    2000
  );

  $("#favFactConfirmation")
    .html(
      `<div class="alert alert-success" role="alert">
  <span class="font-weight-bold">${currentFact.value}</span> has been added to your favourites!
</div>`
    )
    .fadeIn(0)
    .fadeOut(0)
    .fadeIn();
}

$("#clearFavouritesButton").on("click", function () {
  savedActivites = "";
  localStorage.removeItem("favouriteActivites");
  seeFavouriteActivites();
});

function deleteFavouriteActivity() {
  let itemID = $(this).attr("id");
  let parent = $(this).parent();
  parent.html("");
  let confirmButton = $("<div></div>")
    .html(
      `<button type="button" class="btn btn-outline-danger" id = "${itemID}">Sure?</button>`
    )
    .appendTo(parent);
  confirmButton.on("click", function () {
    index = savedActivites.findIndex((x) => x.key == itemID);
    savedActivites.splice(index, 1);
    localStorage.setItem("favouriteActivites", JSON.stringify(savedActivites));
    seeFavouriteActivites();
  });
}

printChuckFact();
$("#getChuckFactButton").on("click", printChuckFact);

$("#saveFactButton").on("click", function () {
  console.log("save button pressed");
  if (!savedFacts) {
    let toSaveFacts = [];
    toSaveFacts.push(currentFact);
    localStorage.setItem("favouriteFacts", JSON.stringify(toSaveFacts));
  }
  // Checks if the previous value is the same as the current one, to stop double saving by double clicking by accident.
  else if (currentFact.id != savedFacts[savedFacts.length - 1].id) {
    savedFacts.push(currentFact);
    localStorage.setItem("favouriteFacts", JSON.stringify(savedFacts));
    addedFactNotification();
  }
  savedFacts = JSON.parse(localStorage.getItem("favouriteFacts"));
});

$("#seeFavouriteFactsButton").on("click", function () {
  seeFavouriteFacts();
});

$("#clearFavouriteFactsButton").on("click", function () {
  savedFacts = "";
  localStorage.removeItem("favouriteFacts");
  seeFavouriteFacts();
});

function seeFavouriteFacts() {
  if (!savedFacts) {
    tableArea = $("#factsTableArea")
      .html("")
      .text("You have no activites saved.");
  } else {
    let tableArea = $("#factsTableArea");
    tableArea.html("");
    let table = $("<table></table>");
    table.addClass("table table-bordered table-hover ");
    let tableHead = $("<thead></thead>");
    tableHead
      .html(
        `<tr>
  <th scope="col">Activity</th>
  <th scope="col">Completed?</th>
</tr>`
      )
      .appendTo(table);
    let tableBody = $("<tbody></tbody>").appendTo(table);

    for (let i = 0; i < savedFacts.length; i++) {
      let tableRow = $("<tr></tr>").appendTo(tableBody);
      let activity = $("<td></td>")
        .text(savedFacts[i].value)
        .appendTo(tableRow);
      let completed = $("<td></td>")
        .html(
          `<button type="button" class="btn btn-outline-danger removeFactButton" id = "${savedFacts[i].id}">Remove</button>
        `
        )
        .appendTo(tableRow);

      completed.children().on("click", deleteFavouriteFact);
    }

    tableArea.append(table);
  }
}

function deleteFavouriteFact() {
  let itemID = $(this).attr("id");
  let parent = $(this).parent();
  parent.html("");
  let confirmButton = $("<div></div>")
    .html(
      `<button type="button" class="btn btn-outline-danger" id = "${itemID}">Sure?</button>`
    )
    .appendTo(parent);
  confirmButton.on("click", function () {
    index = savedFacts.findIndex((x) => x.id == itemID);
    console.log(index);
    savedFacts.splice(index, 1);
    localStorage.setItem("favouriteFacts", JSON.stringify(savedFacts));
    seeFavouriteFacts();
  });
}

async function printChuckFact() {
  await getChuckFact();
  const factArea = $("#chuckFactArea");
  factArea.text(currentFact.value);
  $("#saveFactButton").empty();
  $("<button></button>")
    .attr("type", "button")
    .attr("class", "btn btn-danger customButton")
    .text("Save to favourites")
    .css({
      "margin-top": "1%",
      display: "block",
    })
    .appendTo($("#saveFactButton"));
}

async function getChuckFact() {
  const queryURl = "https://api.chucknorris.io/jokes/random";
  let response = await fetch(queryURl);
  currentFact = await response.json();
}

getDogPic();

async function getDogPic() {
  const queryURl = "https://dog.ceo/api/breeds/image/random/9";
  let response = await fetch(queryURl);
  currentDogResponse = await response.json();
  printDogPics();
}

function printDogPics() {
  let printArea = $("#dogPicturesContainer");
  let dogPics = currentDogResponse.message;

  let i = 0; // to count though the images
  // Creates rows
  for (let r = 0; r < dogPics.length / 3; r++) {
    let row = $("<div></div>").addClass("row");
    // Create columns
    for (let c = 0; c < 3; c++) {
      let column = $("<div></div>")
        .addClass("col-lg-4 mb-4 mb-lg-0")
        .appendTo(row);
      // Create image objects
      $("<img>")
        .attr({
          src: dogPics[i],
          alt: "Picture of a dog",
          class: "w-100 shadow  rounded mb-4 dogImages",
        })
        .appendTo(column);
      i++;
    }
    row.appendTo(printArea);
  }
}

window.addEventListener("scroll", async function(){
  const {scrollTop, scrollHeight, clientHeight} =document.documentElement
  if (isGettingDoggyPics === false){
    if (clientHeight + scrollTop >= scrollHeight - 150){
      isGettingDoggyPics = true
      await getDogPic()
      isGettingDoggyPics = false
  }
  

  }
})
