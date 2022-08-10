# trackr

A simple job tracking application that eventually will allow user to automate their job searching processes

## Technologies Used

Main stack:

- PostgreSQL (pg)
- Express
- React
- Node

Additional library:

- Typescript
- React Router v6
- Material UI
- JSONWebToken
- Axios

## Approach

## Installation

## User stories

- User can register, login, and logout
- User can view the list of their existing job applications in 2 modes: kanban board and table view, add a new application, edit their existing application, and delete their applications
- User can update the status of their application by moving the cards in the kanban board
- User should be able to add scheduled interview, remove interviews, and add more details to their interviews
- User should be able to see suggested actions based on the status of their application

## Design

### Database

![er_diagram](readmefiles/er_diagram.png)

### APIs

| Method | Address                  | Description                                                 | Input | Output |
| ------ | ------------------------ | ----------------------------------------------------------- | ----- | ------ |
| POST   | /sessions/login          | User login                                                  |       |        |
| DELETE | /sessions/logout         | User logout                                                 |       |        |
| PUT    | /users/register          | User registration                                           |       |        |
| POST   | /jobs/job                | Get the list of user's job application                      |       |        |
| PUT    | /jobs/job                | Create a new job application                                |       |        |
| PATCH  | /jobs/job                | Edit a job application                                      |       |        |
| DELETE | /jobs/job                | User registration                                           |       |        |
| PATCH  | /jobs/status             | Edit the status of job application (used for kanban board)  |       |        |
| POST   | /jobs/oneJob             | Get the user's job application detail by jobId              |       |        |
| PUT    | /interviews/interview    | Add an interview                                            |       |        |
| PATCH  | /interviews/interview    | Edit an interview                                           |       |        |
| DELETE | /interviews/interview    | Delete an interview                                         |       |        |
| POST   | /interviews/interview    | Get all interviews                                          |       |        |
| POST   | /interviews/oneInterview | Get all interviews based on the jobId provided in the input |       |        |

### Front-end

![wireframe 1](readmefiles/wireframe_1.jpg)
![wireframe 2](readmefiles/wireframe_2.jpg)
![wireframe 3](readmefiles/wireframe_3.jpg)

## Snippets from the app

## Unsolved Problems and Further Development

- Integration with gmail for login
- Email parsing to automate interview scheduling
- Create a job sprint
- Toggle between dark and light mode

## Major Hurdles

- Typescript
- Lack of planning for the front-end components
