"use strict";
const patientURL = "patient"
//const script = document.createElement('script');
//script.src = '//code.jquery.com/jquery-1.11.0.min.js';
//document.getElementsByTagName('head')[0].appendChild(script);

//getDataFromLocalStorage()
//    .then(configurePage)
//    .catch(() => { console.log("error retreiving data"); });

//function getDataFromLocalStorage() {

//    return new Promise((success, error) => {
//        const data = {
//            locations: JSON.parse(localStorage.getItem('locationsDataset')),
//            columnNames: JSON.parse(localStorage.getItem('culumnNames')),
//            columnKeys: JSON.parse(localStorage.getItem('columnKeys'))
//        };
//        success(data);
//    });

//}
const columnNames = ["Start Date", "End Date", "City", "Location"];
const columnKeys = ["startDate", "endDate", "city", "location"];

function getLocationsByPatientId(currentPatientId, url) {

    var xhttp = new XMLHttpRequest();

    return new Promise((resolve, reject) => {

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            }
            if (this.readyState == 4 && this.status !== 200) {
                reject("an error accured retrieving data");
            }
        }
        xhttp.open("GET", `${url}/${currentPatientId}`);
        //xhttp.open("GET", "path/1");
        xhttp.send();
    });

};

function updatePatient(updatedPatient, url) {

    var xhttp = new XMLHttpRequest();

    return new Promise((resolve, reject) => {

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            }
            if (this.readyState == 4 && this.status !== 200) {
                reject("an error accured updating");
            }
        }
        xhttp.open("PUT", "patient");
        xhttp.setRequestHeader('Content-Type', 'application/json' );
        xhttp.setRequestHeader('Accept', 'application/json');
        xhttp.send(JSON.stringify(updatedPatient))
    });

};

let currentPatient = null;
configurePage(columnNames, columnKeys, patientURL)
function configurePage(columnNames, columnKeys, patientURL ) {
 
    const patientIdInp = document.getElementById("patientIdInp");
    let patientId;
    if (patientIdInp !== null) {
        patientIdInp.addEventListener("input", function () {
            patientId = parseInt(patientIdInp.value);
            if (isValidPatientId(patientId)) {
                SetViewLocationBtnAvailability(true);
            }
            else {
                SetViewLocationBtnAvailability(false);
            }
        });
    }

    const viewLocationTableBtn = document.getElementById("viewLocationTableBtn");

    if (viewLocationTableBtn !== null) {
        viewLocationTableBtn.addEventListener("click",async function () {
            //currentPatientLocations.length = 0;
            currentPatient = await getLocationsByPatientId(patientId, patientURL);
            buildLocationTable(currentPatient.paths, columnNames, columnKeys);
            SetViewLocationBtnAvailability(false);
        });
    }

    const addLocationBtn = document.getElementById("addLocationBtn");
    if (addLocationBtn !== null) {
        addLocationBtn.addEventListener("click", function () {
            addLocation(currentPatient, columnKeys);
        });
    }

    function SetViewLocationBtnAvailability(isValidPatientId) {
        if (isValidPatientId === false) {
            viewLocationTableBtn.disabled = true;
        }
        else {
            viewLocationTableBtn.disabled = false;
        }
    }

    function isValidPatientId(patientId) {

        if (Number.isInteger(patientId)) {
            return true;
        }
        else {
            alert("please enter valid patient Id");
            return false;
        }
    }
   

    
};
       
    

