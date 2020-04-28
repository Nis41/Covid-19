let indiaTotal = document.querySelector("#totalIndia");
let gujaratTotal = document.querySelector("#totalGujarat");
let totCase = document.querySelector("#totalCase");
let totDeaths = document.querySelector("#totalDeaths");
let totRecovered = document.querySelector("#totalRecovered");
let recCases = document.querySelector("#todayCases");
let recDeaths = document.querySelector("#todayDeaths");
let tBody = document.querySelector("#tableBody");
let stBody = document.querySelector("#stateTableBody");
let gjBody = document.querySelector("#gujaratTableBody");
let updatedSpan = document.querySelector("#updated");

// Slider
const Slider = document.querySelector(".sliding");
const btnWrapper = document.querySelector(".buttonWrapper");

//State Modal
const stateTitle = document.querySelector(".stateNameTitle");

// console.log(Slider);

let stateDataBtn = {};
let copyStateData = {};

// let stateText = "";

getStateCorona();
getCorona();
function getCorona() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      // console.log(data);

      data.sort(function (a, b) {
        return b.cases - a.cases;
      });

      let totalCases = 0;
      let totalDeaths = 0;
      let totalRecovered = 0;
      let newCases = 0;
      let newDeaths = 0;
      let lastUpdate = 0;
      for (const key in data) {
        lastUpdate = data[0].updated;

        totalCases += data[key].cases;
        totalDeaths += data[key].deaths;
        totalRecovered += data[key].recovered;
        newCases += data[key].todayCases;
        newDeaths += data[key].todayDeaths;

        totCase.innerHTML = totalCases;
        totDeaths.innerHTML = totalDeaths;
        totRecovered.innerHTML = totalRecovered;
        recCases.innerHTML = newCases;
        recDeaths.innerHTML = newDeaths;

        let tr = document.createElement("tr");
        tr.className = "table-data";
        tBody.appendChild(tr);

        let td0 = document.createElement("img");
        td0.src = data[key].countryInfo.flag;
        td0.className = "flagImg";
        tr.appendChild(td0);

        let th = document.createElement("th");
        th.scope = "row";
        th.className = "country";
        th.innerHTML = data[key].country;
        tr.appendChild(th);

        let td1 = document.createElement("td");
        td1.className = "spacing";
        td1.innerHTML = data[key].cases;
        tr.appendChild(td1);

        let td2 = document.createElement("td");
        td2.className = "spacing";
        td2.innerHTML = data[key].active;
        tr.appendChild(td2);

        let td3 = document.createElement("td");
        td3.className = "recover spacing";
        td3.innerHTML = data[key].recovered;
        tr.appendChild(td3);

        let td4 = document.createElement("td");
        td4.className = "deaths spacing";
        td4.innerHTML = data[key].deaths;
        tr.appendChild(td4);

        let td5 = document.createElement("td");
        td5.className = "spacing";
        td5.innerHTML = data[key].critical;
        tr.appendChild(td5);

        let td6 = document.createElement("td");
        td6.className = "spacing";
        td6.innerHTML = data[key].todayCases;
        tr.appendChild(td6);

        let td7 = document.createElement("td");
        td7.className = "deaths spacing";
        td7.innerHTML = data[key].todayDeaths;
        tr.appendChild(td7);
      }
      const dateObj = new Date(lastUpdate);
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes();
      const seconds = dateObj.getSeconds();

      const formattedTime =
        hours.toString() + ":" + minutes.toString() + ":" + seconds.toString();

      function tConvert(time) {
        // Check correct time format and split into components
        time = time
          .toString()
          .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
          // If time format correct
          time = time.slice(1); // Remove full string match value
          time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(""); // return adjusted time or original string
      }
      let updatedText = "Last Updated At " + tConvert(formattedTime);
      updatedSpan.innerHTML = updatedText;
      closeLoader();
    }
  };
  xhttp.open("GET", "https://corona.lmao.ninja/v2/countries", true);
  xhttp.send();
}

function openLoader() {
  var loader = document.querySelector(".loader");
  loader.style.display = "block";
}

function closeLoader() {
  let loader = document.querySelector(".loader");
  loader.style.display = "none";
}

