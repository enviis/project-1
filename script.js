// ============================================
// HAUNTED GRAVEYARD - SCRIPT.JS
// A spooky grave collecting game
// ============================================

// ============================================
// QUICK SETTINGS - Customize the game here!
// ============================================
const CONFIG = {
    APP_NAME: "Haunted Graveyard",
    TOTAL_GRAVES: 13,                    // Total number of graves to collect
    SCARE_CHANCE: 0.3,                   // 30% chance of jump scare (0.0 to 1.0)
    GRAVE_UNLOCK_INTERVAL: 5000,         // Time between new graves appearing (milliseconds)
    SEARCH_DURATION: 2000,               // How long searching takes (milliseconds)
    JUMP_SCARE_DURATION: 1500,           // How long jump scare lasts (milliseconds)
    STORAGE_KEY: "scaryGraveyard.progress" // localStorage key for saving progress
};

// ============================================
// GRAVE DATA - Customize tombstone messages!
// ============================================
const DEMO_GRAVES = [
    { 
        id: 1, 
        name: "Sarah Grimwood", 
        epitaph: "Here lies Sarah, cold and dead. Beware who walks where angels dread.", 
        year: 1847 
    },
    { 
        id: 2, 
        name: "Thomas Blackwell", 
        epitaph: "I'll be watching... always watching.", 
        year: 1889 
    },
    { 
        id: 3, 
        name: "Emily Darkmore", 
        epitaph: "She screamed, but no one came.", 
        year: 1902 
    },
    { 
        id: 4, 
        name: "Unknown Child", 
        epitaph: "Too young to die, too dead to cry.", 
        year: 1856 
    },
    { 
        id: 5, 
        name: "Victor Shadowend", 
        epitaph: "Death is not the end... it's just the beginning.", 
        year: 1923 
    },
    { 
        id: 6, 
        name: "Margaret Hollows", 
        epitaph: "Listen closely, I'm still here.", 
        year: 1871 
    },
    { 
        id: 7, 
        name: "The Twins", 
        epitaph: "Together in life, together in death, together forever.", 
        year: 1895 
    },
    { 
        id: 8, 
        name: "Reverend Graves", 
        epitaph: "He blessed the living, now he haunts the dead.", 
        year: 1912 
    },
    { 
        id: 9, 
        name: "Catherine Nightshade", 
        epitaph: "Beauty fades, but my curse remains.", 
        year: 1834 
    },
    { 
        id: 10, 
        name: "Benjamin Wraith", 
        epitaph: "I warned them, but they didn't listen.", 
        year: 1888 
    },
    { 
        id: 11, 
        name: "Abigail Mortem", 
        epitaph: "The last thing I saw still watches me.", 
        year: 1903 
    },
    { 
        id: 12, 
        name: "The Undertaker", 
        epitaph: "I buried many... now I am buried.", 
        year: 1899 
    },
    { 
        id: 13, 
        name: "YOUR NAME", 
        epitaph: "Coming soon...", 
        year: 2025 
    }
];

// ============================================
// GAME STATE
// ============================================
let gameState = {
    gameStarted: false,
    soundEnabled: true,
    collectedGraves: [],
    unlockedGraves: [DEMO_GRAVES[0]], // Start with first grave unlocked
    currentGrave: null,
    isSearching: false,
    unlockInterval: null
};

// ============================================
// DOM ELEMENTS - Cache all element references
// ============================================
const elements = {
    // Screens
    welcomeScreen: document.getElementById('welcomeScreen'),
    gameScreen: document.getElementById('gameScreen'),
    jumpScareOverlay: document.getElementById('jumpScareOverlay'),
    winScreen: document.getElementById('winScreen'),
    
    // Buttons
    startGameBtn: document.getElementById('startGameBtn'),
    searchBtn: document.getElementById('searchBtn'),
    collectBtn: document.getElementById('collectBtn'),
    resetBtn: document.getElementById('resetBtn'),
    winResetBtn: document.getElementById('winResetBtn'),
    soundToggle: document.getElementById('soundToggle'),
    
    // Display elements
    progressCount: document.getElementById('progressCount'),
    progressBar: document.getElementById('progressBar'),
    statusMessage: document.getElementById('statusMessage'),
    unlockedCount: document.getElementById('unlockedCount'),
    currentGraveCard: document.getElementById('currentGraveCard'),
    graveName: document.getElementById('graveName'),
    graveEpitaph: document.getElementById('graveEpitaph'),
    graveYear: document.getElementById('graveYear'),
    collectedList: document.getElementById('collectedList'),
    soundIcon: document.getElementById('soundIcon')
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    // Load saved progress from localStorage
    loadProgress();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update display
    updateDisplay();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    elements.startGameBtn.addEventListener('click', startGame);
    elements.searchBtn.addEventListener('click', searchForGrave);
    elements.collectBtn.addEventListener('click', collectCurrentGrave);
    elements.resetBtn.addEventListener('click', resetGame);
    elements.winResetBtn.addEventListener('click', resetGame);
    elements.soundToggle.addEventListener('click', toggleSound);
}

