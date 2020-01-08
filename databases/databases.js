var CLIENT_ID = '769441401372-9llk2flchfa6uusfpqkuer5ai5eahdml.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAsC9gY5zRn5qS_bqTkZBJgsAITmMBpIAQ';

var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
let committeeList = ["artsAndCulture", "currentEvents", "entertainment", "publicity", "purdueAfterDark", "spiritAndTraditions"];

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
        let currentCommittee = storageObj.committee;
        let currentName = storageObj.name;
        let firstName = currentName.substring(0, currentName.indexOf(" "));
        document.getElementById("navName").innerHTML = `Hi, ${firstName}!`;
        
        //updateHoursSheet(storageObj, storageObj.committee);
        
        console.log("loading tables");
        loadData();

        // Handle BOD
        if(firstName === "Director"){
            document.getElementById("hoursNav").remove();

            if(committeeList.indexOf(currentCommittee) === -1){
                document.getElementById("attendanceNav").remove();
            }
        }
        else{
            document.getElementById("attendanceNav").remove();
        }
    }
}

function openTab(members) {
    document.getElementById('txtSearch').value = ""; //resets value to 0
    
    //hides search tabs
    document.getElementById("searchTabAlumni").style.display = "none";
    document.getElementById("searchTabMembers").style.display = "none";
    
    if(members == "members") {
        tab = 'members';
        document.getElementById("membersTab").style.display = "block";
        document.getElementById("alumniTab").style.display = "none";

        document.getElementById("memberNav").classList.add("active");
        document.getElementById("alumniNav").classList.remove("active");
    }
    else{
        tab = 'alumni';
        document.getElementById("membersTab").style.display = "none";
        document.getElementById("alumniTab").style.display = "block";    
        
        document.getElementById("memberNav").classList.remove("active");
        document.getElementById("alumniNav").classList.add("active");
    }    
}

function loadData(){
    //loads member data
    var sheetUrl = 'https://spreadsheets.google.com/feeds/cells/1TemP9aHFbiopXTMlZkx6AxJ-EEcLGlugC0-n9Mw0mC8/1/public/full?alt=json';
    $.getJSON(sheetUrl, function(data){
          let entry = data.feed.entry;
          console.log(entry);
            
            //shared values between members and alumni arrays
            memberNameArray = []; // array of names
            memberClassArray = []; // array of classes
            memberContactArray = []; //array of contact/emails
            
            //values presiding in only members
            memberCommitteeArray = []; // array of commitee
            memberMajorArray = []; // array of majors
            
            //parses for information
            for(var x = 0; x < entry.length; x++){
                if(entry[x].gs$cell.row != 1){
                    if(entry[x].gs$cell.col == 1){
                        memberNameArray.push(entry[x].content.$t);
                    }
                    else if(entry[x].gs$cell.col == 5){
                        memberContactArray.push(entry[x].content.$t);
                    }

                    if(entry[x].gs$cell.col == 2){
                        memberCommitteeArray.push(entry[x].content.$t);
                        }
                        else if(entry[x].gs$cell.col == 3){
                        memberMajorArray.push(entry[x].content.$t);
                        }
                        if(entry[x].gs$cell.col == 4){
                        memberClassArray.push(entry[x].content.$t);
                        }
                }
            }
        
            console.log(memberNameArray)
            
            for(var x = 0; x < memberNameArray.length; x++) {
                    let tempTR = document.createElement("tr");

                        let name = document.createElement("td");
                        name.innerHTML = memberNameArray[x];
                        let committee = document.createElement("td");
                        committee.innerHTML = memberCommitteeArray[x];
                        let major = document.createElement("td");
                        major.innerHTML = memberMajorArray[x];
                        let clss = document.createElement("td");
                        clss.innerHTML = memberClassArray[x];
                        let contact = document.createElement("td");
                        contact.innerHTML = memberContactArray[x];
                
                        tempTR.appendChild(name);
                        tempTR.appendChild(committee);
                        tempTR.appendChild(major);
                        tempTR.appendChild(clss);
                        tempTR.appendChild(contact);

                        document.getElementById("tableBodyMembers").appendChild(tempTR);
                }
        });
        
        //loads alumni data
        sheetUrl = 'https://spreadsheets.google.com/feeds/cells/1TemP9aHFbiopXTMlZkx6AxJ-EEcLGlugC0-n9Mw0mC8/2/public/full?alt=json';
        $.getJSON(sheetUrl, function(data){
          var entry = data.feed.entry;
          console.log(entry);
            
            //shared values between members and alumni arrays
            alumniNameArray = []; // array of names
            alumniClassArray = []; // array of classes
            alumniContactArray = []; //array of contact/emails

            //values presiding in only alumni
            alumniPositionArray = []; //array of positions
            alumniCurrentWork = [];
            
            //parses for information
            for(var x = 0; x < entry.length; x++){
                if(entry[x].gs$cell.row != 1){
                    if(entry[x].gs$cell.col == 1){
                        alumniNameArray.push(entry[x].content.$t);
                    }
                    else if(entry[x].gs$cell.col == 5){
                        alumniContactArray.push(entry[x].content.$t);
                    }

                    if(entry[x].gs$cell.col == 2){
                        alumniClassArray.push(entry[x].content.$t);
                    }
                    else if(entry[x].gs$cell.col == 3){
                    alumniPositionArray.push(entry[x].content.$t);
                    }
                    if(entry[x].gs$cell.col == 4){
                    alumniCurrentWork.push(entry[x].content.$t);
                    }
                }
            }
            
            for(var x = 0; x < alumniNameArray.length; x++) {
                let tempTR = document.createElement("tr");

                    let name = document.createElement("td");
                    name.innerHTML = alumniNameArray[x];
                    let clss = document.createElement("td");
                    clss.innerHTML = alumniClassArray[x];
                    let position = document.createElement("td");
                    position.innerHTML = alumniPositionArray[x];
                    let work = document.createElement("td");
                    work.innerHTML = alumniCurrentWork[x];
                    let contact = document.createElement("td");
                    contact.innerHTML = alumniContactArray[x];

                    tempTR.appendChild(name);
                    tempTR.appendChild(clss);
                    tempTR.appendChild(position);
                    tempTR.appendChild(work);
                    tempTR.appendChild(contact);

                    document.getElementById("tableBodyAlumni").appendChild(tempTR);
            }
        });
        console.log("finished loading table")
}

