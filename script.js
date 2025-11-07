// Quick Settings
const DEMO_DATA = [
    { title: "Grave 1", description: "A spooky grave under the full moon..." },
    { title: "Grave 2", description: "A grave of a forgotten soul." },
    { title: "Grave 3", description: "A grave where no one dares to tread." }
];

// Toggle button state
let usingDemoData = true;
let graves = DEMO_DATA;

// Elements
const graveListEl = document.querySelector('#graveList ul');
const statusMessageEl = document.querySelector('#statusMessage');
const toggleDataButton = document.querySelector('#toggleData');
const refreshButton = document.querySelector('#refreshButton');

// Update Grave List UI
function updateGraveList() {
    graveListEl.innerHTML = '';  // Clear current list

    if (graves.length === 0) {
        showMessage('No graves found!');
    } else {
        graves.forEach(grave => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${grave.title}</strong>: ${grave.description}`;
            graveListEl.appendChild(listItem);
        });
    }
}

// Show status message
function showMessage(message) {
    statusMessageEl.textContent = message;
}

// Toggle demo mode
toggleDataButton.addEventListener('click', function() {
    usingDemoData = !usingDemoData;
    if (usingDemoData) {
        graves = DEMO_DATA;
        toggleDataButton.textContent = 'Switch to Demo Data';
    } else {
        loadUserData();
        toggleDataButton.textContent = 'Switch to User Data';
    }
    updateGraveList();
});

// Load user data from file (manual upload scenario)
function loadUserData() {
    const userData = localStorage.getItem('userGraves');
    if (userData) {
        graves = JSON.parse(userData);
        showMessage('User data loaded.');
    } else {
        showMessage('No user data found.');
    }
}

// Load demo data initially
updateGraveList();
