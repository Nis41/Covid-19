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

getStateCorona();
getCorona();

function getCorona() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);
      // console.log(data);
      data.sort(function(a, b) {
        return b.cases - a.cases;
      });

      let totalCases = 0;
      let totalDeaths = 0;
      let totalRecovered = 0;
      let newCases = 0;
      let newDeaths = 0;

      for (const key in data) {
        if (data[key].country === "World") {
          totalCases = data[key].cases;
          totalDeaths = data[key].deaths;
          totalRecovered = data[key].recovered;
          newCases = data[key].todayCases;
          newDeaths = data[key].todayDeaths;

          totCase.innerHTML = totalCases;
          totDeaths.innerHTML = totalDeaths;
          totRecovered.innerHTML = totalRecovered;
          recCases.innerHTML = newCases;
          recDeaths.innerHTML = newDeaths;
          continue;
        }

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

        closeLoader();
      }
    }
  };
  xhttp.open("GET", "https://corona.lmao.ninja/countries", true);
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

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const stateData = JSON.parse(this.responseText);

      // console.log(stateData);

      var newStateData = {}; //creating a new object to sort data
      var gujaratData = {}; //creating a new object for gujarat data
      for (const state in stateData) {
        let stateCasesTotal = 0;

        for (const district in stateData[state]) {
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

      getGujaratCorona(gujaratData); //passing gujarat data object to a function

      let newstateDataCopy = newStateData; //giving a copy of new object for sorting
      let sortable = [];
      for (let stateName in newstateDataCopy) {
        sortable.push([stateName, newstateDataCopy[stateName]]);
      }

      sortable.sort(function(a, b) {
        return b[1] - a[1]; //sorting in decending order
      });

      let stateDataSorted = {};
      sortable.forEach(function(item) {
        stateDataSorted[item[0]] = item[1];
      });

      // console.log(stateDataSorted);
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
    true
  );
  xhttp.send();
}

function getGujaratCorona(gujaratData) {
  // console.log(gujaratData);

  let newgujaratDataCopy = gujaratData; //giving a copy of new object for sorting
  let sortable = [];
  for (let distName in newgujaratDataCopy) {
    sortable.push([distName, newgujaratDataCopy[distName]]);
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1]; //sorting in decending order
  });

  let gujaratDataSorted = {};
  sortable.forEach(function(item) {
    gujaratDataSorted[item[0]] = item[1];
  });

  let gujaratRecord = 0;
  for (dist in gujaratDataSorted) {
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
  gujaratTotal.innerHTML = gujaratRecord;
}
