var CLIENT_ID = '741003728693-o30686b65lf3np0fd6lbhngfhmv5oqkh.apps.googleusercontent.com'
var API_KEY = 'AIzaSyAtQULaPG_AsmOKmsWESJEESDuqOPs8IdU'
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

var scripts = {
    "artsAndCulture": "https://script.google.com/macros/s/AKfycbwHZInpf-2XVeATHRFTi2s2KMFh5odvbvGvLYmdVah-Mc0j1ss/exec",
    "currentEvents": "https://script.google.com/macros/s/AKfycbxNNSZ-oIRBXZUm1I6isLwo0LpNQxpI-y6Gur_9-Jmu2Hcwo7E/exec",
    "entertainment": "https://script.google.com/macros/s/AKfycbx5kmyOMiui5joHakz-RDs5AtHYI64I7BBZ_rkLBWVww5RClrw/exec",
    "publicity": "https://script.google.com/macros/s/AKfycbxsLiZpXYRBjCN2Eo5GYvxmv-BDoMu9JcX2CX2LSRldleYlxPM/exec",
    "purdueAfterDark": "https://script.google.com/macros/s/AKfycbwsOqIWytba8oZvq9NaZ1bshNIkKPD2-jwrfOILRVcQVosB0j4/exec",
    "spiritAndTraditions": "https://script.google.com/macros/s/AKfycbyCj7FY0DXRp1T_gTH6mM261puqhUGqIvIXdGo5Yp-FXJ5VUqk/exec"
}

var positionArray = [];
var goalsArray = [];
var initiativeArray = [];

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
        loadGoals();

        let storageObj = JSON.parse(localStorage.getItem("psubPortal"));
        currentCommittee = storageObj.committee;
        currentName = storageObj.name;
        let firstName = currentName.substring(0, currentName.indexOf(" "));
        document.getElementById("navName").innerHTML = `Hi, ${firstName}!`;

        // Handle BOD
        //alumni
        if(currentCommittee.localeCompare("alumni") == 0){
            document.getElementById("marketingNav").remove();
            document.getElementById("calendarNav").remove();
        }
        //inactive
        if(currentCommittee.localeCompare("inactive") == 0){
            document.getElementById("marketingNav").remove();
        }
        //general member
        if(currentCommittee.localeCompare("boardofDirectors") != 0){
            document.getElementById("attendanceNav").remove();
        }
        
    }   
}
var request;

function loadGoals() {
        var sheetUrl = 'https://spreadsheets.google.com/feeds/list/1zRa32o2Ji3RTZCtF93QB1VgVGb7Z1nJwLAgh2_O480s/od6/public/values?alt=json';
        $.getJSON(sheetUrl, function(data){
            var entry = data.feed.entry;
      
            console.log(entry);
            for(var x = 0; x < entry.length; x++){
                var selectedPosition = entry[x].title.$t;
                var preEditedGoal = entry[x].gsx$goals.$t;
                
                positionArray.push(selectedPosition);
                goalsArray.push(preEditedGoal);
                
                
                let tempTR = document.createElement("tr");
                tempTR.setAttribute("class", "tableRow");
                let goal = document.createElement("td");
                let position = document.createElement("td");         

                position.innerHTML = selectedPosition;
                
                var goalArray = preEditedGoal.split('.');
                var resultingGoal = "";
                console.log(goalArray);
                for (let i = 0; i < goalArray.length - 1; i++) {
                    let indvgoal = document.createElement("tr");
                    
                    let category = document.createElement("td");
                    let description = document.createElement("td");
                    
                    let indGoalSplit = goalArray[i] + ".";
                    
                    var cat = '<b>Goal';
                    var desc = '<h6>' + indGoalSplit.split('Goal: ')[1];
                    if (indGoalSplit.split('Goal: ').length == 1) {
                        console.log("hello");
                        cat = '';
                        desc = indGoalSplit.split('Initiative: ')[1];   
                    }
                    
                    category.innerHTML = cat;
                    description.innerHTML = desc;
                    
                    indvgoal.append(category);
                    indvgoal.append(description);
                    
                    goal.append(indvgoal);
                }
                
                tempTR.appendChild(position);
                tempTR.appendChild(goal);
                    
                document.getElementById("tableBody").appendChild(tempTR);
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
