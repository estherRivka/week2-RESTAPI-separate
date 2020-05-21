
'use strict';
const script = document.createElement('script');
script.src = '//code.jquery.com/jquery-1.11.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);
let locationsDataset = [];
const countries = ["Afghanistan", "Jerusalem", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central Arfrican Republic", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal", "Netherlands", "Netherlands AnendDatees", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
let culumnNames = [];

window.addEventListener('load', loadHtmlPage);

function getAllLocationsFromServer() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://localhost:6060/path", success: function (result) {
                resolve(result);
            },
            error: function (result) {
                reject(result);
            }
        });
    });


}
function getLocationsFromServerByCity(city) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://localhost:6060/path/" + city, success: function (result) {
                resolve(result);
            },
            error: function (result) {
                reject(result);

            }
        });
    });


}
function getCulumnNamesData(locationsDataset) {
    return Object.keys(locationsDataset[0]);
}

function isNotNull(element) {
    return (element === null) ? false : true;
}

function visualizitionOfElement(element, status) {
    element.style.visibility = status;
}

function statusOfElement(element, status) {
    element.disabled = status;
}

function loadHtmlPage() {
    if (isNotNull(document.getElementById("sortTableByDate")) === true) {
        const SortBtn = document.getElementById("sortTableByDate");

        SortBtn.addEventListener("click", function () {
            if (isNotNull(document.getElementById("LocationsOfPatienceTable")) === true);
            sortTableByDate(document.getElementById("LocationsOfPatienceTable"));
        });
        // visualizitionOfElement(SortBtn,"hidden");   
    }

    if (isNotNull(document.getElementById("citySearchSubmit")) === true) {
        const btnSearchSubmit = document.getElementById("citySearchSubmit");
        btnSearchSubmit.addEventListener("click", function () {
            if (isNotNull(document.getElementById("myInput")) === true)
                showResultsFilterdByCity(document.getElementById("myInput").value);
        });
        //statusOfElement(btnSearchSubmit,true);
    }

    if (isNotNull(document.getElementById("getAllLocations")) === true)
        document.getElementById("getAllLocations").addEventListener("click", function () {
            getAllLocationsOfPatience();
        });




    if (isNotNull(document.getElementById("myInput")) === true)
        autocomplete(document.getElementById("myInput"), countries);

    getAllLocationsFromServer().then(result => {
        culumnNames = getCulumnNamesData(result);
        locationsDataset = result;
        createTable(result);
    }).catch(result => {
        alert(result.responseText);
    });;

}


function createTable(locationsDataset) {
    const tableOnPage = document.getElementById('LocationsOfPatienceTable');
    if (tableOnPage !== null) {
        tableOnPage.parentNode.removeChild(tableOnPage);
    }
    if (isNotNull(document.getElementById("sortTableByDate")) === true)
        visualizitionOfElement(document.getElementById("sortTableByDate"), "visible");


    if (locationsDataset.length > 0) {
        const col = [];
        const numberOfProperties = (Object.keys(locationsDataset[0])).length;
        const b = document.getElementsByTagName("body")[0];
        const table = document.createElement("table");
        const tHead = document.createElement("thead");
        const hRow = document.createElement("tr");
        const tBody = document.createElement("tbody");
        table.style.textAlign = "center";
        table.setAttribute("id", "LocationsOfPatienceTable");
        table.style.width = '50%';
        table.setAttribute('border', '1');
        table.style.borderColor = "red";
        table.setAttribute('cellspacing', '0');
        table.setAttribute('cellpadding', '5');

        for (let i = 0; i < numberOfProperties; i++) {
            const th = document.createElement("th");
            th.innerHTML = culumnNames[i].charAt(0).toUpperCase() + culumnNames[i].slice(1);
            hRow.appendChild(th);
        }
        tHead.appendChild(hRow);
        table.appendChild(tHead);

        for (var i = 0; i < locationsDataset.length; i++) {
            const bRow = document.createElement("tr");
            const currentRowValues = Object.values(locationsDataset[i]);
            for (const item of currentRowValues) {
                const td = document.createElement("td");
                td.style.width = "50px";
                td.innerHTML = item;
                bRow.appendChild(td);
            }

            tBody.appendChild(bRow);
        }
        table.appendChild(tBody);
        b.appendChild(table);
    }

    else {
        if (isNotNull(document.getElementById("sortTableByDate")) === true)
            statusOfElement(document.getElementById("sortTableByDate"), true);


        if (isNotNull(document.getElementById("citySearchDiv")))
            visualizitionOfElement(document.getElementById("citySearchDiv"), "hidden");
        alert("There where No Results For Your Search!");
    }
}

function getAllLocationsOfPatience() {
    if (isNotNull(document.getElementById("myInput")) === null);
    document.getElementById("myInput").value = "";

    if (isNotNull(document.getElementById("sortTableByDate")) === true)
        statusOfElement(document.getElementById("sortTableByDate"), false);
    if (isNotNull(document.getElementById("citySearchDiv")) === true)
        visualizitionOfElement(document.getElementById("citySearchDiv"), "visible");

    getAllLocationsFromServer().then(result => {
        culumnNames = getCulumnNamesData(result);
        locationsDataset = result;
        createTable(result);
    }).catch(result => {
        alert(result.responseText);
    });;



}

function sortTableByDate(currentTable) {
    if (locationsDataset.length > 1) {
        var rows, switching, i, x, y, shouldSwitch;
        if (typeof currentTable === undefined) {
            return;
        }
        switching = true;
        while (switching) {
            switching = false;
            rows = currentTable.rows;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                //dateIndexInTable = culumnNames.indexOf('startDate');
                x = rows[i].getElementsByTagName("td")[culumnNames.indexOf('startDate')];
                y = rows[i + 1].getElementsByTagName("td")[culumnNames.indexOf('startDate')];
                if (new Date(x.innerHTML).getTime() < new Date(y.innerHTML).getTime()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }
}

function autocomplete(inp, arr) {
    let currentFocus;
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    if (isNotNull(this.getElementsByTagName("input")[0]) === true)
                        inp.value = this.getElementsByTagName("input")[0].value;
                    if (isNotNull(document.getElementById("citySearchSubmit")) === true)
                        statusOfElement(document.getElementById("citySearchSubmit"), false);

                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        if (isNotNull(x) === true) {

            for (let i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function showResultsFilterdByCity(city) {
    const citiesSortedByInput = [];
    getLocationsFromServerByCity(city).then(result => {
        createTable(result);
        if (isNotNull(document.getElementById("getAllLocations")) === true)
            statusOfElement(document.getElementById("getAllLocations"), false);
    }).catch(result => {
        alert(result.responseText);
    });



}
