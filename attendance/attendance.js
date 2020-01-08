var CLIENT_ID = '741003728693-o30686b65lf3np0fd6lbhngfhmv5oqkh.apps.googleusercontent.com'
var API_KEY = 'AIzaSyAtQULaPG_AsmOKmsWESJEESDuqOPs8IdU'
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Committee Spreadsheet IDS
var sheetIDS = {
    "afterDark": '1cYa09UftGhaE8ExG9bJnuxwAgalSbY4-t5abFZY1QPQ',
    "currentEvents": '12a9SZndguVFyRlO8xbAj9vLQ5J45Dmn8DIeEBenVOSY',
    "entertainment": '1CwhXGiTaf8QZHMfSOiBkF2CrqQlPRYPiB0-j-BHADRI',
    "fineArts": '1mbu-7VK5mqQk2FNKwwk0b5CGbXt1nGaW53rVa4lbvPc',
    "publicity": '1rU7315Nl-fZpTU2YCRcKWUmYUBqlSLMfhFEJ7e8slf8',
    "spiritAndTraditions": '1r7cxTeWDccKVAp4_cd9BKSnhxqRxQv9goxEYafTPv5I'
}

//All Committee Data
var committees = {
    "afterDark": [],
    "currentEvents": [],
    "entertainment": [],
    "fineArts": [],
    "publicity": [],
    "spiritAndTraditions": []
};

var positionID = '1Fw1q1b4g7BZOsbKChoaWLf2QlETS9cxO15omLKBqUXs';
var positionArray = [];

var committeeList = ["afterDark", "currentEvents", "entertainment", "fineArts", "afterDark", "spiritAndTraditions"];

//All Intercommittee Points
var points = {
    "afterDark": 0,
    "currentEvents": 0,
    "entertainment": 0,
    "fineArts": 0,
    "publicity": 0,
    "spiritAndTraditions": 0
}

var scripts = {
    "afterDark": "https://script.google.com/macros/s/AKfycbwsOqIWytba8oZvq9NaZ1bshNIkKPD2-jwrfOILRVcQVosB0j4/exec",
    "currentEvents": "https://script.google.com/macros/s/AKfycbxNNSZ-oIRBXZUm1I6isLwo0LpNQxpI-y6Gur_9-Jmu2Hcwo7E/exec",
    "entertainment": "https://script.google.com/macros/s/AKfycbx5kmyOMiui5joHakz-RDs5AtHYI64I7BBZ_rkLBWVww5RClrw/exec",
    "fineArts": "https://script.google.com/macros/s/AKfycbwHZInpf-2XVeATHRFTi2s2KMFh5odvbvGvLYmdVah-Mc0j1ss/exec",
    "publicity": "https://script.google.com/macros/s/AKfycbxsLiZpXYRBjCN2Eo5GYvxmv-BDoMu9JcX2CX2LSRldleYlxPM/exec",
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
        if(currentCommittee.localeCompare("boardofDirectors") != 0){
            window.location.replace("../hours/hours.html");
        }
    

        // Intercommittee
        heights = {};
        for (var i = 0; i < committeeList.length; i++) {
            data(committeeList[i]);
        }
    } 
    loadBOD();
}
var request;

function loadMembers() {
    var committeeListed = ["afterDark", "currentEvents", "entertainment", "fineArts", "publicity", "spiritAndTraditions"];
        var committee = 0;
            
        // Set index of sheet for currentCommittee
        committee = committeeListed.indexOf(currentCommittee)+1;
    
        console.log(currentCommittee);
        console.log(currentName);
        console.log("HELLO: " + committee);
        
        console.log(positionArray.length);
    
        for(var x = 4; x < positionArray.length; x++){
            console.log(positionArray[x].person);
            if(positionArray[x].person.localeCompare(currentName) == 0){
                console.log("Found Person: " + (x - 3));
                committee = x - 3;
                break;
            }
        }
            
        var sheetUrl = 'https://spreadsheets.google.com/feeds/cells/1W_IO7aYZ_V1v2GAVbMZRbdH0jacuLjoRzjvBsHzWvK4/' + committee + '/public/full?alt=json';
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

function loadBOD() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": 'https://spreadsheets.google.com/feeds/list/1Fw1q1b4g7BZOsbKChoaWLf2QlETS9cxO15omLKBqUXs/1/public/full?alt=json-in-script',
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
                var tempPosition = response.feed.entry[i].gsx$position.$t;
                var tempPerson = response.feed.entry[i].gsx$person.$t;
                var tempCommittee = response.feed.entry[i].gsx$previouscommittee.$t;

                positionArray.push({ position: tempPosition, person: tempPerson, previousCommittee: tempCommittee });

            }
        }
        console.log(positionArray);
        loadMembers();
    });
    console.log("BOD Data Loaded Successfully");
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