function search(){ 
    //hides members and alumni tab
    document.getElementById("membersTab").style.display = "none";
    document.getElementById("alumniTab").style.display = "none";

    var input = document.getElementById('txtSearch').value.toLowerCase(); //sets input to lowercase

    //removes previous table searches
    var tables = document.getElementById("searchedTableBodyAlumni");
    while (tables.firstChild) {
        tables.removeChild(tables.firstChild);
    }
    tables = document.getElementById("searchedTableBodyMembers");
    while (tables.firstChild) {
        tables.removeChild(tables.firstChild);
    }
    
    
    //shared arrays for members and for alumni b/c same number of columns
    var searchedNames = [];
    var searchedCommittee = []; //or Class
    var searchedMajor = []; //or Position
    var searchedClass = []; //or Current Work
    var searchedEmail = []; //or Contact Info


    if(tab != 'alumni'){
        document.getElementById("searchTabAlumni").style.display = "none";
        document.getElementById("searchTabMembers").style.display = "block";

        for(var x = 0; x < memberNameArray.length; x++){
            if(memberNameArray[x].toLowerCase().includes(input)){
                searchedNames.push(memberNameArray[x]);
                searchedEmail.push(memberContactArray[x]);
                searchedCommittee.push(memberCommitteeArray[x]);
                searchedMajor.push(memberMajorArray[x]);
                searchedClass.push(memberClassArray[x]);     
            }
        }
    }
    else {        document.getElementById("searchTabAlumni").style.display = "block";
        document.getElementById("searchTabMembers").style.display = "none";

        for(var x = 0; x < alumniNameArray.length; x++){
            if(alumniNameArray[x].toLowerCase().includes(input)){
                searchedNames.push(alumniNameArray[x]);
                searchedCommittee.push(alumniClassArray[x]);
                searchedMajor.push(alumniPositionArray[x]);
                searchedClass.push(alumniCurrentWork[x]);
                searchedEmail.push(alumniContactArray[x]);     
            }
        }
    }
    if(searchedNames.length != 0) {
        for(var x = 0; x < searchedNames.length; x++) {
            let tempTR = document.createElement("tr");

            let name = document.createElement("td");
            name.innerHTML = searchedNames[x];
            let clss = document.createElement("td");
            clss.innerHTML = searchedCommittee[x];
            let position = document.createElement("td");
            position.innerHTML = searchedMajor[x];
            let work = document.createElement("td");
            work.innerHTML = searchedClass[x];
            let contact = document.createElement("td");
            contact.innerHTML = searchedEmail[x];

            tempTR.appendChild(name);
            tempTR.appendChild(clss);
            tempTR.appendChild(position);
            tempTR.appendChild(work);
            tempTR.appendChild(contact);

            if(tab != 'alumni'){
                document.getElementById("searchedTableBodyMembers").appendChild(tempTR);
            }
            else {
               document.getElementById("searchedTableBodyAlumni").appendChild(tempTR);
            }
        }
    }
    else{
        //no entries found
        console.log("no entries");
        let tempTR = document.createElement("tr");

        let name = document.createElement("td");
        name.innerHTML = "No Entry Found";

        tempTR.appendChild(name);
        
        if(tab != 'alumni'){
           document.getElementById("searchedTableBodyMembers").appendChild(tempTR);
        }
        else {
           document.getElementById("searchedTableBodyAlumni").appendChild(tempTR);
        }
    }
}