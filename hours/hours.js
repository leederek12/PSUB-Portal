var CLIENT_ID = '741003728693-o30686b65lf3np0fd6lbhngfhmv5oqkh.apps.googleusercontent.com'
var API_KEY = 'AIzaSyAtQULaPG_AsmOKmsWESJEESDuqOPs8IdU'
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Committee Spreadsheet IDS
var sheetIDS = {
    "artsAndCulture": '1mbu-7VK5mqQk2FNKwwk0b5CGbXt1nGaW53rVa4lbvPc',
    "currentEvents": '12a9SZndguVFyRlO8xbAj9vLQ5J45Dmn8DIeEBenVOSY',
    "entertainment": '1CwhXGiTaf8QZHMfSOiBkF2CrqQlPRYPiB0-j-BHADRI',
    "publicity": '1rU7315Nl-fZpTU2YCRcKWUmYUBqlSLMfhFEJ7e8slf8',
    "purdueAfterDark": '1cYa09UftGhaE8ExG9bJnuxwAgalSbY4-t5abFZY1QPQ',
    "spiritAndTraditions": '1r7cxTeWDccKVAp4_cd9BKSnhxqRxQv9goxEYafTPv5I'
}

//All Committee Data
var committees = {
    "artsAndCulture": [],
    "currentEvents": [],
    "entertainment": [],
    "publicity": [],
    "purdueAfterDark": [],
    "spiritAndTraditions": []
};

var committeeList = ["artsAndCulture", "currentEvents", "entertainment", "publicity", "purdueAfterDark", "spiritAndTraditions"];

//All Intercommittee Points
var points = {
    "artsAndCulture": 0,
    "currentEvents": 0,
    "entertainment": 0,
    "publicity": 0,
    "purdueAfterDark": 0,
    "spiritAndTraditions": 0
}

var scripts = {
    "artsAndCulture": "https://script.google.com/macros/s/AKfycbwHZInpf-2XVeATHRFTi2s2KMFh5odvbvGvLYmdVah-Mc0j1ss/exec",
    "currentEvents": "https://script.google.com/macros/s/AKfycbxNNSZ-oIRBXZUm1I6isLwo0LpNQxpI-y6Gur_9-Jmu2Hcwo7E/exec",
    "entertainment": "https://script.google.com/macros/s/AKfycbx5kmyOMiui5joHakz-RDs5AtHYI64I7BBZ_rkLBWVww5RClrw/exec",
    "publicity": "https://script.google.com/macros/s/AKfycbxsLiZpXYRBjCN2Eo5GYvxmv-BDoMu9JcX2CX2LSRldleYlxPM/exec",
    "purdueAfterDark": "https://script.google.com/macros/s/AKfycbwsOqIWytba8oZvq9NaZ1bshNIkKPD2-jwrfOILRVcQVosB0j4/exec",
    "spiritAndTraditions": "https://script.google.com/macros/s/AKfycbyCj7FY0DXRp1T_gTH6mM261puqhUGqIvIXdGo5Yp-FXJ5VUqk/exec"
}

//Current Information
var currentCommittee = "";
var currentName = "";
var currentData = {};
let heights = {};
let dataCount = 0;

function logout(){
    console.log("Logout Attempted");
    localStorage.removeItem("psubPortal");
    window.location.replace("../index.html")
}

function load(){
    //Safety Check
    if(localStorage.getItem("psubPortal") === null){
        window.location.replace("../index.html");
    }
    else{
        // Intercommittee
        heights = {};
        for (var i = 0; i < committeeList.length; i++) {
            data(committeeList[i]);
        }

        // Hour Sheet
        let storageObj = JSON.parse(localStorage.getItem("psubPortal"));
        currentCommittee = storageObj.committee;
        currentName = storageObj.name;
        currentData = storageObj;

        let firstName = currentName.substring(0, currentName.indexOf(" "));
        document.getElementById("navName").innerHTML = `Hi, ${firstName}!`;
        updateHoursSheet(storageObj, storageObj.committee);

        // Handle BOD
        if(firstName === "Director"){
            document.getElementById("hoursNav").remove();
        }
        else{
            document.getElementById("attendanceNav").remove();
        }
    }
}

