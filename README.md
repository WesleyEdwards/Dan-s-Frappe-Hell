<img src="https://github.com/WesleyEdwards/Dan-s-Frappe-Hell/assets/97990557/acf7ba56-df09-4c60-ac1c-96c8b705e60a" alt="image 1" style="width:500px;" />
<img src="https://github.com/WesleyEdwards/Dan-s-Frappe-Hell/assets/97990557/b96472a3-0978-4d5d-97e9-ac4a23914afc" alt="image 1" style="width:500px;" />

# Dan's Frappuccino Hell

## Workspace layout

- This repository contains the Web app for Dan's Frappuccino Hell.
- The chosen name for this project is "Dan's Frappuccino Hell"
- It is called "Dan's Frappuccino Hell" because Dan is the owner, Frappuccino is hard to spell, and the word "Hell" really catches people's attention.
- The Web app can be found in the directory titled "app", and all documentation can be found in the "Documentation" directory.
- All members of the team will be familiar with and work with both the front-end and back-end, but in general, the developers will be split up into two teams- the front-end and back-end teams.

## Version-control procedures

- We use Github for version-control.
- All collaborators should have the project cloned to their respective machines and should regularly make sure their code contains the latest changes from the repository.
- The `.gitignore` file assures that no sensitive information or large files are committed. This file should not be tampered with.
- Each ticket in Jira will have a corresponding git branch. The branch should be named accordingly.
- The git repository is structured so that all branches must be peer-reviewed and have no merge conflicts before merging into the main branch (titled <b>main</b>).

## Tool stack description and setup procedure

- Flask will be used for the backend, written in Python. (https://flask.palletsprojects.com/en/2.2.x/)
- React.js will be used for the frontend, written in TypeScript. (https://reactjs.org/)

## Build instructions

1. Clone this repository by using the following command:
   `$ git clone git@github.com:WesleyEdwards/Dan-s-Frappe-Hell.git`
2. inside the cloned repository, you will see two important directories, titled <b>front-end/</b> and <b>tartarus/</b>.
3. The tartarus directory contains a Flask project that is the backend. navigate into it and install the back end by running `$ install_tartarus.sh` on UNIX or  `$ pip install -e .` on windows.
4. Initialize the database by running `$ flask --app tartarus init-db`
5. start serving it on port 5000 by typing the command
   `$ flask --app tartarus run`.
5. The front-end directory contains a React.js project. navigate into the directory and install necessary node modules with the following command:
   `$ npm install`
6. Start serving it on port 3000 by typing the command:
   `$ npm start`.
7. Open a web-browser and go to `http//:localhost:3000/`. You will be presented with the project.


## Use Instructions
1. To login as a manager, the email is manager@dfh.com, and the password is "password".
2. From there, you can create accounts, users, and test everything on the test environment

## Unit testing instructions

1. Navigate to the `tartarus/` directory and run `install_tartarus.sh`
   - This adds the tartarus directory to the import path for python and is a one time step.
2. Run `pytest` in the same directory

All major functionality of the backend has unit tests in the positive case.
## System testing instructions

- The system can be tested by running both the front-end and the back-end simultaneously and navigating to all possible locations on the web-app.
- By so doing, the big picture or system can be tested for any big issues.


## Sprint documents

Sprint documents can be found in the docs/sprint-3-docs directory.
## Other development notes, as needed
