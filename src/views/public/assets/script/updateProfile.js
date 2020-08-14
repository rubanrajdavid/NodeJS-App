var password = document.getElementById("newPassword");
var confirmPassword = document.getElementById("confirmPassword");


function check_passwords(password, confirmPassword) {
    if (password == confirmPassword) {
        //document.getElementById("submit_btn").disabled = false;
        if (document.getElementById("confirmPassword").classList.contains("is-invalid")) {
            document.getElementById("confirmPassword").classList.remove("is-invalid")
        }
        if (!document.getElementById("confirmPassword").classList.contains("is-valid")) {
            document.getElementById("confirmPassword").classList.add("is-valid")
        }

    } else {
        //document.getElementById("submit_btn").disabled = true;
        if (document.getElementById("confirmPassword").classList.contains("is-valid")) {
            document.getElementById("confirmPassword").classList.remove("is-valid")
        }
        if (!document.getElementById("confirmPassword").classList.contains("is-invalid")) {
            document.getElementById("confirmPassword").classList.add("is-invalid")
        }
    }
}
function checkPasswordStrength(password) {

}
confirmPassword.addEventListener("keyup", function () {
    check_passwords(newPassword.value, confirmPassword.value);
    newPassword.addEventListener("keyup", function () {
        check_passwords(newPassword.value, confirmPassword.value);
    });
});
