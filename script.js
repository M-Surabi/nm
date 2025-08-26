document.getElementById("regForm").addEventListener("submit", function(event) {
  event.preventDefault();

  let fullname = document.getElementById("fullname").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let password = document.getElementById("password").value;
  let confirm = document.getElementById("confirm").value;
  let msg = document.getElementById("msg");

  // Validate phone number
  if (phone.length !== 10 || isNaN(phone)) {
    msg.textContent = "Phone number must be 10 digits!";
    msg.style.color = "red";
    return;
  }

  // Validate password match
  if (password !== confirm) {
    msg.textContent = "Passwords do not match!";
    msg.style.color = "red";
    return;
  }

  msg.textContent = "Registration Successful!";
  msg.style.color = "green";

  // Reset form
  document.getElementById("regForm").reset();
});
