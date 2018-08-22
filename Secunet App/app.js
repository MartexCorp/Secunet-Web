var globalConfirmation;
var telephone;
function consult() {

    const number = $("#number_consult").val();
    telephone = number;
    window.signingIn = true;
    let applicationVerifier = new firebase.auth.RecaptchaVerifier('consult_submit', {
        'size': 'invisible',
        'callback': function (response) {
        }
    });


    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithPhoneNumber(number, applicationVerifier)
        .then((confirmationResult) => {
            // At this point SMS is sent. Ask user for code.
            otp_sent_notifier('top', 'right');
            displayOtpBox_show();
            console.log(" OTP Message sent");
            window.signingIn = false;

            globalConfirmation = confirmationResult;

        }).catch((error) => {
        /// Error; SMS not sent
        otp_sent_error('top', 'right');
        window.signingIn = false;
        //console.error('Error during signInWithPhoneNumber', error);
        //window.alert('Error during signInWithPhoneNumber:\n\n'
        //    + error.code + '\n\n' + error.message);
        //resetRecaptcha();
    });
}


function displayOtpBox_show() {
    const otp = $("#otp_section");
    otp.removeAttr("hidden");
}

function submit_otp() {
    return $("#otp_code").val()
}
function validate() {
    let code = submit_otp();
    if (code) {
        globalConfirmation.confirm(code).then(function () {
            console.log("The code was " + code + " Sign In Success");
            hide_otp_and_show_records();
            display_write();
        }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            bad_otp_notifier('top', 'right');
            console.error('Error while checking the verification code', error);
            window.alert('Error while checking the verification code:\n\n'
                + error.code + '\n\n' + error.message)
        });
    }

}

function hide_otp_and_show_records() {
    const otp = $("#otp_section");
    otp.attr('hidden', '');
    show_user();
}

function show_user() {
    const dbRefRecord = firebase.database().ref().child(telephone);
    dbRefRecord.on('value', function (snap) {
        let childData = snap.val();
        let acct_name = childData.name;
        let acct_dob = childData.dob;
        let acct_photo = childData.photoUrl;
        let profession = childData.profession;
        let record_object = childData.record;

        console.log(acct_name + " " + acct_dob + " " + acct_photo + " " + profession);
        place_user_data(acct_name, acct_dob, acct_photo, profession);
        user_records(record_object);
        //show_records(record_object);

    });
}

function create() {

    const number = $("#number_consult").val();
    telephone = number;
    window.signingIn = true;
    let applicationVerifier = new firebase.auth.RecaptchaVerifier('consult_submit', {
        'size': 'invisible',
        'callback': function (response) {
        }
    });


    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithPhoneNumber(number, applicationVerifier)
        .then((confirmationResult) => {
            // At this point SMS is sent. Ask user for code.
            displayOtpBoxCreate_show();
            console.log(" OTP Message sent");
            window.signingIn = false;

            globalConfirmation = confirmationResult;

        }).catch((error) => {
        /// Error; SMS not sent
        window.signingIn = false;
        console.error('Error during signInWithPhoneNumber', error);
        window.alert('Error during signInWithPhoneNumber:\n\n'
            + error.code + '\n\n' + error.message);
        //resetRecaptcha();
    });
}

function displayOtpBoxCreate_show() {
    const otp = $("#otp_save");
    otp.removeAttr("hidden");
}

function submit_otpsave() {
    return $("#otp_save").val()
}

function validateCreate() {
    let code = submit_otpsave();
    if (code) {
        globalConfirmation.confirm(code).then(function () {
            console.log("The code was " + code + " Sign In Success");
            hide_otp_and_show_form();
        }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            console.error('Error while checking the verification code', error);
            window.alert('Error while checking the verification code:\n\n'
                + error.code + '\n\n' + error.message)
        });
    }

}
function hide_otp_and_show_form() {
    const otp = $("#otp_save_section");
    otp.attr('hidden', '');
}


function write_data(date, hospital, telephone, diagnostics, prescriptions,hash) {

    let dbRefRecord = firebase.database().ref().child(telephone + '/record');
    dbRefRecord.push({
        date: date,
        hash: hash,
        diagnostics: diagnostics,
        hospital: hospital,
        prescriptions: prescriptions
    });
    clear_fields();
    write_success_notifier('top', 'right', telephone);
}

function search_emergency(id_num) {
    var rootRef = firebase.database().ref();
     rootRef.orderByChild('nic').equalTo(id_num).on("value", querySnapshot =>{
     querySnapshot.forEach(childSnapshot =>{
     var tel = childSnapshot.key;
     var NIC = childSnapshot.val().nic;
     var names = childSnapshot.val().name;
     var emergencyNumbers = childSnapshot.val().emergencyNumbers;
     var photo = childSnapshot.val().photoUrl;
     console.log(NIC+" "+names+" "+tel)
         place_emergency_data(names,NIC,emergencyNumbers,photo,tel)
     });
     });
}

function e_show_user(tel) {
    const dbRefRecord = firebase.database().ref().child(tel);
    dbRefRecord.on('value', function (snap) {
        let childData = snap.val();
        let acct_name = childData.name;
        let acct_dob = childData.dob;
        let acct_photo = childData.photoUrl;
        let profession = childData.profession;
        let record_object = childData.record;

        //console.log(acct_name + " " + acct_dob + " " + acct_photo + " " + profession);
        place_user_data(acct_name, acct_dob, acct_photo, profession);
        user_records(record_object);
        //show_records(record_object);

    });
}

function create_new_carnet(fname,lname,dob,email,enum1,enum2,tel,pass,id,prof) {
    let dbRefRecord = firebase.database().ref();
    dbRefRecord.once('value', function(snapshot) {
        if (!snapshot.hasChild(tel)) {
            dbRefRecord.update({tel})
        }
        else {
            alert("That user already exists");
        }

        let user_entry = dbRefRecord.child(tel);
        user_entry.set({
            name: fname+" "+lname,
            dob: dob,
            email: email,
            emergencyNumbers: enum1+";"+enum2,
            password: pass,
            nic: id,
            profession: prof,
            photoUrl: "assets/img/faces/pro_pic.png",
            record: ""

        })
    });
}


