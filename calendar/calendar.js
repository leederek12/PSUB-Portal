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
let heights = {};
let dataCount = 0;
const EVENTS_SHEET_ID = '1py0YY2fFxSNHxGVZcq4deaQspIDGOeyFU5R8_S9TK1s';
var eventsData = []
//time zone offset to be changed
var offSet = 4;

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

            if(committeeList.indexOf(currentCommittee) === -1){
                document.getElementById("attendanceNav").remove();
            }
        }
        else{
            document.getElementById("attendanceNav").remove();
        }
    

        // Intercommittee
        heights = {};
        for (var i = 0; i < committeeList.length; i++) {
            data(committeeList[i]);
        }

        //calendar
        getCalendarValues();
    }
    String.prototype.format = function() {
        a = this;
        for (k in arguments) {
          a = a.replace("{" + k + "}", arguments[k])
        }
        return a
      }
}

function pad0(i) {
    return pad(i,2,0);

}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getCalendarValues(){
    var calendarEl = document.getElementById('calendar');
    document.getElementById("topSpinner").style.visibility = "visible";


    //fetch events

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": 'https://spreadsheets.google.com/feeds/list/'+EVENTS_SHEET_ID+'/1/public/full?alt=json-in-script',
        "method": "GET",
        "headers": {
        }
    }

    $.ajax(settings).done(function (response) {
        //console.log('resp',response);
        response = response.substring(response.indexOf("{"), response.length - 2)
        var response = JSON.parse(response);
        //console.log(response);
        for (var i = 0; i < response.feed.entry.length; i++) {
            //console.log(response.feed.entry[i]);
            var eventDate = response.feed.entry[i].gsx$date.$t;
            var eventTimeStart =  response.feed.entry[i].gsx$time.$t;
            if(eventDate!=''){
                eventDates = eventDate.split('-')
                var eventDateStart = (eventDate.split('-').length==1)?eventDate:eventDate.split('-')[0];
                var eventDateEnd = (eventDate.split('-').length==1)?eventDate:eventDate.split('-')[1]
                if(eventTimeStart.replace(/[^0-9]/g,"").length > 5){
                    var eventTimeEnd = eventTimeStart.substring(eventTimeStart.indexOf('- ') + 2)
                    eventTimeStart = eventTimeStart.substring(0,eventTimeStart.indexOf(' - '));
                    eventTimeEnd = eventTimeEnd.substring(eventTimeEnd.length-2)=='pm'?
                                        (eventTimeEnd.split(':')[0]=='12')?'00:00'
                                            :pad0((parseInt((eventTimeEnd.split(':')[0]))+12)) + ':'
                                                +eventTimeEnd.split(':')[1].substring(0,eventTimeEnd.split(':')[1].length-2)
                                                    :pad(eventTimeEnd.substring(0,eventTimeEnd.length-2),5,0); //assuming start and end on everything
                    eventTimeStart = eventTimeStart.substring(eventTimeStart.length-2)=='pm'?
                                        (eventTimeStart.split(':')[0]=='12')?'00:00'
                                            :pad0(parseInt((eventTimeStart.split(':')[0]))+12) + ':'
                                                +eventTimeStart.split(':')[1].substring(0,eventTimeStart.split(':')[1].length-2)
                                                    :pad(eventTimeStart.substring(0,eventTimeStart.length-2),5,0); //assuming start and end on everything
                    
                    eventTimeStart += ':00'
                    eventTimeEnd += ':00'
                    
                    var tomorrow = false;
                    var tomorrowDate = new Date();
                    tomorrowDate.setDate(eventDateEnd.split('/')[1])
                    tomorrowDate.setFullYear(eventDateEnd.split('/')[2])
                    tomorrowDate.setMonth(eventDateEnd.split('/')[0]-1)                

                    var endDateObject = new Date();
                    endDateObject.setHours(eventTimeEnd.split(":")[0]);
                    var startDateObject = new Date();
                    startDateObject.setHours(eventTimeStart.split(":")[0]);
                    if(eventTimeEnd=="12:00:00" && endDateObject.getTime() < startDateObject.getTime()){
                        tomorrow = true;
                        eventTimeEnd="00:00:00"
                        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                    }

                    eventDateStart = eventDateStart.split('/')[2]+'-'+pad0(eventDateStart.split('/')[0])+'-'+pad0(eventDateStart.split('/')[1]);
                    eventDateEnd = (tomorrow)?dateFormatDate(tomorrowDate):eventDateEnd.split('/')[2]+'-'+pad0(eventDateEnd.split('/')[0])+'-'+pad0(eventDateEnd.split('/')[1]);
                    var startTime = eventDateStart+'T'+eventTimeStart;
                    var endTime = eventDateEnd+'T'+eventTimeEnd;
                    var eventResources = []
                }else{
                    startTime = eventDateStart.split('/')[2]+'-'+pad0(eventDateStart.split('/')[0])+'-'+pad0(eventDateStart.split('/')[1]);
                    eventDateStart = startTime
                    eventDateEnd = ''
                    eventTimeStart = ''
                    eventTimeEnd = ''
                    endTime = ''
                    var eventResources = []
                }
            }

            eventResources.push({
                id: 'location',
                title: response.feed.entry[i].gsx$place.$t,
                rLocation: response.feed.entry[i].gsx$rainlocation.$t
            },{
                id: 'date',
                dateStart: eventDateStart,
                dateEnd: eventDateEnd,
                timeStart: eventTimeStart,
                timeEnd: eventTimeEnd,
            })
            eventsData.push({
                title: response.feed.entry[i].gsx$event.$t,
                timeZone: 'local',
                start: startTime,
                end: endTime,
                resources: eventResources
                //rendering: 'background',
            })
        }

        

        console.log(eventsData);

        var calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: [ 'dayGrid', 'bootstrap' ],
            events: eventsData,
            themeSystem: 'bootstrap',
            defaultView: 'dayGridMonth',
            handleWindowResize: false,
            fixedWeekCount: false,
            eventLimit: 2,
            contentHeight: 'auto',
            eventClick: eventClickHandler,
            
        });
        calendar.render();
        document.getElementById("topSpinner").style.visibility = "hidden";        
    });
    
}

