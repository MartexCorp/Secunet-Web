/**
 * SuccessfullyyMartex on 6/23/2018.
 */
var bool = true;

function refresh() {
    const otp = $("#otp_section");
    otp.attr('hidden', '');
    //resetRecaptcha();
}

function place_user_data(name, dob, photo, profession) {

    const display_records = $("#records");
    display_records.removeAttr("hidden");

    $('#profile_pic').attr('src', photo);
    $('#name').text(name);
    $("#years_now").text(age_calc(dob));
    $('#profession').text(profession);

    function age_calc(dob) {
        let dob_calc = new Date(dob);
        let today = new Date();
        let age = Math.floor((today - dob_calc) / (365.25 * 24 * 60 * 60 * 1000));
        return age;
    }
}

function user_records(record_object) {
    var list_pres;
    var list_diagnosis;
    $.each(record_object, function (index, val) {
        console.log(val.date + " " + val.hospital + " " + val.diagnostics + " " + val.prescriptions);

        list_diag(val.diagnostics);
        list_prescription(val.prescriptions);
        const template = '<div class="card"><div class="card-body">Date of Consultation: <b>' + val.date + '</b><br>Hospital: <b>' + val.hospital + '</b> <div> <ul> <b>Diagnosis</b>' + list_diagnosis + '</ul> <ul><b>Prescriptions</b>' + list_pres + '</ul></div></div></div>"';

        list_diagnosis = '';
        list_pres = '';
        $('#record_list').append(template);


    });

    function list_diag(diag_string) {
        var diag_split = diag_string.split(",");
        $.each(diag_split, function (index, val) {
            list_diagnosis += '<li style="list-style-type: none">' + val + '</li>'
        })
    }

    function list_prescription(prescription_string) {
        var prescription_item = prescription_string.split(",");
        $.each(prescription_item, function (index, val) {
            list_pres += '<li style="list-style-type: none">' + val + '</li>'
        })
    }

}

function display_write() {
    let write_btn = $("#write_btn");
    write_btn.removeAttr("hidden");
    $(document).ready(function () {
        let write_link = $('#write_link')
        write_link.attr("data-toggle", "tab");
        write_link.attr("href", '#write_consultation');

        //$("a[data-toggle]").removeAttr("data-toggle");
    });
}

function write_pass() {
    let patient_number = $("#number_consult").val();
    let full_date = (new Date).toString().substring(0, 16);
    $("#date_disabled").attr("placeholder", full_date);
    $("#consulting_number_disabled").attr("placeholder", patient_number);
    let write_btn = $("#write_btn");
    write_btn.addClass("btn-default");
    write_btn.attr("disabled", '');
    //showNotification('top','right')
}


function otp_sent_notifier(from, align) {
    $.notify({
        icon: "add_alert",
        message: "OTP code <b>Sent</b> - Check phone to Verify."
    }, {
        type: 'success',
        timer: 3000,
        placement: {
            from: from,
            align: align
        }
    });
}
function otp_sent_error(from, align) {
    $.notify({
        icon: "add_alert",
        message: "OTP code <b>Not Sent</b> - Try Again."
    }, {
        type: 'danger',
        timer: 2000,
        placement: {
            from: from,
            align: align
        }
    });
}
function bad_otp_notifier(from, align) {
    $.notify({
        icon: "add_alert",
        message: "OTP code <b>NOT CORRECT</b> - Refresh Page and Try Again."
    }, {
        type: 'danger',
        timer: 3000,
        placement: {
            from: from,
            align: align
        }
    });
}
function emergency_records_notifier(from, align) {
    $.notify({
        icon: "alert",
        message: "You can now view Patient's Records in <b>Records</b> tab"
    }, {
        type: 'success',
        timer: 3000,
        placement: {
            from: from,
            align: align
        }
    });
}
function write_success_notifier(from, align, tel) {
    $.notify({
        icon: "create",
        message: "Record Successfully written to " + "<b>tel</b>"
    }, {
        type: 'success',
        timer: 4000,
        placement: {
            from: from,
            align: align
        }
    });
}


function commit_record() {
    let date = $('#date_disabled').attr('placeholder');
    let hospital = $('#hospital_disabled').attr('placeholder');
    let telephone = $('#consulting_number_disabled').attr('placeholder');
    let diagnostics = $('#diagnosis_select').val() + ',' + $('#diag').val();
    let prescriptions = $('#pres_select').val() + ',' + $('#pres').val();
    let hash = sha256(date + hospital + telephone + diagnostics + prescriptions);
    console.log(date + hospital + telephone + diagnostics + prescriptions);
    write_data(date, hospital, telephone, diagnostics, prescriptions,hash)
}

function clear_fields() {
    $('#diagnosis_select').val("");
    $('#diag').val("");
    $('#pres_select').val("");
    $('#pres').val("");
}

function reload_page() {
    document.location.reload(true);
}

function emergency_search() {
    let id_num = $('#emergency_id').val();
    search_emergency(id_num);
    $('#e_search_icon').attr("hidden",'');
    $('#e_records_icon').removeAttr("hidden");
}

function place_emergency_data(name, nic, e_numbers, photo,tel) {

    let display_records = $("#emergency_data");
    display_records.removeAttr("hidden");

    $('#e_profile_pic').attr('src', photo);
    $('#e_name').text(name);
    $('#nic').text(nic);
    $('#e_tel').text(tel);
    var num1 = e_numbers.substring(0, 9);
    var num2 = e_numbers.substring(10, 19);
    $("#e_num1").text(num1);
    $('#e_num2').text(num2);
}

function view_emergency_records() {
    e_show_user($('#e_tel').text());
    $('#e_records_icon').removeClass("btn-success").addClass("btn-default");
    emergency_records_notifier('top','right');
    display_write()

}

function create_carnet() {
    let fname = $('#create_fname').val();
    let lname = $('#create_lname').val();
    let dob = $('#create_dob').val();
    let email = $('#create_email').val();
    let enum1 = $('#create_e_num1').val();
    let enum2 = $('#create_e_num2').val();
    let tel = $('#create_tel').val();
    let pass = $('#create_password').val();
    let id = $('#create_id_num').val();
    let prof = $('#create_profession').val()

    create_new_carnet(fname,lname,dob,email,enum1,enum2,tel,pass,id,prof)
}

function generate_pass() {
    let fname = $('#create_fname').val();
    let enum1 = $('#create_e_num1').val();
    let enum2 = $('#create_e_num2').val();
    let pass = fname+enum1.substring(7, 9)+enum2.substring(7, 9);
   $('#create_password').val(pass);


}




