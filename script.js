// ===== GRAB ELEMENTS =====
const homeView     = document.getElementById('home-view');
const registerView = document.getElementById('register-view');
const browseView   = document.getElementById('browse-view');

const btnRegister  = document.getElementById('btn-register');
const btnBrowse    = document.getElementById('btn-browse');
const btnBackReg   = document.getElementById('btn-back-register');
const btnBackBrowse= document.getElementById('btn-back-browse');

const farmerForm   = document.getElementById('farmer-form');
const registerMsg  = document.getElementById('register-message');

// ===== HELPER: show one view, hide the others =====
function showView(viewToShow) {
  [homeView, registerView, browseView].forEach(v => v.classList.add('hidden'));
  viewToShow.classList.remove('hidden');
  window.scrollTo(0, 0); // scroll to top when switching
}

// ===== BUTTON ACTIONS =====
btnRegister.addEventListener('click', () => showView(registerView));
btnBrowse.addEventListener('click',   () => showView(browseView));
btnBackReg.addEventListener('click',  () => showView(homeView));
btnBackBrowse.addEventListener('click',() => showView(homeView));

// ===== FORM SUBMISSION =====
farmerForm.addEventListener('submit', (e) => {
  e.preventDefault(); // stop page reload

  const name     = document.getElementById('farmer-name').value.trim();
  const phone    = document.getElementById('farmer-phone').value.trim();
  const location = document.getElementById('farmer-location').value.trim();
  const birdType = document.getElementById('farmer-birdtype').value;

  // Basic validation
  if (!name || !phone || !location) {
    registerMsg.textContent = '⚠️ Please fill in all fields.';
    registerMsg.style.color = '#c62828';
    return;
  }

  // Temporary success message (real saving comes in Step 5)
  registerMsg.textContent = `✅ Thanks ${name}! You registered to sell ${birdType} in ${location}.`;
  registerMsg.style.color = '#2e7d32';

  // Clear the form
  farmerForm.reset();
});