// ============================================
// GAME FLOW FUNCTIONS
// ============================================

/**
 * Start the game
 */
function startGame() {
    gameState.gameStarted = true;
    
    // Hide welcome screen, show game screen
    elements.welcomeScreen.classList.add('hidden');
    elements.gameScreen.classList.remove('hidden');
    
    // Start unlocking graves over time
    startGraveUnlocking();
    
    // Show welcome message
    showMessage("Welcome to the haunted graveyard... if you dare.");
    
    // Play ambient sound (placeholder)
    playSound('ambient');
}

/**
 * Search for a grave in the graveyard
 */
function searchForGrave() {
    // Prevent multiple searches at once
    if (gameState.isSearching) return;
    
    gameState.isSearching = true;
    elements.searchBtn.disabled = true;
    elements.searchBtn.textContent = 'Searching...';
    
    showMessage("Searching through the fog...");
    playSound('searching');
    
    // Simulate search time
    setTimeout(() => {
        // Random chance of jump scare
        if (Math.random() < CONFIG.SCARE_CHANCE) {
            triggerJumpScare();
        } else {
            findGrave();
        }
        
        // Re-enable search button
        gameState.isSearching = false;
        elements.searchBtn.disabled = false;
        elements.searchBtn.textContent = 'Search for Graves';
    }, CONFIG.SEARCH_DURATION);
}

/**
 * Trigger a jump scare
 */
function triggerJumpScare() {
    // Show jump scare overlay
    elements.jumpScareOverlay.classList.remove('hidden');
    
    showMessage("SOMETHING'S WATCHING YOU!");
    playSound('scream');
    
    // Hide jump scare after duration
    setTimeout(() => {
        elements.jumpScareOverlay.classList.add('hidden');
        showMessage("You were too scared to find anything...");
    }, CONFIG.JUMP_SCARE_DURATION);
}

/**
 * Find a grave
 */
function findGrave() {
    // Get graves that are unlocked but not yet collected
    const availableGraves = gameState.unlockedGraves.filter(
        grave => !gameState.collectedGraves.find(c => c.id === grave.id)
    );
    
    // Check if any graves available
    if (availableGraves.length === 0) {
        showMessage("All available graves have been found... for now.");
        return;
    }
    
    // Pick a random available grave
    const randomIndex = Math.floor(Math.random() * availableGraves.length);
    const foundGrave = availableGraves[randomIndex];
    
    // Set as current grave
    gameState.currentGrave = foundGrave;
    
    // Display the grave
    displayCurrentGrave(foundGrave);
    
    showMessage(`You discovered the grave of ${foundGrave.name}!`);
    playSound('discover');
}

/**
 * Display the currently found grave
 */
function displayCurrentGrave(grave) {
    elements.graveName.textContent = grave.name;
    elements.graveEpitaph.textContent = `"${grave.epitaph}"`;
    elements.graveYear.textContent = `† ${grave.year} †`;
    
    // Show the grave card
    elements.currentGraveCard.classList.remove('hidden');
}

/**
 * Collect the current grave
 */
function collectCurrentGrave() {
    if (!gameState.currentGrave) return;
    
    // Add to collected graves
    gameState.collectedGraves.push(gameState.currentGrave);
    
    // Update display
    updateDisplay();
    
    // Show collection message
    const collectedCount = gameState.collectedGraves.length;
    showMessage(`Collected! ${collectedCount}/${CONFIG.TOTAL_GRAVES} graves found.`);
    playSound('collect');
    
    // Hide current grave card
    elements.currentGraveCard.classList.add('hidden');
    gameState.currentGrave = null;
    
    // Save progress
    saveProgress();
    
    // Check if all graves collected
    if (collectedCount === CONFIG.TOTAL_GRAVES) {
        showWinScreen();
    }
}

/**
 * Start unlocking graves over time
 */
function startGraveUnlocking() {
    // Clear any existing interval
    if (gameState.unlockInterval) {
        clearInterval(gameState.unlockInterval);
    }
    
    // Unlock a new grave every interval
    gameState.unlockInterval = setInterval(() => {
        const nextIndex = gameState.unlockedGraves.length;
        
        // Check if there are more graves to unlock
        if (nextIndex < DEMO_GRAVES.length) {
            gameState.unlockedGraves.push(DEMO_GRAVES[nextIndex]);
            updateUnlockedCount();
            saveProgress();
        } else {
            // All graves unlocked, stop interval
            clearInterval(gameState.unlockInterval);
        }
    }, CONFIG.GRAVE_UNLOCK_INTERVAL);
}