function getStateCorona() {
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const stateData = JSON.parse(this.responseText);

      copyStateData = stateData;

      var newStateData = {}; //creating a new object to sort data
      var gujaratData = {}; //creating a new object for gujarat data
      for (const state in stateData) {
        let stateCasesTotal = 0;

        for (const district in stateData[state]) {
          if (district === "statecode") continue; //api owner was giving two fileds to i NAN was coming so i just conituned it.

          for (const cities in stateData[state][district]) {
            city = stateData[state][district][cities];
            stateCasesTotal += city.confirmed;
            if (state === "Gujarat") {
              gujaratData[cities] = city.confirmed;
              // console.log("District: " + cities + " case: " + city.confirmed);
            }
          }
          // console.log("State: " + state + " case: " + stateCasesTotal);
          newStateData[state] = stateCasesTotal; //over new object is ready with state name and total cases
        }
      }

      // getGujaratCorona(gujaratData); //passing gujarat data object to a function

      let newstateDataCopy = newStateData; //giving a copy of new object for sorting
      let sortable = [];
      for (let stateName in newstateDataCopy) {
        sortable.push([stateName, newstateDataCopy[stateName]]);
      }

      sortable.sort(function (a, b) {
        return b[1] - a[1]; //sorting in decending order
      });

      let stateDataSorted = {};
      sortable.forEach(function (item) {
        stateDataSorted[item[0]] = item[1];
        stateDataBtn[item[0]] = item[1];
      });

      
      stateDataBtn = { ...stateDataSorted};
      let indiaRecord = 0;

      for (const stateName in stateDataSorted) {
        if (stateName === "Unknown") continue;

        let tr = document.createElement("tr");
        // tr.className = "table-data";
        stBody.appendChild(tr);

        let stateTh = document.createElement("th");
        stateTh.scope = "row";
        stateTh.className = "state";
        stateTh.innerHTML = stateName;
        tr.appendChild(stateTh);

        let stateTd = document.createElement("td");
        stateTd.className = "stateCases";
        stateTd.className += "stateCasesTd";
        stateTd.innerHTML = stateDataSorted[stateName];
        tr.appendChild(stateTd);

        if (stateName === "Unknown") continue;
        indiaRecord += stateDataSorted[stateName];
      }
      // console.log("India", indiaRecord);
      indiaTotal.innerHTML = indiaRecord;
    }
  };

  xhttp.open(
    "GET",
    "https://api.covid19india.org/state_district_wise.json",
    false
  );
  xhttp.send();
}

function getGujaratCorona(gujaratData, stateTitleArg) {
  // console.log(gujaratData);

  let newgujaratDataCopy = gujaratData; //giving a copy of new object for sorting
  let sortable = [];
  for (let distName in newgujaratDataCopy) {
    sortable.push([distName, newgujaratDataCopy[distName]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1]; //sorting in decending order
  });

  // console.log(sortable);

  let gujaratDataSorted = {};
  sortable.forEach(function (item) {
    gujaratDataSorted[item[0]] = item[1];
  });

  // console.log(gujaratDataSorted);

  let gujaratRecord = 0;
  stateTitle.innerHTML = stateTitleArg;
  gjBody.innerHTML = "";
  for (dist in gujaratDataSorted) {
    if (dist === "Unknown") continue;
    let tr = document.createElement("tr");
    gjBody.appendChild(tr);

    let stateTh = document.createElement("th");
    stateTh.scope = "row";
    stateTh.className = "GujDist";
    stateTh.innerHTML = dist;
    tr.appendChild(stateTh);

    let stateTd = document.createElement("td");
    stateTd.innerHTML = gujaratDataSorted[dist];
    tr.appendChild(stateTd);

    gujaratRecord += gujaratDataSorted[dist];
  }
  // console.log("India", indiaRecord);
  // gujaratTotal.innerHTML = gujaratRecord;
}



// Sliding Logic

const leftButton = document.querySelector(".leftBtn");
const rightButton = document.querySelector(".rightBtn");

let counter = 0;
let left = 0;
let right = 0;
let inc = 0;

if(window.screen.width < 480 && window.screen.width > 320){
  incr = 1;
}else{
  incr = 8;
}

function lbClick(){
  // console.log("Left Button Clicked!");

  if(left <= 0){
    left = 31;
    right = left + incr;
  }else{
    right = left;
    left = left - incr;  
  }

  // console.log(left, right);
  loadSlider(left, right);
  // console.log(stateRecord);
}

function rbClick(){
  // console.log("Right Button Clicked!");

  if (left <= 31) {
    if (right == 0){
      // right++;
      left = incr;
      right++;
      right = right + incr;
    }else{
      left = right;
      right = right + incr;  
    }
  }else{
    right = incr;
    left = 0;
  }

  
  // console.log(right)  
  // console.log(left, right);
  loadSlider(left, right);
}

