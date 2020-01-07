

var currentCommittee = "";
var currentName = "";
var currentData = {};
var offSet = 5;
var startSchedDate = new Date();
var endSchedDate = new Date();

let allDates = [];
let locationInfo = {};
let locationIndex = 0;

let committeeList = ["artsAndCulture", "currentEvents", "entertainment", "publicity", "purdueAfterDark", "spiritAndTraditions"];
let committeeNames = ["Fine Arts", "Current Events", "Entertainment", "Publicity", "After Dark", "Spirit and Traditions"];

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
        let storageObj = JSON.parse(localStorage.getItem("psubPortal"));
        currentCommittee = storageObj.committee;
        currentName = storageObj.name;
        currentData = storageObj;
        let firstName = currentName.substring(0, currentName.indexOf(" "));
        document.getElementById("navName").innerHTML = `Hi, ${firstName}!`;

        console.log("hello");
        console.log(currentCommittee);
        
        // Handle BOD
        //alumni
        if(currentCommittee.localeCompare("alumni") == 0){
            document.getElementById("marketingNav").remove();
        }
        //inactive
        else if(currentCommittee.localeCompare("inactive") == 0){
            document.getElementById("marketingNav").remove();
        }
        //general member
        if(currentCommittee.localeCompare("boardofDirectors") != 0){
            document.getElementById("attendanceNav").remove();
        }
    }
}