/**
 * Reset the game
 */
function resetGame() {
    // Confirm reset
    if (!confirm("Reset all progress? This cannot be undone!")) {
        return;
    }
    
    // Clear interval
    if (gameState.unlockInterval) {
        clearInterval(gameState.unlockInterval);
    }
    
    // Reset game state
    gameState = {
        gameStarted: false,
        soundEnabled: gameState.soundEnabled, // Keep sound preference
        collectedGraves: [],
        unlockedGraves: [DEMO_GRAVES[0]],
        currentGrave: null,
        isSearching: false,
        unlockInterval: null
    };
    
    // Clear localStorage
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    
    // Reset display
    elements.gameScreen.classList.add('hidden');
    elements.welcomeScreen.classList.remove('hidden');
    elements.winScreen.classList.add('hidden');
    elements.currentGraveCard.classList.add('hidden');
    
    updateDisplay();
}

/**
 * Show win screen when all graves collected
 */
function showWinScreen() {
    elements.winScreen.classList.remove('hidden');
    playSound('victory');
    
    // Stop unlocking graves
    if (gameState.unlockInterval) {
        clearInterval(gameState.unlockInterval);
    }
}

// ============================================
// DISPLAY UPDATE FUNCTIONS
// ============================================

/**
 * Update all display elements
 */
function updateDisplay() {
    updateProgressBar();
    updateCollectedList();
    updateUnlockedCount();
}

/**
 * Update progress bar
 */
function updateProgressBar() {
    const count = gameState.collectedGraves.length;
    const percentage = (count / CONFIG.TOTAL_GRAVES) * 100;
    
    elements.progressCount.textContent = `${count} / ${CONFIG.TOTAL_GRAVES}`;
    elements.progressBar.style.width = `${percentage}%`;
    elements.progressBar.setAttribute('aria-valuenow', percentage);
}

/**
 * Update the list of collected graves
 */
function updateCollectedList() {
    // Clear current list
    elements.collectedList.innerHTML = '';
    
    // Check if no graves collected
    if (gameState.collectedGraves.length === 0) {
        elements.collectedList.innerHTML = '<p class="empty-state">No graves collected yet...</p>';
        return;
    }
    
    // Create grave items
    gameState.collectedGraves.forEach(grave => {
        const graveItem = createGraveItem(grave);
        elements.collectedList.appendChild(graveItem);
    });
}

/**
 * Create a grave item element
 */
function createGraveItem(grave) {
    const item = document.createElement('div');
    item.className = 'grave-item';
    
    item.innerHTML = `
        <div class="grave-item-icon">💀</div>
        <div class="grave-item-content">
            <div class="grave-item-name">${grave.name}</div>
            <div class="grave-item-epitaph">"${grave.epitaph}"</div>
            <div class="grave-item-year">† ${grave.year}</div>
        </div>
    `;
    
    return item;
}

/**
 * Update unlocked graves count
 */
function updateUnlockedCount() {
    const count = gameState.unlockedGraves.length;
    const plural = count === 1 ? 'grave has' : 'graves have';
    elements.unlockedCount.textContent = `${count} ${plural} been revealed by the mist...`;
}

/**
 * Show a status message
 */
function showMessage(text) {
    elements.statusMessage.textContent = text;
    elements.statusMessage.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.statusMessage.classList.add('hidden');
    }, 5000);
}

// ============================================
// SOUND FUNCTIONS
// ============================================

/**
 * Toggle sound on/off
 */
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    elements.soundIcon.textContent = gameState.soundEnabled ? '🔊' : '🔇';
}

/**
 * Play a sound (placeholder function)
 * In a real implementation, you would play actual audio files here
 */
function playSound(type) {
    if (!gameState.soundEnabled) return;
    
    // Placeholder - in real app, play actual sound files
    console.log(`Playing sound: ${type}`);
    
    // Example of how you might implement this:
    // const audio = new Audio(`sounds/${type}.mp3`);
    // audio.play().catch(err => console.log('Audio play failed:', err));
}

// ============================================
// STORAGE FUNCTIONS
// ============================================

/**
 * Save progress to localStorage
 */
function saveProgress() {
    try {
        const data = {
            collected: gameState.collectedGraves,
            unlocked: gameState.unlockedGraves
        };
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
}

/**
 * Load progress from localStorage
 */
function loadProgress() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        
        if (saved) {
            const data = JSON.parse(saved);
            gameState.collectedGraves = data.collected || [];
            gameState.unlockedGraves = data.unlocked || [DEMO_GRAVES[0]];
        }
    } catch (error) {
        console.error('Failed to load progress:', error);
    }
}

// ============================================
// START THE APP
// ============================================
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
