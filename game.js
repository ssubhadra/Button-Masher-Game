class ButtonMashingGame {
    constructor() {
        this.selectedTime = null;
        this.selectedKey = null;
        this.gameActive = false;
        this.totalPresses = 0;
        this.correctPresses = 0;
        this.timeRemaining = 0;
        this.gameInterval = null;
        this.gameStartTime = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupOptionButtons();
    }
    
    bindEvents() {
        // Setup screen events
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        
        // Global keydown event listener
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Prevent default behavior for game keys to avoid conflicts
        document.addEventListener('keydown', (e) => {
            if (['a', 's', 'w'].includes(e.key.toLowerCase()) && this.gameActive) {
                e.preventDefault();
            }
        });
    }
    
    setupOptionButtons() {
        // Timer selection buttons
        const timerButtons = document.querySelectorAll('.timer-btn');
        timerButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                timerButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedTime = parseInt(btn.dataset.time);
                this.checkStartButtonState();
            });
        });
        
        // Key selection buttons
        const keyButtons = document.querySelectorAll('.key-btn');
        keyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                keyButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedKey = btn.dataset.key;
                this.checkStartButtonState();
            });
        });
    }
    
    checkStartButtonState() {
        const startBtn = document.getElementById('startBtn');
        if (this.selectedTime && this.selectedKey) {
            startBtn.disabled = false;
        } else {
            startBtn.disabled = true;
        }
    }
    
    startGame() {
        if (!this.selectedTime || !this.selectedKey) return;
        
        // Reset game state
        this.totalPresses = 0;
        this.correctPresses = 0;
        this.timeRemaining = this.selectedTime;
        this.gameActive = true;
        this.gameStartTime = Date.now();
        
        // Switch to game screen
        document.getElementById('setupScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        document.getElementById('resultsScreen').style.display = 'none';
        
        // Update display elements
        document.getElementById('keyDisplay').textContent = this.selectedKey.toUpperCase();
        this.updateGameDisplay();
        
        // Start countdown timer
        this.startTimer();
        
        // Focus on the document to ensure key events are captured
        document.body.focus();
    }
    
    startTimer() {
        this.updateTimerDisplay();
        
        this.gameInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('gameTimer');
        timerElement.textContent = this.timeRemaining;
        
        // Add warning style for last 10 seconds
        if (this.timeRemaining <= 10) {
            timerElement.classList.add('warning');
        } else {
            timerElement.classList.remove('warning');
        }
    }
    
    handleKeyPress(event) {
        if (!this.gameActive) return;
        
        const pressedKey = event.key.toLowerCase();
        
        // Only count a, s, w keys
        if (['a', 's', 'w'].includes(pressedKey)) {
            this.totalPresses++;
            
            if (pressedKey === this.selectedKey) {
                this.correctPresses++;
            }
            
            this.updateGameDisplay();
        }
    }
    
    updateGameDisplay() {
        document.getElementById('totalPresses').textContent = this.totalPresses;
        document.getElementById('correctPresses').textContent = this.correctPresses;
        
        const accuracy = this.totalPresses > 0 ? 
            Math.round((this.correctPresses / this.totalPresses) * 100) : 100;
        document.getElementById('liveAccuracy').textContent = accuracy + '%';
    }
    
    endGame() {
        this.gameActive = false;
        clearInterval(this.gameInterval);
        
        // Calculate final stats
        const wrongPresses = this.totalPresses - this.correctPresses;
        const accuracy = this.totalPresses > 0 ? 
            Math.round((this.correctPresses / this.totalPresses) * 100) : 100;
        const kps = (this.correctPresses / this.selectedTime).toFixed(1);
        
        // Update results screen
        document.getElementById('finalTime').textContent = this.selectedTime + ' seconds';
        document.getElementById('finalTotal').textContent = this.totalPresses;
        document.getElementById('finalCorrect').textContent = this.correctPresses;
        document.getElementById('finalWrong').textContent = wrongPresses;
        document.getElementById('finalKPS').textContent = kps;
        document.getElementById('finalAccuracy').textContent = accuracy + '%';
        
        // Switch to results screen
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'block';
        
        // Save results to CSV
        this.saveResults({
            timestamp: new Date().toISOString(),
            duration: this.selectedTime,
            selectedKey: this.selectedKey.toUpperCase(),
            totalPresses: this.totalPresses,
            correctPresses: this.correctPresses,
            wrongPresses: wrongPresses,
            accuracy: accuracy,
            keysPerSecond: parseFloat(kps)
        });
    }
    
    async saveResults(gameData) {
        try {
            const response = await fetch('/api/save-result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData)
            });
            
            if (!response.ok) {
                console.warn('Failed to save results to server');
                // Fallback: save to localStorage
                this.saveToLocalStorage(gameData);
            }
        } catch (error) {
            console.warn('Error saving to server, using localStorage:', error);
            this.saveToLocalStorage(gameData);
        }
    }
    
    saveToLocalStorage(gameData) {
        const existingResults = JSON.parse(localStorage.getItem('buttonMashResults') || '[]');
        existingResults.push(gameData);
        localStorage.setItem('buttonMashResults', JSON.stringify(existingResults));
    }
    
    resetGame() {
        // Clear selections
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.selectedTime = null;
        this.selectedKey = null;
        this.gameActive = false;
        this.totalPresses = 0;
        this.correctPresses = 0;
        
        // Clear timer
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        
        // Reset start button
        document.getElementById('startBtn').disabled = true;
        
        // Switch back to setup screen
        document.getElementById('setupScreen').style.display = 'block';
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'none';
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ButtonMashingGame();
});

// Additional mobile keyboard support
if ('ontouchstart' in window) {
    // For mobile devices, add virtual keyboard buttons
    document.addEventListener('DOMContentLoaded', () => {
        const gameScreen = document.getElementById('gameScreen');
        
        // Create mobile controls
        const mobileControls = document.createElement('div');
        mobileControls.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: none;
            gap: 10px;
            z-index: 1000;
        `;
        mobileControls.id = 'mobileControls';
        
        ['A', 'S', 'W'].forEach(key => {
            const btn = document.createElement('button');
            btn.textContent = key;
            btn.style.cssText = `
                width: 60px;
                height: 60px;
                font-size: 24px;
                font-weight: bold;
                background: rgba(255, 255, 255, 0.3);
                border: 2px solid rgba(255, 255, 255, 0.5);
                border-radius: 10px;
                color: white;
                margin: 0 5px;
            `;
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                // Simulate keypress
                const keyEvent = new KeyboardEvent('keydown', {
                    key: key.toLowerCase(),
                    code: 'Key' + key,
                    which: key.charCodeAt(0),
                    keyCode: key.charCodeAt(0)
                });
                document.dispatchEvent(keyEvent);
            });
            
            mobileControls.appendChild(btn);
        });
        
        document.body.appendChild(mobileControls);
        
        // Show mobile controls during game
        const originalStartGame = ButtonMashingGame.prototype.startGame;
        ButtonMashingGame.prototype.startGame = function() {
            originalStartGame.call(this);
            if ('ontouchstart' in window) {
                document.getElementById('mobileControls').style.display = 'flex';
            }
        };
        
        const originalEndGame = ButtonMashingGame.prototype.endGame;
        ButtonMashingGame.prototype.endGame = function() {
            originalEndGame.call(this);
            if ('ontouchstart' in window) {
                document.getElementById('mobileControls').style.display = 'none';
            }
        };
    });
}