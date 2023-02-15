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
    seeFavourites();
  }
});

function seeFavourites() {
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

      completed.children().on("click", deleteFavourite);
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

$("#clearFavouritesButton").on("click", function () {
  savedActivites = "";
  localStorage.removeItem("favouriteActivites");
  seeFavourites();
});

function deleteFavourite() {
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
    seeFavourites();
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
  else if (
    savedFacts.id != savedFacts[savedFacts.length - 1].id
  ) {
    savedFacts.push(currentFact);
    localStorage.setItem("favouriteFacts", JSON.stringify(savedFacts));
  }
  savedFacts = JSON.parse(localStorage.getItem("favouriteFacts"));
});

async function printChuckFact() {
  await getChuckFact();
  const factArea = $("#chuckFactArea");
  factArea.text(currentFact.value);
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
  console.log(currentFact);
}
