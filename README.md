# QUIZMASTER
**a simple quiz app made for you to have fun**

### **[QUIZMASTER LIVE](https://quiz-master-lovat.vercel.app/)**

Its not your typical quiz app, it's a fun mini web-based quiz app that uses a predefined json file to fetch questions. It features user game data validation (players name, difficulty level and quiz duration)

## Features
- **Multistep gamedata validation:** Collects data from the user based on how they want the game to flow and the tension of question
- **Instruction Modal:** A modal that gives a preview of all game data and explains the game logic 
- **Realtime scoring and timing system:** The scores get updated based on the users choice and  and there's a countdown timer for quiz
- **Fun Minimalist Quizend Panel:** Subtle minimal animation and quiz analysis
- **Mid performance analysis:** Minor quiz analysis showing the full quiz statistics
- **Option to retake Quiz or start over**

## How To Use
- This project is fully open source and free to use by anyone intrested. all JavaScript functions are open ended and reusable so feel free to grab any snippet yiu see useful, modify it and add to your project aswell
- Simply fork or star the project for later reference

## Built With
- **vanilla JS**
- **HTML**
- **CSS**
- **JSON**
-   No external api's everything built from scratch using js DOM mainpulation. cheers

## Project Structure
```
QUIZMASTER/
│
├── index.html              # Main HTML entry point
├── README.md               # Project documentation
│
├── css/
│   └── styles.css          # Application styles
│
├── js/
│   └── script.js           # Main JavaScript logic
│
└── questions/              # Quiz question data
    ├── easy.json           # Easy difficulty questions
    ├── medium.json         # Medium difficulty questions
    └── hard.json           # Hard difficulty questions
```

## challenges Faced
- Overall it was a kinda smooth process but the only major headache was trying to make sure the options button loaded and didn'tbhave multiple event listeners and crash the entire app
- Another problem faced was trying to make sure the JSON file parsed properly and was assigned to the right set of variables

## Resources
- **CSS Gradient Generator:**
  - [Color Space](https://mycolor.space/gradient)
  - [CSS Gradient](https://cssgradient.io/)
- **Quiz Game Logic:**
  - [Greatstack Youtube (making a simple quiz app)](https://youtu.be/PBcqGxrr9g8?si=HiI06z7eSHCNuYEa) it gave me an idea of how i'll sturctute the quiz logic
  - [Greatstack Youtube(building a stopwatch)](https://youtu.be/cO-qjCC_UYQ?si=YFds-1eoamCaQxJ7) used it as an inspiration to develop the countdown timer of the 


*Built with ❤️ using vanilla web technologies*