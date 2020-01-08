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

var positionID = '1Fw1q1b4g7BZOsbKChoaWLf2QlETS9cxO15omLKBqUXs';
var positionArray = [];

//All Committee Data
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

var committeeList = ["afterDark", "currentEvents", "entertainment", "publicity", "fineArts", "spiritAndTraditions", "boardofDirectors"/*, "alumni", "inactive"*/];

//All Intercommittee Points
var points = {
    "afterDark": 0,
    "currentEvents": 0,
    "entertainment": 0,
    "fineArts": 0,
    "publicity": 0,
    "spiritAndTraditions": 0,
    "boardofDirectors": 0
}

var scripts = {
    "afterDark": "https://script.google.com/macros/s/AKfycbx24jPoHIZWISV3ZSNg2KMyR2-HaCD_YSYZIgC8/exec",
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
let dataCount = 0;

function load() {
    if(localStorage.getItem("psubPortal") == null){
        console.log("Local Storage Empty");
        for (var i = 0; i < committeeList.length; i++) {
            data(committeeList[i]);
        }
    }
    else{
        console.log("Local Storage Found. Redirecting");
        let name = JSON.parse(localStorage.getItem("psubPortal")).name;
        let committee = JSON.parse(localStorage.getItem("psubPortal")).committee;
        if (currentCommittee.localeCompare("boardofDirectors") != 0) {
            window.location.replace("hours/hours.html");
        }
        else{
            console.log(committee);
            
            if (committee.localeCompare("inactive") == 0 || committee.localeCompare("alumni") == 0) {
                window.location.replace("goalsandinitiatives/goals.html");
            }
            else{
                window.location.replace("hours/hours.html");
            }
        }
    }
    document.getElementsByClassName("body")[0].id = "normalTheme";
    document.getElementById("logo").src="Logo.png"
    loadBOD();
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
    });
    console.log("BOD Data Loaded Successfully");
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
        //console.log(response);
                
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
        //console.log(committees[committee]);
    });
    console.log("Data Loaded Successfully");
}


function committeeChange() {
    $("#memberSelect").empty();
    var select = document.getElementById("committeeSelect");
    var text = select.options[select.selectedIndex].text; //committee Text
    
    console.log("selected: " + text);

    
    text = text.substring(0, 1).toLowerCase() + text.substring(1, text.length);
    text = text.replace(/\s/g, '') //Manipulation Done

    console.log("changed: " + text);

    var optionsAsString = "";

    //console.log(text);
    //console.log(committees[text]);

    for (var i = 0; i < committees[text].length - 1; i++) {
        optionsAsString += "<option value='" + committees[text][i].name + "'>" + committees[text][i].name + "</option>";
    }
    $("#memberSelect").html(optionsAsString);
    console.log("Members Updated");
}

document.getElementById('login-form').onkeydown = function(e){
    // Login on Enter
    if(e.keyCode == 13){
      login();
    }
 };

function login() {
    console.log("Login Attempted");
    var selectedCommittee = document.getElementById("committeeSelect");
    var selectedUser = document.getElementById("memberSelect");

    var committee = selectedCommittee.options[selectedCommittee.selectedIndex].text;
    var user = selectedUser.options[selectedUser.selectedIndex].text;
    console.log(user);

    if (committee === 'Select Your Committee' || user === 'Committee Not Selected') {
        unsuccessfulLogin("Committee and/or Member Information Missing");
    }
    else {        
        committee = committee.substring(0, 1).toLowerCase() + committee.substring(1, committee.length);
        committee = committee.replace(/\s/g, '') //Manipulation Done

        var pinInput = document.getElementById("pinText").value;
        if(pinInput === ''){
            unsuccessfulLogin("PIN is blank.");
            return true;
        }

        // console.log(committee + ", " + user + ", " + pinInput);
        
        for (var i = 0; i < committees[committee].length; i++) {
            if (committees[committee][i].name === user) {
                console.log("name: " + committees[committee][i].name);
                //REMOVE
                if (committees[committee][i].pin === pinInput) {
                    
                    //should be a more efficient way
                    //checks to see if user is a BOD member, if yes
                    //offers option to redirect
                    var found = false;
                    
                    for(var z = 0; z < positionArray.length; z++) {
                        if(user.localeCompare(positionArray[z].person) == 0){
                            let change = confirm("You are now viewing your general member page. Click \"Ok\" to proceed or click \"Cancel\" to view your BOD page.");
                            if(change == true) {
                                successfulLogin(committees[committee][i], committee);
                            }
                            else {
                                successfulLogin(committees[committeeList[6]][z], committeeList[6]);
                            }
                            found = true;
                        }
                    }
                    
                    if(!found){
                        console.log("Successful Login");
                        successfulLogin(committees[committee][i], committee);
                    }
                }
                else {
                    unsuccessfulLogin("Incorrect PIN");
                }
                i = committees[committee].length;
            }
        }
    }


}

function successfulLogin(data, committee) {
    if (committee.localeCompare("boardOfDirectors")) {
        for (var i = 0; i < positionArray.length; i++) {
            console.log("current: " + positionArray[i].position);
            if (positionArray[i].position.localeCompare(data.name) == 0){
                data.name = positionArray[i].person;
                console.log("SAME SAME: " + i);
            }
        }
    }
    
    let storageObj = data;
    storageObj["committee"] = committee;
    localStorage.setItem("psubPortal", JSON.stringify(storageObj));
    //console.log(committee);

    console.log("DATA: " + data.name);
    console.log("DATA: " + data.committee);

    if (committee.localeCompare("inactive") == 0 || committee.localeCompare("alumni") == 0) {
        window.location.replace("goalsandinitiatives/goals.html");
    }
    else{
        window.location.replace("hours/hours.html");
    }
}

function unsuccessfulLogin(reason) {
    console.log("Unsuccessful Login");
    alert("Login Unsuccessful: " + reason)
}

function adjustTheme(){
    /*
    let button = document.getElementById("themeToggle");
    if(button.innerHTML == "Turn Off Theme"){
    */
        document.getElementsByClassName("body")[0].id = "normalTheme";
        button.innerHTML = "Turn On Theme";
        document.getElementsByTagName("canvas")[0].style.display = "none";
        document.getElementById("logo").src="Logo.png"
    /*
    }
    else{
        document.getElementsByClassName("body")[0].id = "particles-js";
        button.innerHTML = "Turn Off Theme";
        document.getElementsByTagName("canvas")[0].style.display = "block";
        document.getElementById("logo").src="Logo-Thanksgiving.png";
    }
    */
}

/*
//   Particles
particlesJS("particles-js", {"particles":{"number":{"value":19,"density":{"enable":true,"value_area":800}},"color":{"value":"#fff"},"shape":{"type":"image","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5},"image":{"src":"https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/146/maple-leaf_1f341.png","width":100,"height":100}},"opacity":{"value":0.5,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":20.042650760819036,"random":true,"anim":{"enable":false,"speed":40,"size_min":1.6241544246026904,"sync":false}},"line_linked":{"enable":false,"distance":500,"color":"#ffffff","opacity":0.4,"width":2},"move":{"enable":true,"speed":3,"direction":"bottom","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":false,"mode":"bubble"},"onclick":{"enable":false,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":4,"duration":0.3,"opacity":1,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true});var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } requestAnimationFrame(update); }; requestAnimationFrame(update);
*/