function calculateHeight() {
    // Dynamic Height
    let maxHeight = 90;
    let tallest = 0;
    let heightValues = Object.values(heights);
    for (let i = 0; i < heightValues.length; i++) {
        if (heightValues[i] - tallest > 0) {
            tallest = heightValues[i];
        }
    }
    if (tallest > maxHeight) {
        // Recalculate heights
        let factor = maxHeight / tallest;
        for (var i = 0; i < committeeList.length; i++) {
            document.getElementById(committeeList[i] + "LI").style = "height: " + heights[committeeList[i]] * factor + "%";
        }
    }
}

function data(committee) {
    console.log('Loading ' + committee + ' data');
    if (committees[committee].length !== 0) {
        committees[committee] = [];
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": 'https://spreadsheets.google.com/feeds/list/' + sheetIDS[committee] + '/1/public/full?alt=json-in-script',
        "method": "GET",
        "headers": {
        }
    }

    $.ajax(settings).done(function (response) {
        //console.log(response);
        response = response.substring(response.indexOf("{"), response.length - 2)
        var response = JSON.parse(response);
        console.log(response);
        for (var i = 0; i < response.feed.entry.length; i++) {
            if (i !== response.feed.entry.length - 1) {
                var tempName = response.feed.entry[i].gsx$name.$t;
                var tempPin = response.feed.entry[i].gsx$pin.$t;
                var tempID = response.feed.entry[i].gsx$sheetid.$t;
                var tempHours = response.feed.entry[i].gsx$hours.$t;
                var tempPoints = response.feed.entry[i].gsx$points.$t;

                committees[committee].push({ name: tempName, pin: tempPin, id: tempID, number: i + 2, hours: tempHours, points: tempPoints });

            }
            else {
                var tempHours = response.feed.entry[i].gsx$committeehours.$t
                var tempPoints = response.feed.entry[i].gsx$committeepoints.$t

                committees[committee].push({ totalHours: tempHours, totalPoints: tempPoints });

                var height = tempPoints;

                points[committee] = tempPoints; //for intercommittee points
                document.getElementById(committee + "LI").style = "height: " + height + "%";
                heights[committee] = height;
                document.getElementById(committee + "LI").title = tempPoints;
                document.getElementById(committee + "TXT").textContent = tempPoints;
            }
        }
        console.log(committees[committee]);

        dataCount++;
        if (dataCount === 6) {
            calculateHeight();
        }
    });
    console.log("Data Loaded Successfully");
}

