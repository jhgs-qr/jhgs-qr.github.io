    let namearray = [["Name","Time"]];
let signedin = true;

    function makeApiCall(qr, club) {
        var params = {
            // The ID of the spreadsheet to update.
            spreadsheetId: '1SK2oTjri2krTIZ6XglLbBrv4PqZM-OiGf3f_WovTEZ4',

            // The A1 notation of a range to search for a logical table of data.
            // Values will be appended after the last row of the table.
            range: club.concat('!A1:B1'),

            // How the input data should be interpreted.
            valueInputOption: 'USER_ENTERED',

            // How the input data should be inserted.
            insertDataOption: 'INSERT_ROWS',
        };
        var d = new Date();
        var n = d.toLocaleString();
        var signedin = false;
        var valueRangeBody = {

            "range": club + "!A1:B1",
            "majorDimension": "ROWS",
            "values": [
                [qr, n]
            ]
        };

        var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
        request.then(function (response) {
        }, function (reason) {
            alert('error: ' + reason.result.error.message);
        });
    }

    function initClient() {
        var API_KEY = 'AIzaSyAm02zc16ma4fmsHi-a34Kcze0C9rc19wk';

        var CLIENT_ID = '36530272431-up5uj8q5psvs60fafqaah8cbhdoj99dm.apps.googleusercontent.com';

        var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

        gapi.client.init({
            'apiKey': API_KEY,
            'clientId': CLIENT_ID,
            'scope': SCOPE,
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(function () {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function updateSignInStatus(isSignedIn) {
        if (isSignedIn) {
            document.getElementById("signin-button").style.display = "none";
            document.getElementById("clubLabel").style.display = "initial";
            document.getElementById("clubPicked").style.display = "initial";
            signedin = true;
        } else {
            document.getElementById("signedIn").innerHTML = "Signed out";
            document.getElementById("clubLabel").style.display = "none";
            document.getElementById("clubPicked").style.display = "none";
            document.getElementById("signout-button").style.display = "none";
            signedin = false;
        }
    }

    function handleSignInClick(event) {
        gapi.auth2.getAuthInstance().signIn();
                            document.getElementById("signout-button").style.display = "initial";

    }

    function handleSignOutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
                    document.getElementById("signin-button").style.display = "initial";
    }

    function addData(event) {
        if (signedin == false) {
            alert("Not signed in")
        } else if (document.getElementById("myText").innerHTML == "") {
            alert("No name found")
        } else if (document.getElementById("clubPicked").value == "none") {
            alert("No club selected")
        }else{

            var clubHTML = document.getElementById("clubPicked");
            var club = clubHTML.value;
            var qr = document.getElementById("myText").innerHTML;
            makeApiCall(qr, club);
            var sound = new Howl({
                src: ["correct.wav"]
            }).play();
namearray.push([qr,new Date().toLocaleTimeString()])
            updateTable(namearray)
        }
    }
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    var out = "";
    var scanner = new Instascan.Scanner({video: document.getElementById('preview'), scanPeriod: 5, mirror: false});
    scanner.addListener('scan', function (content) {
        // content = the found qr code
        out = content;
        document.getElementById("myText").innerHTML = out;
        addData();
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
            if (cameras[0] != "") {
                scanner.start(cameras[0]);
            } else {
                alert('No Front camera found!');
            }

        } else {
            console.error('No cameras found.');
            alert('No cameras found.');
        }
    });
   function updateTable(namearray) {
        document.getElementById("table").innerHTML = "";
        function makeTableHTML(myArray) {
            var result = "<table>";
            for (var i = 0; i < myArray.length; i++) {
                result += "<tr>";
                for (var j = 0; j < myArray[i].length; j++) {
                    result += "<td>" + myArray[i][j] + "</td>";
                }
                result += "</tr>";
            }
            result += "</table>";

            return result;
        }

        tablediv = document.getElementById("table")
        var tablecontents = makeTableHTML(namearray);
        tablediv.insertAdjacentHTML('afterbegin', tablecontents);
    }
    updateTable(namearray);

    function clubspickermaker(data) {
        var sel = document.getElementById("clubPicked");
        for(var i = 0; i < clubs.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = clubs[i];
            opt.value = clubs[i];
            sel.appendChild(opt);
        }
    };

    var clubs = "";
    fetch('https://will-harmer.github.io/clubs.txt')
        .then(response => response.text())
        .then((data) => {
            clubs = data;
            clubs = data.split("\n")
        })
        .then((data) => {
            clubspickermaker(data)
        })