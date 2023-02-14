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
  let savedActivites = JSON.parse(localStorage.getItem("favouriteActivites"));
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

  //   try {
  //     let savedActivites = JSON.parse(localStorage.getItem("favouriteActivites"));
  //     toSaveActivites.push(savedActivites);
  //     toSaveActivites.push(currentActivity);
  //     localStorage.setItem("favouriteActivites", JSON.stringify(toSaveActivites));
  //   } catch (error) {
  //     toSaveActivites = currentActivity;
  //     localStorage.setItem("favouriteActivites", JSON.stringify(toSaveActivites));
  //   }
  console.log(savedActivites);
});

//Populate favourites table when the button is pressed to bring up the modal.
$("#seeFavouritesButton").on("click", function () {
  let tableArea = $("#activityTableArea");
  tableArea.html("");
  let table = $("<table></table>");
  table.addClass("table table-bordered table-hover ");
  table.html( `<thead>
  <tr>
    <th scope="col">#</th>
    <th scope="col">Activity</th>
    <th scope="col">Activitiy Type</th>
    <th scope="col">Completed?</th>
  </tr>
</thead>
<tbody>
  <tr>
    <th scope="row">1</th>
    <td>Mark</td>
    <td>Otto</td>
    <td>@mdo</td>
  </tr>
  <tr>
    <th scope="row">2</th>
    <td>Jacob</td>
    <td>Thornton</td>
    <td>@fat</td>
  </tr>
  <tr>
    <th scope="row">3</th>
    <td colspan="2">Larry the Bird</td>
    <td>@twitter</td>
  </tr>
</tbody>`);
  console.log(table);
  tableArea.append(table);
});
