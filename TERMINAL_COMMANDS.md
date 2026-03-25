# 🖥️ Terminal Commands - Run Frontend & Backend

## Quick Start (Copy & Paste)

### Option 1: Run Frontend Only (Recommended for Testing)

```bash
cd c:\dus-ka-dum && python3 -m http.server 8080
```

Then open browser: `http://localhost:8080/frontend/`

---

### Option 2: Run Frontend + Backend (Full Setup)

**Terminal 1 - Frontend:**
```bash
cd c:\dus-ka-dum && python3 -m http.server 8080
```

**Terminal 2 - Backend (Optional):**
```bash
cd c:\dus-ka-dum && node backend/backend.js
```

Then open browser: `http://localhost:8080/frontend/`

---

## Detailed Instructions

### Step 1: Open Terminal

**Windows:**
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

**Or use VS Code:**
- Press `Ctrl + ~` (backtick)
- Terminal opens at bottom

---

### Step 2: Navigate to Project

```bash
cd c:\dus-ka-dum
```

---

### Step 3: Run Frontend Server

```bash
python3 -m http.server 8080
```

**Expected Output:**
```
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

---

### Step 4: Open Browser

```
http://localhost:8080/frontend/
```

Or click: [http://localhost:8080/frontend/](http://localhost:8080/frontend/)

---

## Alternative Commands

### Using Python 2 (if Python 3 not available)

```bash
cd c:\dus-ka-dum && python -m SimpleHTTPServer 8080
```

---

### Using Node.js (if installed)

```bash
cd c:\dus-ka-dum && npx http-server -p 8080
```

---

### Using PHP (if installed)

```bash
cd c:\dus-ka-dum && php -S localhost:8080
```

---

## Backend Information

### What is the Backend?

The backend (`backend/backend.js`) provides:
- Rule-based model predictions (fallback when Claude API unavailable)
- Model metadata and documentation
- Prediction generation for all 10 models

### When is Backend Used?

- **Automatically** when Claude API is unavailable
- **Fallback mechanism** - game still works without it
- **No separate server needed** - runs in browser via frontend

### Optional: Run Backend Separately

If you want to run backend as separate Node.js server:

```bash
cd c:\dus-ka-dum && node backend/backend.js
```

**Note:** This is optional. The frontend handles everything automatically.

---

## Troubleshooting

### Port 8080 Already in Use

**Find what's using port 8080:**
```bash
netstat -ano | findstr :8080
```

**Kill the process:**
```bash
taskkill /PID <PID> /F
```

**Or use different port:**
```bash
cd c:\dus-ka-dum && python3 -m http.server 8081
```

Then open: `http://localhost:8081/frontend/`

---

### Python Not Found

**Install Python:**
- Download from: https://www.python.org/downloads/
- Check "Add Python to PATH" during installation
- Restart terminal

**Or use Node.js:**
```bash
cd c:\dus-ka-dum && npx http-server -p 8080
```

---

### Cannot Access http://localhost:8080

**Check if server is running:**
- Look for "Serving HTTP" message in terminal
- If not, run the command again

**Try different address:**
```
http://127.0.0.1:8080/frontend/
```

---

## Complete Setup (Step by Step)

### 1. Open Terminal
```
Press: Ctrl + ~ (in VS Code)
Or: Win + R → cmd → Enter
```

### 2. Navigate to Project
```bash
cd c:\dus-ka-dum
```

### 3. Start Frontend Server
```bash
python3 -m http.server 8080
```

### 4. Open Browser
```
http://localhost:8080/frontend/
```

### 5. Fill Profile & Play
- Select age, gender, occupation
- Choose screen time, platforms, posts/day
- Pick primary platform & emotion
- Click "START THE GAME"

### 6. Stop Server (When Done)
```
Press: Ctrl + C (in terminal)
```

---

## Running Multiple Terminals

### In VS Code:

1. Open terminal: `Ctrl + ~`
2. Click `+` icon to open new terminal
3. Run frontend in Terminal 1
4. Run backend in Terminal 2 (optional)

### In Windows:

1. Open first terminal: `Win + R → cmd → Enter`
2. Run frontend: `cd c:\dus-ka-dum && python3 -m http.server 8080`
3. Open second terminal: `Win + R → cmd → Enter`
4. Run backend: `cd c:\dus-ka-dum && node backend/backend.js`

---

## Quick Reference

| Task | Command |
|------|---------|
| **Start Frontend** | `cd c:\dus-ka-dum && python3 -m http.server 8080` |
| **Open Game** | `http://localhost:8080/frontend/` |
| **Stop Server** | `Ctrl + C` |
| **Use Port 8081** | `cd c:\dus-ka-dum && python3 -m http.server 8081` |
| **Check Port Usage** | `netstat -ano \| findstr :8080` |
| **Kill Process** | `taskkill /PID <PID> /F` |

---

## Environment Setup

### Check Python Version
```bash
python3 --version
```

### Check Node.js Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

---

## Full Game Flow

```
1. Terminal: cd c:\dus-ka-dum && python3 -m http.server 8080
   ↓
2. Browser: http://localhost:8080/frontend/
   ↓
3. Fill Profile Form
   ↓
4. Click "START THE GAME"
   ↓
5. Watch AI Play
   ↓
6. See Results
   ↓
7. Click "PLAY AGAIN" to restart
   ↓
8. Terminal: Ctrl + C to stop server
```

---

## Notes

- **Frontend:** Runs on `http://localhost:8080`
- **Backend:** Optional (fallback predictions built-in)
- **AI:** Uses Claude API (or fallback backend)
- **Models:** Loaded from `/models/` directory
- **No Database:** Everything runs in browser

---

## Common Issues & Solutions

### Issue: "Address already in use"
**Solution:** Use different port
```bash
python3 -m http.server 8081
```

### Issue: "Python not found"
**Solution:** Install Python or use Node.js
```bash
npx http-server -p 8080
```

### Issue: "Cannot connect to localhost"
**Solution:** Check server is running, try 127.0.0.1
```
http://127.0.0.1:8080/frontend/
```

### Issue: "Game not loading"
**Solution:** Check browser console (F12) for errors

---

## Performance Tips

- **Close unnecessary programs** to free up resources
- **Use Chrome/Firefox** for best performance
- **Clear browser cache** if having issues: `Ctrl + Shift + Delete`
- **Disable browser extensions** if game is slow

---

## Next Steps

1. Run the terminal command
2. Open the browser
3. Fill your profile
4. Watch AI play
5. Enjoy the game!

---

**Status:** ✅ Ready to Run
**Version:** 2.0 (AI Auto-Play)
**Last Updated:** 2024
