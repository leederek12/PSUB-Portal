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

var committees = {
    "afterDark": [],
    "currentEvents": [],
    "entertainment": [],
    "fineArts": [],
    "publicity": [],
    "spiritAndTraditions": [],
    "boardofDirectors": [],
    "alumni": [],
    "inactive": [],
};

var committeeList = ["afterDark", "currentEvents", "entertainment", "publicity", "fineArts", "spiritAndTraditions", "boardofDirectors", "alumni", "inactive"];


function logout(){
    console.log("Logout Attempted");
    localStorage.removeItem("psubPortal");
    window.location.replace("../index.html");
}

function load(){
    for (var i = 0; i < committeeList.length; i++) {
        data(committeeList[i]);
    }
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
    console.log("finished loading data");
    console.log(committees);
}

var request;

function loadData(){
    var foundLength = -1;
    console.log(currentCommittee);
    
    for (var x = 0; x < committeeList.length; x++) {
        var formattedCommittee = committeeList[x];
        formattedCommittee = formattedCommittee.substring(0, 1).toLowerCase() + formattedCommittee.substring(1, formattedCommittee.length);
        formattedCommittee = formattedCommittee.replace(/\s/g, '') //Manipulation Done
                
        if(currentCommittee.localeCompare(formattedCommittee) == 0){
            console.log("SAME:" + x);
            
            console.log(committees[committeeList[x]]);
            for (var i = 0; i < committees[committeeList[x]].length; i++) {
                if(currentName.localeCompare(committees[committeeList[x]][i].name) == 0){
                    console.log("HELLO:" + i);
                    document.getElementById("hours").innerHTML = committees[committeeList[x]][i].hours + " hr(s)";
                    document.getElementById("points").innerHTML = committees[committeeList[x]][i].points + " pt(s)";
                    break;
                }
            }
            
            break;
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
        }
        console.log(committees[committee]);
        loadData();
    });
    console.log("Data Loaded Successfully");
}
