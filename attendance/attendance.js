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
var membersArray = [];

function logout(){
    console.log("Logout Attempted");
    localStorage.removeItem("psubPortal");
    window.location.replace("../index.html");
}

function load(){
    //Safety Check
    if(localStorage.getItem("psubPortal") === null){
        window.location.replace("../index.html");
    }
    else{
        let storageObj = JSON.parse(localStorage.getItem("psubPortal"));
        currentCommittee = storageObj.committee;
        currentName = storageObj.name;
        let firstName = currentName.substring(0, currentName.indexOf(" "));
        document.getElementById("navName").innerHTML = `Hi, ${firstName}!`;

        // Handle BOD
        if(firstName === "Director"){
            document.getElementById("hoursNav").remove();
            console.log(currentCommittee);
            loadMembers();
        }
        else{
            document.getElementById("attendanceNav").remove();
            window.location.replace("../hours/hours.html");
        }
    

        // Intercommittee
        heights = {};
        for (var i = 0; i < committeeList.length; i++) {
            data(committeeList[i]);
        }
    }   
}
var request;

function loadMembers() {
    var committeeListed = ["artsAndCulture", "currentEvents", "entertainment", "publicity", "purdueAfterDark", "spiritAndTraditions"];
        var committee = 0;
        
        // Set index of sheet for currentCommittee
        committee = committeeListed.indexOf(currentCommittee)+1;
        
        
        var sheetUrl = 'https://spreadsheets.google.com/feeds/cells/1e43-KJ4R893szo_TzP4_TGv75bhec-spoTiZK_yfCS4/' + committee + '/public/full?alt=json';
        $.getJSON(sheetUrl, function(data){
            var entry = data.feed.entry;
      
            // Get Member Names
            for(var x = 0; x < entry.length; x++){
                if(entry[x].gs$cell.row === "3" && entry[x].gs$cell.col !== "1"){
                    membersArray.push(entry[x].content.$t);
                }
            }
            
            var attendanceValues = ["Present", "Excused", "Unexcused"]
            
            // Create table entries for each member (with dropdown)
            for(var x = 0; x < membersArray.length; x++) {
                let tempTR = document.createElement("tr");
                tempTR.setAttribute("class", "tableRow");

                let members = document.createElement("td");
                members.innerHTML = membersArray[x];
            
                let attendance = document.createElement("td");
            
                let selectAttendance = document.createElement("select");
                selectAttendance.id = membersArray[x] + "dropdown";
                selectAttendance.setAttribute("class", "form-control dropdown")
                
                for(var y = 0; y < attendanceValues.length; y++) {
                    var option = document.createElement("option");
                    option.value = attendanceValues[y];
                    option.text = attendanceValues[y];
                    selectAttendance.appendChild(option);
                }

                attendance.appendChild(selectAttendance);
                tempTR.appendChild(members);
                tempTR.appendChild(attendance);

                document.getElementById("tableBody").appendChild(tempTR);
            }
        });
}

function submitAttendance(){
    let dataObj = {};
    dataObj["committee"] = currentCommittee;

    let today = new Date();
    today = "" + (today.getMonth()+1) + "-" + ('0' + today.getDate()).slice(-2) + "-" + today.getFullYear();
    dataObj["Date"] = today;
    
    for(x = 0; x < membersArray.length; x++){
        var str = membersArray[x] + "dropdown";
        var val = document.getElementById(str).value;
        dataObj[membersArray[x]] = val;
    }
    // console.log(dataObj);
    
    var settings = {
        "url": "https://script.google.com/macros/s/AKfycbzmNXk4Y74JAk3Ozt8GgrUnn0rjV_wz1_Wrrm_AjA/exec",
        "type": "POST",
        "data": dataObj
    }

    $.ajax(settings).done(function (response) {
       if(response.result === "success"){
        alert("Attendance recorded for " + today);

        // Reset Dropdowns
        for(x = 0; x < membersArray.length; x++){
            var str = membersArray[x] + "dropdown";
            document.getElementById(str).selectedIndex = 0;
        }   
       }
       else{
        alert("Error recording attendance");
       }
    });
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
