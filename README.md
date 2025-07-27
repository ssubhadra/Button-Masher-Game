# Button Mashing Game 🎮

A web-based button mashing game built with HTML, JavaScript, and Flask. Test your finger speed and accuracy!

## Features

- **Timer Selection**: Choose between 60, 90, or 120 seconds
- **Key Selection**: Choose to mash A, S, or W key
- **Live Statistics**: Real-time display of total presses, correct presses, and accuracy
- **Final Results**: Comprehensive results including keys per second
- **CSV Data Storage**: Automatically saves results to CSV file via Flask backend
- **Mobile Support**: Works on desktop and mobile devices
- **Beautiful UI**: Modern, responsive design with glassmorphism effects

## Requirements

- Python 3.7+
- Flask 3.0.0
- Modern web browser (Chrome recommended)

## Quick Start

### Option 1: Run with Flask Backend (Recommended)

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Flask server:**
   ```bash
   python app.py
   ```

3. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

### Option 2: Frontend Only (No CSV saving)

If you just want to play the game without saving results:

1. **Open `index.html` directly in your browser**
   - Results will be saved to browser's localStorage instead

## How to Play

1. **Choose your settings:**
   - Select a timer duration (60, 90, or 120 seconds)
   - Choose a key to mash (A, S, or W)

2. **Start the game:**
   - Click "Start Game" button
   - Get ready to mash!

3. **Mash away:**
   - Press your chosen key as fast as possible
   - Watch your live stats update
   - Try to maintain high accuracy!

4. **View results:**
   - See your final score when time runs out
   - Results are automatically saved

## Game Statistics

The game tracks:
- **Total Key Presses**: All A, S, W key presses during the game
- **Correct Presses**: Only presses of your chosen key
- **Accuracy**: Percentage of correct presses
- **Keys Per Second**: Your speed based on correct presses
- **Wrong Presses**: Presses of incorrect keys

## Data Storage

### With Flask Backend
- Results are saved to `data/game_results.csv`
- CSV includes timestamp, duration, key choice, and all statistics
- Access additional endpoints:
  - `/api/results` - View all saved results
  - `/api/stats` - Get aggregated statistics
  - `/api/download-csv` - Download the CSV file

### Frontend Only
- Results saved to browser's localStorage
- Data persists between sessions on the same device

## Mobile Support

- Works on mobile devices with touch keyboards
- Virtual on-screen buttons appear on mobile for easier gameplay
- Responsive design adapts to different screen sizes

## File Structure

```
button-mashing-game/
├── index.html          # Main game HTML file
├── game.js             # Game logic and functionality
├── app.py              # Flask backend server
├── requirements.txt    # Python dependencies
├── README.md           # This file
└── data/               # Created automatically
    └── game_results.csv # Saved game results
```

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Tips for High Scores

1. **Find your rhythm** - Consistent pressing often beats frantic mashing
2. **Stay focused** - Don't let the timer distract you
3. **Choose comfortable keys** - Pick the key that feels most natural
4. **Warm up** - Your first few games might be slower
5. **Mind your accuracy** - A lower press count with high accuracy can be better than many inaccurate presses

## Development

To modify the game:

1. **Frontend changes**: Edit `index.html` and `game.js`
2. **Backend changes**: Edit `app.py`
3. **Styling**: CSS is embedded in `index.html`

The game uses a class-based JavaScript architecture for easy extension and modification.

## Troubleshooting

**Game not responding to keypresses:**
- Make sure the game window has focus
- Try clicking on the game area first
- On mobile, use the virtual buttons that appear

**Flask server not starting:**
- Check that Python and Flask are installed
- Ensure port 5000 is not in use
- Try running with `python3 app.py` if needed

**Results not saving:**
- Check console for error messages
- Ensure Flask server is running for CSV saving
- Frontend-only mode saves to localStorage automatically

## License

This project is open source and available under the MIT License.