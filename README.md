# Math Quiz

A small mental-math game in plain HTML, CSS and JavaScript (no frameworks, no build step).

**Live demo:** https://khameer13.github.io/Quiz_game-Math-/

## How it works

- 15 random 3-digit addition and subtraction questions per round
- +1 for a correct answer, −2 for a wrong one (max score 15)
- Live score, progress bar and timer while you play
- Instant feedback after each answer, showing the correct result when you miss
- Results screen with score, accuracy, time taken and a review of every answer
- Personal best (score, then fastest time) saved in your browser
- Press Enter to submit; works on mobile with a numeric keypad; follows light/dark mode

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Start, quiz and results screens |
| `styles.css` | Layout and theme (light and dark) |
| `app.js` | Question generation, scoring, timer and best-score storage |
