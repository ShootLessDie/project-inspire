let dropdownButtons = document.getElementsByClassName("dropdown-item");
let currentActivity;
let currentFact;
let savedActivites = JSON.parse(localStorage.getItem("favouriteActivites"));
let savedFacts = JSON.parse(localStorage.getItem("favouriteFacts"));
let currentDogResponse;
let isGettingDoggyPics = false;

for (const element of dropdownButtons) {
  element.addEventListener("click", function () {
    let selectedActivity = this.innerText;

    document.getElementById("drowdownMainText").innerText = selectedActivity;
    getActivity(selectedActivity.toLowerCase());
  });
}

async function getActivity(activity) {
  let queryURl;
  if (activity == "any") {
    queryURl = "https://www.boredapi.com/api/activity/";
  } else {
    queryURl = `https://www.boredapi.com/api/activity?type=${activity}`;
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
    addedActivityNotification();
  }
  // Checks if the previous value is the same as the current one, to stop double saving by double clicking by accident.
  else if (
    currentActivity.key != savedActivites[savedActivites.length - 1].key
  ) {
    savedActivites.push(currentActivity);
    localStorage.setItem("favouriteActivites", JSON.stringify(savedActivites));
    addedActivityNotification();
  } else {
    addedActivityErrorNotification();
  }
  savedActivites = JSON.parse(localStorage.getItem("favouriteActivites"));
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
  let tableArea = $("#activityTableArea");
  if (!savedActivites) {
    tableArea.html("").text("You have no activites saved.");
  } else {
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

    for (const element of savedActivites) {
      let tableRow = $("<tr></tr>").appendTo(tableBody);
      $("<td></td>").text(element.activity).appendTo(tableRow);
      $("<td></td>")
        .text(element.type)
        .addClass("activityType")
        .appendTo(tableRow);
      let completed = $("<td></td>")
        .html(
          `<button type="button" class="btn btn-outline-danger removeButton" id = "${element.key}">Remove</button>
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
      `<br><div class="alert alert-success" role="alert">
  <span class="font-weight-bold">${currentActivity.activity}</span> has been added to your favourites!
</div>`
    )
    .fadeIn(0)
    .fadeOut(0)
    .fadeIn();
}

function addedActivityErrorNotification() {
  // Removes notification when 3s has passed
  setTimeout(
    function () {
      $("#favActivityError").fadeOut();
    },

    2000
  );

  $("#favActivityError")
    .html(
      `<br><div class="alert alert-danger" role="alert">
  Oops! <span class="font-weight-bold">${currentActivity.activity}</span> was added to your favourites just before.
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
      `<br><div class="alert alert-success" role="alert">
  <span class="font-weight-bold">${currentFact.value}</span> has been added to your favourites!
</div>`
    )
    .fadeIn(0)
    .fadeOut(0)
    .fadeIn();
}

function addedFactErrorNotification() {
  // Removes notification when 3s has passed
  setTimeout(
    function () {
      $("#favFactError").fadeOut();
    },

    2000
  );

  $("#favFactError")
    .html(
      `<br><div class="alert alert-danger" role="alert">
  Oops! <span class="font-weight-bold">${currentFact.value}</span> was added to your favourites just before.
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
    let index = savedActivites.findIndex((x) => x.key == itemID);
    savedActivites.splice(index, 1);
    localStorage.setItem("favouriteActivites", JSON.stringify(savedActivites));
    seeFavouriteActivites();
    if (savedActivites.length == 0) {
      localStorage.removeItem("favouriteActivites");
      savedActivites = "";
    }
    seeFavouriteActivites();
  });
}

printChuckFact();
$("#getChuckFactButton").on("click", printChuckFact);

$("#saveFactButton").on("click", function () {
  if (!savedFacts) {
    let toSaveFacts = [];
    toSaveFacts.push(currentFact);
    localStorage.setItem("favouriteFacts", JSON.stringify(toSaveFacts));
    addedFactNotification();
  }
  // Checks if the previous value is the same as the current one, to stop double saving by double clicking by accident.
  else if (currentFact.id != savedFacts[savedFacts.length - 1].id) {
    savedFacts.push(currentFact);
    localStorage.setItem("favouriteFacts", JSON.stringify(savedFacts));
    addedFactNotification();
  } else {
    addedFactErrorNotification();
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
  let tableArea = $("#factsTableArea");
  if (!savedFacts) {
    tableArea.html("").text("You have no activites saved.");
  } else {
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

    for (const element of savedFacts) {
      let tableRow = $("<tr></tr>").appendTo(tableBody);
      $("<td></td>").text(element.value).appendTo(tableRow);
      let completed = $("<td></td>")
        .html(
          `<button type="button" class="btn btn-outline-danger removeFactButton" id = "${element.id}">Remove</button>
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
    let index = savedFacts.findIndex((x) => x.id == itemID);
    savedFacts.splice(index, 1);
    localStorage.setItem("favouriteFacts", JSON.stringify(savedFacts));
    if (savedFacts.length == 0) {
      localStorage.removeItem("favouriteFacts");
      savedFacts = "";
    }
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

window.addEventListener("scroll", async function () {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (isGettingDoggyPics === false) {
    if (clientHeight + scrollTop >= scrollHeight - 150) {
      isGettingDoggyPics = true;
      await getDogPic();
      isGettingDoggyPics = false;
    }
  }
});
