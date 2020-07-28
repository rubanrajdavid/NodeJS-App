var password = document.getElementById("password");
var confirm_password = document.getElementById("confirm_password");


function check_passwords(password, confirm_password) {
    if (password == confirm_password) {
        document.getElementById("submit_btn").disabled = false;
        if (document.getElementById("confirm_password").classList.contains("is-invalid")) {
            document.getElementById("confirm_password").classList.remove("is-invalid")
        }
        if (!document.getElementById("confirm_password").classList.contains("is-valid")) {
            document.getElementById("confirm_password").classList.add("is-valid")
        }

    } else {
        document.getElementById("submit_btn").disabled = true;
        if (document.getElementById("confirm_password").classList.contains("is-valid")) {
            document.getElementById("confirm_password").classList.remove("is-valid")
        }
        if (!document.getElementById("confirm_password").classList.contains("is-invalid")) {
            document.getElementById("confirm_password").classList.add("is-invalid")
        }
    }
}
confirm_password.addEventListener("keyup", function () {
    check_passwords(password.value, confirm_password.value);
    password.addEventListener("keyup", function () {
        check_passwords(password.value, confirm_password.value);
    });
});