function buildLocationTable(currentPatientLocations, columnNames, columnKeys) {
        const columnCount = columnNames.length;

        //Get add new location inputs.
        const newLocationInputs = document.getElementsByClassName("addLocationInp");

        const table = document.createElement("TABLE");
        table.setAttribute("id", "locationsTable");
        table.border = "1";

       // Add the header row.
        const row = table.insertRow(-1);
        for (let i = 0; i < columnCount; i++) {
            const headerCell = document.createElement("TH");
            headerCell.dataset.id = i;
            headerCell.setAttribute("type", "text");
            headerCell.addEventListener("click", function () {
                sortLocationTableByColumn(currentPatientLocations, columnNames, columnKeys, i);
            });
            headerCell.innerHTML = columnNames[i];
            row.appendChild(headerCell);

            newLocationInputs[i].value = '';
            newLocationInputs[i].setAttribute("placeholder", columnNames[i]);

        }

      //  Add the data rows.
        for (let i = 0; i < currentPatientLocations.length; i++) {
            addRowToTable(table, currentPatientLocations[i], currentPatientLocations, columnKeys);
        }

        const tableDv = document.getElementById("tableDv");
        tableDv.innerHTML = "";
        tableDv.appendChild(table);

        //show add location option
        document.getElementById("addLocationDv").style.display = "block";
    }

    function addRowToTable(table, newLocation, currentPatientLocations, columnKeys) {
        const row = table.insertRow(-1);

        for (let key of columnKeys) {
            let cell = row.insertCell(-1);
            cell.innerHTML = newLocation[key];
        }
        const deleteCell = row.insertCell(-1);
        const deleteBtn = document.createElement("BUTTON");   // Create a <button> element
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener("click", function () {
           // Send current row to delete function.
            deleteLocation(currentPatientLocations, row);
        });
        deleteCell.appendChild(deleteBtn);

    }
    
    function sortLocationTableByColumn(currentPatientLocations, columnNames, columnKeys, columnIndex) {
        const sortByKey = columnKeys[columnIndex];
        currentPatientLocations.sort((a, b) => a[sortByKey].localeCompare(b[sortByKey]));

        buildLocationTable(currentPatientLocations, columnNames, columnKeys);
    }

async function addLocation(currentPatient, columnKeys) {
        const startDateInp = document.getElementById("startDateInp");
        const endDateInp = document.getElementById("endDateInp");
        const cityInp = document.getElementById("cityInp");
        const locationInp = document.getElementById("locationInp");

        function checkDetailsValid() {
            if (startDateInp === null || endDateInp === null || cityInp === null || locationInp === null) {
                return false;
            }
            if (startDateInp.value === "" || endDateInp.value === "" || cityInp.value === "" || locationInp.value === "") {
                alert("invalid details");
                return false;
            }
            if ((Date.parse(startDateInp.value) >= Date.parse(endDateInp.value))) {
                alert("End date should be greater than Start date");
                endDateInp.value = "";
                return false;
            }
            else {
                return true;
            }

        }
        if (checkDetailsValid() === false) {
            return;
        }
        else {
            const newLocation = {
                    //startDate: startDateInp.value.toString(),
                startDate: (((startDateInp.valueAsDate.getMonth() > 8) ? (startDateInp.valueAsDate.getMonth() + 1) : ('0' + (startDateInp.valueAsDate.getMonth() + 1))) + '/' + ((startDateInp.valueAsDate.getDate() > 9) ? startDateInp.valueAsDate.getDate() : ('0' + startDateInp.valueAsDate.getDate())) + '/' + startDateInp.valueAsDate.getFullYear()),
                endDate: (((endDateInp.valueAsDate.getMonth() > 8) ? (endDateInp.valueAsDate.getMonth() + 1) : ('0' + (endDateInp.valueAsDate.getMonth() + 1))) + '/' + ((endDateInp.valueAsDate.getDate() > 9) ? endDateInp.valueAsDate.getDate() : ('0' + endDateInp.valueAsDate.getDate())) + '/' + endDateInp.valueAsDate.getFullYear()),
                    city: cityInp.value,
                    location: locationInp.value
            };


            const locationsTable = document.getElementById("locationsTable");
            addRowToTable(locationsTable, newLocation, currentPatient.paths, columnKeys);

            //add location to data
            currentPatient.paths.push(newLocation);
            const response = await updatePatient(currentPatient, "patient");
            console.log(response);


        }

    }

    function deleteLocation(currentPatientLocations, rowToDelete) {


        //Get all rows from table as array
        const tableBody = rowToDelete.parentNode;
        const allRows = Array.prototype.slice.call(tableBody.children);

        const index = allRows.indexOf(rowToDelete);
        tableBody.removeChild(rowToDelete);

        currentPatientLocations.splice(index - 1, 1);

    }