function updateHoursSheet(data, committee) {
    document.getElementById("tableBody").innerHTML = "";
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": 'https://spreadsheets.google.com/feeds/list/' + sheetIDS[committee] + '/' + data.number + '/public/full?alt=json-in-script',
        "method": "GET",
        "headers": {
            // "id": CLIENT_ID,
            // "secret": API_KEY,
        }
    }

    $.ajax(settings).done(function (response) {
        response = response.substring(response.indexOf("{"), response.length - 2)
        var response = JSON.parse(response);
        console.log(response);

        var totalHours = 0;
        var totalPoints = 0;

        for (var i = 0; i < response.feed.entry.length; i++) {
            var data = response.feed.entry[i];
            if (i == 0) {
                totalHours = data.gsx$hourstotal.$t;
                totalPoints = data.gsx$pointstotal.$t;
            }

            if (data.gsx$hourstotal.$t === "" || i === 0) {
                var date = data.gsx$date.$t;
                var event = data.gsx$event.$t;
                var hours = data.gsx$hours.$t;
                var points = data.gsx$points.$t;

                let args = {
                    "date": date,
                    "event": event,
                    "hours": hours,
                    "points": points
                };

                let tempTR = document.createElement("tr");
                // tempTR.classList = "table-expand-row";
                tempTR.addEventListener("click", function () {
                    removeHours(args);
                })

                let dateTD = document.createElement("td");
                dateTD.innerHTML = date;
                let eventTD = document.createElement("td");
                eventTD.innerHTML = event;
                let hoursTD = document.createElement("td");
                hoursTD.innerHTML = hours;
                let pointsTD = document.createElement("td");
                pointsTD.innerHTML = points;

                tempTR.appendChild(dateTD);
                tempTR.appendChild(eventTD);
                tempTR.appendChild(hoursTD);
                tempTR.appendChild(pointsTD);

                document.getElementById("tableBody").appendChild(tempTR);

            }
        }

        let tempTR = document.createElement("tr");
        tempTR.classList = "table-expand-row-bottom";

        let dateTD = document.createElement("td");
        dateTD.innerHTML = "";
        dateTD.style = "visibility:hidden";
        let eventTD = document.createElement("td");
        eventTD.innerHTML = "";
        eventTD.style = "visibility:hidden";
        let hoursTD = document.createElement("td");
        hoursTD.innerHTML = totalHours;
        hoursTD.style = "font-weight: bold";
        let pointsTD = document.createElement("td");
        pointsTD.innerHTML = totalPoints;
        pointsTD.style = "font-weight: bold";

        tempTR.appendChild(dateTD);
        tempTR.appendChild(eventTD);
        tempTR.appendChild(hoursTD);
        tempTR.appendChild(pointsTD);

        document.getElementById("tableBody").appendChild(tempTR);
    });
    console.log("Member Hours Updated Successfully");
}

// function unsuccessfulLogin(reason) {
//     console.log("Unsuccessful Login");
//     alert("Login Unsuccessful: " + reason)
// }

function addHours() {
    var date = document.getElementById("dateInput").value;
    var event = document.getElementById("eventInput").value;
    var hours = document.getElementById("hoursInput").value;

    if (date === "" || event === "" || hours === "") {
        alert("Please provide values for all event details");
    }
    else {
        var select = document.getElementById("eventType");
        var multiplier = select.options[select.selectedIndex].value;

        var intercommitteeOptions = ["No", "Yes", "Yes"];
        var intercommittee = intercommitteeOptions[multiplier];
        var points = hours * multiplier;

        console.log(scripts[currentCommittee]);

        var settings = {
            "url": scripts[currentCommittee],
            "type": "POST",
            //"dataType": "json",
            "data": {
                "Member": currentName,
                "Date": date,
                "Event": event,
                "Hours": hours,
                "Intercommittee": intercommittee,
                "Points": points
            }
        }

        $.ajax(settings).done(function (response) {
            document.getElementById("dateInput").value = "";
            document.getElementById("eventInput").value = "";
            document.getElementById("hoursInput").value = "";
            document.getElementById("eventType").selectedIndex = 0;

            document.getElementById("confirmMessage").innerHTML = event + " Added Successfully";

            updateHoursSheet(currentData, currentCommittee); //called after POST made successfully
        });
    }
}

function removeHours(rowInfo) {
    let verify = confirm("Are you sure you want to remove " + rowInfo.event + "?");

    if (verify) {
        var settings2 = {
            "url": scripts[currentCommittee],
            "type": "GET", // not actual GET
            "data": {
                "Member": currentName,
                "Date": rowInfo.date,
                "Event": rowInfo.event,
                "Hours": rowInfo.hours,
                // "Intercommittee": intercommittee,
                "Points": rowInfo.points
            }
        }

        $.ajax(settings2).done(function (response) {
            document.getElementById("confirmMessage").innerHTML = rowInfo.event + " Removed Successfully";

            updateHoursSheet(currentData, currentCommittee); //called after GET made successfully
        });
    }
}

