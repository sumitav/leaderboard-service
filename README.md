# Project README

## Leaderboard Service

Welcome to the project! This README file will provide you with all the necessary information to get started.
The problem statement for this project is to develop a leaderboard service that allows users to track and display top K rankings based on certain criteria. The application will likely involve features such as adding/registering leaderboard, updating scores, and displaying the leaderboard in a user-friendly format.

## Table of Contents
- [Introduction](#introduction)
- [API](#api)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction
In this project, we aim to create a user-friendly and intuitive design for the Leaderboard Service application. Our goal is following:
- **Receive Scores:** Handle scores published by the game service (from a topic or flat file).
- **Store Scores:** Use a database to keep track of these scores.
- **Return Top Scores:** Provide a service that retrieves the top 5 scores and the players' names with those scores.

## API

### POST /api/leaderboard/createBoard
Purpose: Admins can create and register a board of size k
Request Body: JSON object with boardID and leaderBoardSize
Response: Status 201 Created with a message "Leaderboard created successfully" & Status 400 for any bad_request and 500 for any failures

### GET /api/leaderboard/getTopScorers
Purpose: Retrieves the top N scores(JSON), N is fixed while leaderboard registration
Response: Status 200 Fetched with a list of top scorers & Status 400 for any bad_request when the leaderboard is not init/registered and 500 for any failures

### POST /api/game/updateScore
Purpose: Posts a new score for a player_id/user_name
Request Body: JSON object with player_id and score
Response: Status 201 Created and 400 for BAD_REQUEST

### GET /api/health
Purpose: Check if the service and database is up/down
Response: Status 200 Fetched with a status "UP" and 500 with Health Check Failed status "DOWN"

## Installation
To install the Leaderboard Service application, follow these steps:
1. Clone the repository: `git clone https://github.com/your-username/leaderboard-service.git`
2. Install the required dependencies: `npm install`
3. Build the project: `npm run build`
4. Or: `npm run start:dev`

## Usage
To use the Leaderboard Service application, follow these steps:
1. Start the application: `npm run start`
2. Open your web browser and navigate to `http://localhost:3000`
3. Explore the various APIs and functionalities of the application
4. Testing : To ensure the quality of the code, run the tests using the following commands:`npm run test` or `npm run test:cov `

The coverage report can be found in the coverage/lcov-report/index.html file.

## Contributing
We welcome contributions from the community! If you'd like to contribute to the project, please follow these guidelines:
1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m "Add your commit message"`
4. Push your changes to your forked repository: `git push origin feature/your-feature-name`
5. Open a pull request to the main repository

## License
This project is licensed under the [MIT License](LICENSE).