function loadSlider(left, right) {

  // right = right;

  let tempArray = [];
  for (let temp in stateDataBtn) {
    // let stateName = temp;
    let tempObject = {};
    tempObject[temp] = stateDataBtn[temp];
    // console.log(tempObject);
    tempArray.push(tempObject);
  }

  // console.log(tempArray);

  // let i = left;

  btnWrapper.innerHTML = "";

  for (let i in tempArray){
    // console.log(tempArray[i]);

    if(left >= 0 && right <= 32){

      if(i >= left && i < right ) {

        for (let key in tempArray[i]){
          // console.log(key, stateDataBtn[key]);
          // console.log("Hello")

          let stateBtn = document.createElement("button");
          stateBtn.type = "button";
          stateBtn.className = "sliderButtons btn btn-info";  
          stateBtn.name = key;
          // stateBtn.count = i;
          stateBtn.setAttribute("data-toggle", "modal");
          stateBtn.setAttribute("data-target", "#GujaratModal");
          // stateBtn.dataToggle = "modal";
          // stateBtn.dataTarget = "#GujaratModal";
          stateBtn.innerHTML = key;
          stateBtn.onclick = btnOnClick;

          let stateCount = document.createElement("span");
          // stateCount.id = ""
          stateCount.className = "badge badge-light spanCount";
          stateCount.innerHTML = stateDataBtn[key];

          stateBtn.appendChild(stateCount);

          btnWrapper.appendChild(stateBtn);

          Slider.appendChild(btnWrapper);

          right = right;
          // counter++;
        }  
      }
    }
  }

  // console.log(left, right, counter);

}

// if(window.screen.width < 480 && window.screen.width > 320) {
//   console.log("Hello!");
// }

// window.addEventListener("resize", function() {
//   // console.log("Changed!")
//   console.log(window.screen.width);
// });

window.addEventListener("onload", loadSlider(left, right + incr));

function btnOnClick(e){
  // console.log(e.target.name);

  if(e.target.name){

    var gujaratData = {}; //creating a new object for gujarat data
      for (const state in copyStateData) {
        // let stateCasesTotal = 0;

        for (const district in copyStateData[state]) {
          if (district === "statecode") continue; //api owner was giving two fileds to i NAN was coming so i just conituned it.

          for (const cities in copyStateData[state][district]) {
            city = copyStateData[state][district][cities];
            // stateCasesTotal += city.confirmed;
            if (state === e.target.name) {
              gujaratData[cities] = city.confirmed;
              // console.log("District: " + cities + " case: " + city.confirmed);
            }
          }
          // console.log("State: " + state + " case: " + stateCasesTotal);
          // newStateData[state] = stateCasesTotal; //over new object is ready with state name and total cases
        }
      }

      // console.log(gujaratData);

      getGujaratCorona(gujaratData, e.target.name);

  // console.log("Button Clicked!");

  }

  
}


leftButton.onclick = lbClick;
rightButton.onclick = rbClick;

// function hello(randomState) {
//   // console.log("Hello");
//   // console.log(copyStateData);

//   var gujaratData = {}; //creating a new object for gujarat data
//       for (const state in copyStateData) {
//         // let stateCasesTotal = 0;

//         for (const district in copyStateData[state]) {
//           if (district === "statecode") continue; //api owner was giving two fileds to i NAN was coming so i just conituned it.

//           for (const cities in copyStateData[state][district]) {
//             city = copyStateData[state][district][cities];
//             // stateCasesTotal += city.confirmed;
//             if (state === randomState) {
//               gujaratData[cities] = city.confirmed;
//               // console.log("District: " + cities + " case: " + city.confirmed);
//             }
//           }
//           // console.log("State: " + state + " case: " + stateCasesTotal);
//           // newStateData[state] = stateCasesTotal; //over new object is ready with state name and total cases
//         }
//       }

//       console.log(gujaratData);

// };

// hello("Mizoram");

// console.log(leftButton);
// console.log(rightButton);


// ----------------------



// console.log(left, right);
  // console.log(window.screen.width);

  // console.log("Slider Loaded!");

  // let tempArray = stateNames;

  // console.log(stateText);

  // console.log(tempArray[0]);

  // console.log(stateDataBtn["Gujarat"]);

  // var fruits = ["apple", "orange", "cherry"];
  // stateNames.forEach(myFunction);

  // function myFunction(item) {
  //   // document.getElementById("demo").innerHTML += index + ":" + item + "<br>";
  //   console.log(item);
  // }




// ------------------------------------




// for (let key in stateDataBtn){
  //   // console.log(key, stateDataBtn[key]);
  //   // console.log("Hello")

  //   let stateBtn = document.createElement("button");
  //   stateBtn.type = "button";
  //   stateBtn.className = "sliderButtons btn btn-info";  
  //   stateBtn.name = key;
  //   stateBtn.count = counter;
  //   stateBtn.innerHTML = key;
  //   stateBtn.onclick = btnOnClick;

  //   let stateCount = document.createElement("span");
  //   // stateCount.id = ""
  //   stateCount.className = "badge badge-light spanCount";
  //   stateCount.innerHTML = stateDataBtn[key];

  //   stateBtn.appendChild(stateCount);

  //   Slider.appendChild(stateBtn);

  //   counter++;
  // }
  // let stateBtn = document.createElement("button");
  // stateBtn.type = "button";
  // stateBtn.className = "btn btn-info nav-a";