let indiaTotal = document.querySelector("#totalIndia");
let totCase = document.querySelector("#totalCase");
let totDeaths = document.querySelector("#totalDeaths");
let totRecovered = document.querySelector("#totalRecovered");
let recCases = document.querySelector("#todayCases");
let recDeaths = document.querySelector("#todayDeaths");
let tBody = document.querySelector("#tableBody");
let stBody = document.querySelector("#stateTableBody");
// let indiaBtn = document.querySelector("#indiaBtn");

// indiaBtn.onclick = getStateCorona;

getCorona();
getStateCorona();
// openLoader();

function getCorona() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const data = JSON.parse(this.responseText);

      let totalCases = 0;
      let totalDeaths = 0;
      let totalRecovered = 0;
      let newCases = 0;
      let newDeaths = 0;

      for (const key in data) {
        if (data[key].country === "India") {
          indiaTotal.innerHTML = data[key].cases;
        }

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

      let stateDataCopy = stateData;
      let sortable = [];
      for (let stateName in stateDataCopy) {
        sortable.push([stateName, stateDataCopy[stateName]]);
      }

      sortable.sort(function(a, b) {
        return b[1] - a[1];
      });

      let stateDataSorted = {};
      sortable.forEach(function(item) {
        stateDataSorted[item[0]] = item[1];
      });

      Object.getOwnPropertyNames(stateDataSorted).forEach(function(property) {
        let tr = document.createElement("tr");
        // tr.className = "table-data";
        stBody.appendChild(tr);

        let stateTh = document.createElement("th");
        stateTh.scope = "row";
        stateTh.className = "state";
        stateTh.innerHTML = property;
        tr.appendChild(stateTh);

        let stateTd = document.createElement("td");
        stateTd.className = "stateCases";
        stateTd.className += "stateCasesTd";
        stateTd.innerHTML = stateDataSorted[property];
        tr.appendChild(stateTd);
      });
    }
  };

  xhttp.open(
    "GET",
    "https://script.googleusercontent.com/macros/echo?user_content_key=7bBaHyF-ouc2aM5hgKStaihXIt1RdXMvJZtQUmV2SvNX4BCdwwGCeYjsp334fPOjBowmgHB4Povyhrai0wfDK382jAeesogvm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnKXFvsR88vL4WiBr168omFadgngDnj25DLpEvLRaiIpzZr1NvbW-Bo38vshdDBv10tpytj_A4aoE&lib=Mm1FD1HVuydJN5yAB3dc_e8h00DPSBbB3",
    true
  );
  xhttp.send();
}