function data(committee) {
    console.log('Loading ' + committee + ' data');
    document.getElementById("topSpinner").style.visibility = "visible";
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
    document.getElementById("topSpinner").style.visibility = "hidden";

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

function dateFormat(d){
    return dateFormatDate(d) + " " + dateFormatTime(d);
}

function dateFormatDate(d){
    return d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2)
}

function dateFormatTime(d){
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
}

function eventClickHandler(info) {
    console.log(info);
    eventName = info.event.title;
    start = info.event.start;
    end = info.event.end;
    eventLocation = info.event.extendedProps.resources[0].title;
    document.getElementById("modalHeader").innerHTML = ""
    document.getElementById("modalBody").innerHTML = ""
    
    var eventCard = document.createElement("div");
    eventCard.setAttribute("class","card");
    
    var eventCardBody = document.createElement("div");
    eventCardBody.setAttribute("class","card-body");
    eventCard.appendChild(eventCardBody)
    
    var eventCardTitle = document.createElement("div");
    eventCardTitle.setAttribute("class","card-title");
    eventCardTitle.append(eventLocation + ', Rain location: ' + info.event.extendedProps.resources[0].rLocation)
    eventCardBody.appendChild(eventCardTitle)
    
    var eventCardText = document.createElement("div");
    eventCardText.setAttribute("class","card-text");
    eventCardText.append(dateFormat(start) + (end!=null? " - " + dateFormat(end):''))
    eventCardBody.appendChild(eventCardText);

   document.getElementById("modalHeader").append(eventName)
    document.getElementById("modalBody").appendChild(eventCard)//year month date and military time
    $('#myModal').modal('show');

    tomorrowDate = new Date()
    tomorrowDate.setMonth(start.getMonth())
    tomorrowDate.setFullYear(start.getFullYear())
    tomorrowDate.setDate(start.getDate()+1)

    console.log(tomorrowDate)

    addToGoogle(eventName, 
            info.event.extendedProps.resources[1].dateStart, 
            (end==null)?'00:00:00':info.event.extendedProps.resources[1].timeStart, 
            (end==null)?dateFormatDate(tomorrowDate):info.event.extendedProps.resources[1].dateEnd, 
            (end==null)?'00:00:00':info.event.extendedProps.resources[1].timeEnd, 
        eventLocation);
}

function addToGoogle(name, dateStart, startTime, dateEnd, endTime, location){
    //console.log(date, startTime, endTime, locationInfo[dateIndex].location);
    let dateBeginStr = dateStart.split("-")[0] + dateStart.split("-")[1] + dateStart.split("-")[2];
    let dateEndStr = dateEnd.split("-")[0] + dateEnd.split("-")[1] + dateEnd.split("-")[2];
    //console.log(parseInt(startTime.split(":")[0])+5);
    let timeBeginStr = pad0(parseInt(startTime.split(":")[0])+offSet)+ startTime.split(":")[1] + startTime.split(":")[2];
    let timeEndStr = pad0(parseInt(endTime.split(":")[0])+offSet) + endTime.split(":")[1] + endTime.split(":")[2];
    let dateTime = dateBeginStr + 'T' + timeBeginStr +'Z/' +dateEndStr + 'T' + timeEndStr +'Z'
    let locationDesc = 'Location is ' + location;
    //let name = 'PSUB Marketing';


    let link = 
        'https://www.google.com/calendar/render?action=TEMPLATE&text=' + name +'&dates=' +dateTime 
        // +'&location=' + 'Purdue Memorial Union, 101 Grant St, West Lafayette, IN 47906, USA' 
        + '&location=' + location
        +'&sprop=name:Name&sprop=website:'+ 'https://glass10.github.io/calendar/calendar.html' 
        + '&details='+ locationDesc
        //document.getElementById("modalBody").appendChild('<div id="add to cal">Google</div>')
        //document.getElementById("modalBody").innerHTML = 
        //    '<a target="_blank" href="' + link + '">Add to google</a>';
    //window.open(link);
    var href = encodeURI(
        'data:text/calendar;charset=utf8,' + [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          'URL:' + 'https://glass10.github.io/marketing/marketing.html',
          'DTSTART:' + ((dateBeginStr + 'T' + timeBeginStr +'Z') || ''),
          'DTEND:' + ((dateEndStr + 'T' + timeEndStr +'Z') || ''),
          'SUMMARY:' + (name || ''),
          'DESCRIPTION:' + (locationDesc || ''),
          'LOCATION:' + (location || ''),
          'END:VEVENT',
          'END:VCALENDAR'].join('\n'));
    document.getElementById("iCal").setAttribute('onclick', 'location.href=\'' + href + '\'');
    document.getElementById("google").setAttribute('onclick', 'location.href=\'' + link + '\'');
}

