// Utilities
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const form = $('#registrationForm');
const successModal = $('#successModal');
const preview = $('#preview');
const closeModalBtn = $('#closeModal');
const yearNow = $('#yearNow');
yearNow.textContent = new Date().getFullYear();

// Basic validators
const patterns = {
  phone: /^[6-9]\d{9}$/, // India 10-digit starting 6-9
  rollNo: /^[A-Za-z]{2,5}\d{2}[A-Za-z]?\d{2,4}$/, // Flexible: e.g., CSE23A045 or IT22 1234
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
};

function showError(id, msg){
  const el = $(#err-${id});
  if(el){ el.textContent = msg || ''; }
}

function clearErrors(){
  $$('.error').forEach(e => e.textContent = '');
}

function passwordStrength(pw){
  let score = 0;
  if(pw.length >= 8) score++;
  if(/[A-Z]/.test(pw)) score++;
  if(/[a-z]/.test(pw)) score++;
  if(/\d/.test(pw)) score++;
  if(/[^\w\s]/.test(pw)) score++;
  return score;
}

function renderStrength(pw){
  const el = $('#strength');
  if(!pw){
    el.textContent = 'Use at least 8 characters with a mix of upper/lowercase, numbers, and symbols.';
    el.style.borderColor = 'rgba(255,255,255,0.12)';
    return;
  }
  const score = passwordStrength(pw);
  const labels = ['Very weak','Weak','Okay','Good','Strong','Excellent'];
  el.textContent = Password strength: ${labels[score] || 'Very weak'};
  // Visual hint via border color (no inline colors in CSS vars for simplicity)
  const colors = ['#ff6b6b','#ff8e6e','#f3c969','#a0e86f','#35d07f','#2bb673'];
  el.style.borderColor = colors[Math.min(score, colors.length-1)];
}

// Live strength meter
$('#password').addEventListener('input', (e) => renderStrength(e.target.value));
renderStrength('');

// Gender required check helper
function getGender(){
  const picked = $$('input[name="gender"]:checked');
  return picked.length ? picked[0].value : '';
}

function validate(){
  clearErrors();
  let ok = true;

  const firstName = $('#firstName').value.trim();
  const lastName  = $('#lastName').value.trim();
  const email     = $('#email').value.trim();
  const phone     = $('#phone').value.trim();
  const dob       = $('#dob').value;
  const gender    = getGender();
  const address   = $('#address').value.trim();
  const rollNo    = $('#rollNo').value.trim();
  const department= $('#department').value;
  const year      = $('#year').value;
  const section   = $('#section').value;
  const password  = $('#password').value;
  const confirm   = $('#confirmPassword').value;
  const agree     = $('#agree').checked;

  if(firstName.length < 2){ showError('firstName','Please enter a valid first name.'); ok = false; }
  if(lastName.length  < 2){ showError('lastName','Please enter a valid last name.'); ok = false; }
  if(!patterns.email.test(email)){ showError('email','Enter a valid email address.'); ok = false; }
  if(!patterns.phone.test(phone)){ showError('phone','Enter a valid 10-digit phone (starts 6–9).'); ok = false; }
  if(!dob){ showError('dob','Select your date of birth.'); ok = false; }
  if(!gender){ showError('gender','Please choose a gender.'); ok = false; }
  if(!rollNo || !patterns.rollNo.test(rollNo)){ showError('rollNo','Enter a valid roll number (e.g., CSE23A045).'); ok = false; }
  if(!department){ showError('department','Select a department.'); ok = false; }
  if(!year){ showError('year','Select year of study.'); ok = false; }

  // Password checks
  if(password.length < 8){ showError('password','Password must be at least 8 characters.'); ok = false; }
  if(password !== confirm){ showError('confirmPassword','Passwords do not match.'); ok = false; }

  if(!agree){ showError('agree','You must accept the terms to continue.'); ok = false; }

  const data = {
    firstName, lastName, email, phone, dob, gender,
    address, rollNo, department, year, section
  };

  return { ok, data };
}

// Submit handler
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { ok, data } = validate();
  if(!ok){
    // Focus the first field with an error
    const firstErr = $$('.error').find(el => el.textContent.trim().length);
    if(firstErr){
      const field = firstErr.closest('.field')?.querySelector('input,select,textarea');
      field?.focus();
    }
    return;
  }

  // Simulate persistence (localStorage)
  const key = student:${data.rollNo};
  localStorage.setItem(key, JSON.stringify(data));

  // Show preview
  preview.textContent = JSON.stringify(data, null, 2);
  if(typeof successModal.showModal === 'function'){
    successModal.showModal();
  } else {
    // Fallback for older browsers
    successModal.setAttribute('open','');
  }

  // Optionally reset sensitive fields
  $('#password').value = '';
  $('#confirmPassword').value = '';
});

closeModalBtn.addEventListener('click', () => {
  successModal.close();
});

// Enhance UX: numeric keypad for phone on mobile
$('#phone').setAttribute('inputmode','numeric');
$('#phone').setAttribute('pattern','[0-9]*');
