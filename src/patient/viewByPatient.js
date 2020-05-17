
const locationDataUrl =  "../OurDataBase.json";
const locationData = {
    locations: [],
    columnNames: [],
    currentPatientLocations: []
};
alert("vfg");
 //if(location.href.split("/").slice(-1)=="viewByPatient.html") {
// window.onload = function () {
    getData(locationData, locationDataUrl);
// }

function getData(locationData, url) {
    //replace with getdata from database
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            locationData = JSON.parse(this.responseText);
            configurePage(locationData);

        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function configurePage(locationData) {

    const viewLocationTableBtn = document.getElementById("viewLocationTableBtn");
    if (viewLocationTableBtn !== null) {
        viewLocationTableBtn.addEventListener("click", function () {
            const patientId = parseInt(patientIdInp.value);
            setCurrentPatientLocations(locationData, patientId);
            buildLocationTable(locationData);
        });
    }

    const addLocationBtn = document.getElementById("addLocationBtn");
    if (addLocationBtn !== null) {
        addLocationBtn.addEventListener("click", function () {
            addLocation(locationData);
        });
    }

    const patientIdInp = document.getElementById("patientIdInp");
    if (patientIdInp !== null) {
        patientIdInp.addEventListener("input", function () {
            const patientId = parseInt(patientIdInp.value);
            if (isValidPatientId(patientId)) {
                SetiVewLocationBtnAvailability(true);
            }
            else {
                SetiVewLocationBtnAvailability(false);
            }
        });
    }
    createAutoCompleteCity();
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


function setCurrentPatientLocations(locationData, currentPatientId) {
    locationData.currentPatientLocations = locationData.locations.filter(function (location) {
        return location.patientId === currentPatientId;
    });

    //Remove current patients locations for editing
    locationData.locations = locationData.locations.filter(function (location) {
        return location.patientId !== currentPatientId;
    });
}
function SetiVewLocationBtnAvailability(isValidPatientId) {

    if (isValidPatientId === false) {
        document.getElementById("viewLocationTableBtn").disabled = true;
    }
    else {
        document.getElementById("viewLocationTableBtn").disabled = false;
    }
}


//Build an array containing location records.
function buildLocationTable(locationData) {


    //Get the count of columns.
    const columnCount = locationData.columnNames.length;

    //Get add new location inputs.
    const newLocationInputs = document.getElementsByClassName("addLocationInp");




    //Create a HTML Table element.
    const table = document.createElement("TABLE");
    table.setAttribute("id", "locationsTable");
    table.border = "1";

    //Add the header row.
    const row = table.insertRow(-1);
    for (let i = 0; i < columnCount; i++) {
        const headerCell = document.createElement("TH");
        headerCell.dataset.id = i;
        headerCell.setAttribute("type", "text");
        headerCell.addEventListener("click", function () {
            sortLocationTableByColumn(locationData, i);
        });
        headerCell.innerHTML = locationData.columnNames[i];
        row.appendChild(headerCell);

        //Insert headers as default value into add location inputs
        newLocationInputs[i].setAttribute("placeholder", locationData.columnNames[i]);

    }

    //Add the data rows.
    for (let i = 0; i < locationData.currentPatientLocations.length; i++) {
        addRowToTable(table, locationData.currentPatientLocations[i], locationData);
    }

    const tableDv = document.getElementById("tableDv");
    tableDv.innerHTML = "";
    tableDv.appendChild(table);

    //show add location option
    document.getElementById("addLocationDv").style.display = "block";
}


function deleteLocation(locationData, rowToDelete) {


    //Get all rows from table as array
    const tableBody = rowToDelete.parentNode;
    const allRows = Array.prototype.slice.call(tableBody.children);

    const index = allRows.indexOf(rowToDelete);
    tableBody.removeChild(rowToDelete);

    //delete location from dataObj
    locationData.currentPatientLocations.splice(index - 1, 1);

}

function addLocation(locationData) {
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
            patientId: 1,
            locationdetails: {
                startDate: startDateInp.value.toString(),
                endDate: endDateInp.value.toString(),
                city: cityInp.value,
                location: locationInp.value
            }
        };


        locationsTable = document.getElementById("locationsTable");
        addRowToTable(locationsTable, newLocation, locationData);

        //add location to data
        locationData.currentPatientLocations.push(newLocation);
        locationData.locations.push(newLocation);

    }

}

function addRowToTable(table, newLocation, locationData) {
    const locationDetailKeys = Object.keys(locationData.locations[0].locationdetails);
    const row = table.insertRow(-1);

    for (let key of locationDetailKeys) {
        let cell = row.insertCell(-1);
        cell.innerHTML = newLocation.locationdetails[key];
    }
    const deleteCell = row.insertCell(-1);
    const deleteBtn = document.createElement("BUTTON");   // Create a <button> element
    deleteBtn.innerHTML = "Delete";
    deleteBtn.addEventListener("click", function () {
        //Send current row to delete function.
        deleteLocation(locationData, row);
    });
    deleteCell.appendChild(deleteBtn);

}
function sortLocationTableByColumn(locationData, columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    //sort dataObj locations
    const locationDetailKeys = Object.keys(locationData.currentPatientLocations[0].locationdetails);
    const sortByKey = locationDetailKeys[columnIndex];
    locationData.currentPatientLocations.sort((a, b) => a.locationdetails[sortByKey].localeCompare(b.locationdetails[sortByKey]));

    buildLocationTable(locationData);
}
function createAutoCompleteCity() {
    function autocomplete(cityInp, countries) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/


        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        cityInp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < countries.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (countries[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + countries[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += countries[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + countries[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        cityInp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        cityInp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != cityInp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    /*An array containing all the country names in the world:*/
    const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central Arfrican Republic", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

    /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
    autocomplete(document.getElementById("cityInp"), countries);
}
