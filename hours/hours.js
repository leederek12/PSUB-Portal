var CLIENT_ID = '741003728693-o30686b65lf3np0fd6lbhngfhmv5oqkh.apps.googleusercontent.com'
var API_KEY = 'AIzaSyAtQULaPG_AsmOKmsWESJEESDuqOPs8IdU'
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Committee Spreadsheet IDS
var sheetIDS = {
    "afterDark": '1cEy-qHpHlP-PzhK_DAc52CCetp7eMuSySXrmgU8cG1U',
    "currentEvents": '1kRw5iikX74fwatg8zooitmNW6xMGbsZvVqKHr6mPxnc',
    "entertainment": '1MxtSSUmbhFyEP305ShrrIjvtZb8iTDz21Nmt9EWnJu4',
    "fineArts": '1pOqGyj3G0a-55HphaA87zKGGFG5vMGS7McfkjGa9TLU',
    "publicity": '1bIN6fJqJv1nlRoIc85GQkHa4NTJBqhsKyKKauQ9xsqI',
    "spiritAndTraditions": '1SzMuiuWEO-O0vweLPDi7z6efvi0u_d9eY08l5GuToAY', 
    "boardofDirectors": '1qbhzwZuGyq7iwM6RhdtBaJGvXnlZBij-A0bu0EqN3y4',
    "alumni": '11aaTwDKrrWNE7wAm_keE1g_ZI1NKn-S-WDLrdOfCKD0',
    "inactive": '1eJUkTyu0-3QIZf3nJWQ5t8pGg0Hs3pR4KNDRybgZkw4'
}

//All Committee Data
var committees = {
    "fineArts": [],
    "currentEvents": [],
    "entertainment": [],
    "publicity": [],
    "afterDark": [],
    "spiritAndTraditions": []
};

var committeeList = ["afterDark", "currentEvents", "entertainment", "publicity", "fineArts", "spiritAndTraditions", "boardofDirectors", "alumni", "inactive"];

//All Intercommittee Points
var points = {
    "fineArts": 0,
    "currentEvents": 0,
    "entertainment": 0,
    "publicity": 0,
    "afterDark": 0,
    "spiritAndTraditions": 0
}

var scripts = {
    "fineArts": "https://script.google.com/macros/s/AKfycby7cPB-Xog6aXM4U7zBsQxtLGXsG8SOtRkuMhfOGg/exec",
    "currentEvents": "https://script.google.com/macros/s/AKfycbytsq24BPvQDRetgTETcsZsErVM49uRb4CYJMznxw/exec",
    "entertainment": "https://script.google.com/macros/s/AKfycbz2CtJnyyvrG2iOL9kTMBTfMkn2k0W09wMUC-u_Jw/exec",
    "publicity": "https://script.google.com/macros/s/AKfycbxqDxJCW9kvaeljvpWi6hg3TD9rtGAYUS46DW3gIBn2ymF_94g/exec",
    "afterDark": "https://script.google.com/macros/s/AKfycbx24jPoHIZWISV3ZSNg2KMyR2-HaCD_YSYZIgC8/exec",
    "spiritAndTraditions": "https://script.google.com/macros/s/AKfycbydul38GMepC4HTyekwy8HX3TMhOd8diWZk_uNq/exec"
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
        for (var i = 0; i < 6; i++) {
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
        console.log(currentCommittee);
        //alumni
        if (currentCommittee.localeCompare("alumni") == 0 || currentCommittee.localeCompare("inactive") == 0) {
            document.getElementById("attendanceNav").remove();
            document.getElementById("marketingNav").remove();
            document.getElementById("hoursButton").remove();
            document.getElementById("hours-form").remove();
            document.getElementById("intercommitteeSection").remove();
            document.getElementById("collapseThree").remove();
        }
        //general member
        else if (currentCommittee.localeCompare("boardofDirectors") != 0) {
            document.getElementById("attendanceNav").remove();
        }
        
        if (currentCommittee.localeCompare("alumni") == 0) {
            document.getElementById("calendarNav").remove();
        }
        
        loadPrizePyramid();
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
    
    changeInformation();
}

function changeInformation(){
    //if BOD change information
    if (currentCommittee.localeCompare("boardofDirectors")) {
        
    }
}

function updateHoursSheet(data, committee) {
    document.getElementById("tableBody").innerHTML = "";
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": 'https://spreadsheets.google.com/feeds/list/' + sheetIDS[committee] + '/' + (data.number) + '/public/full?alt=json-in-script',
        "method": "GET",
        "headers": {
            // "id": CLIENT_ID,
            // "secret": API_KEY,
        }
    }

    $.ajax(settings).done(function (response) {
        response = response.substring(response.indexOf("{"), response.length - 2)
        var response = JSON.parse(response);
        console.log("got hours");
        
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
            
            console.log("worked");
        });
    }
}

function loadPrizePyramid(){
    var sheetUrl = 'https://spreadsheets.google.com/feeds/list/18fVEawTCLWxTiLGkGdNxJBUZRFtCBHGBmW1lNhl8NMg/od6/public/values?alt=json';
        $.getJSON(sheetUrl, function(data){
            var entry = data.feed.entry;
      
            console.log("yuh");
            console.log(entry);
            for(var x = 0; x < entry.length; x++){
                var pointValue = entry[x].title.$t;
                var prizeValue = entry[x].gsx$prize.$t;
                
                
                let tempTR = document.createElement("tr");
                tempTR.setAttribute("class", "tableRow");
                let points = document.createElement("td");
                let prize = document.createElement("td");  
                
                points.innerHTML = pointValue;
                prize.innerHTML = prizeValue;

                tempTR.append(points);
                tempTR.append(prize);
                
                document.getElementById("tableBodyPrize").appendChild(tempTR);
            }
        });
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

