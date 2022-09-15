# Dan's Frappuccino Hell

## Workspace layout

- This repository contains the Web app for Dan's Frappuccino Hell.\
- The chosen name for this project is "Dan's Frappuccino Hell"
- It is called "Dan's Frappuccino Hell" because Dan is the owner, Frappuccino is hard to spell, and the word "Hell" really catches people's attention.
- The Web app can be found in the directory titled "app", and all documentation can be found in the "Documentation" directory.
- All members of the team will be familiar with and work with both the front-end and back-end, but in general, the developers will be split up into two teams- the front-end and back-end teams.

## Version-control procedures

- We use Github for version-control.\
- All collaborators should have the project cloned to their respective machines and should regularly make sure their code contains the latest changes from the repository.\
- The `.gitignore` file assures that no sensitive information or large files are committed. This file should not be tampered with.
- Each ticket in Jira will have a corresponding git branch. The branch should be named accordingly.
- The git repository is structured so that all branches must be peer-reviewed and have no merge conflicts before merging into the main branch (titled <b>main</b>).

## Tool stack description and setup procedure

- Django will be used for the backend, written in Python.\
- React.js will be used for the frontend, written in TypeScript.

## Build instructions

1. Clone this repository by using the following command:\
`$ git clone git@github.com:WesleyEdwards/Dan-s-Frappe-Hell.git`
2. inside the cloned repository, you will see two important directories, titled <b>front-end/</b> and <b>back-end/</b>.
3. The back-end directory contains a Django Rest Frame-work project. start serving it on port 8000 by typing the command\
`$ python3 manage.py runserver`.
4. The front-end directory contains a React.js project. Start serving it on port 3000 by typing the command:\
`$ npm start`.
5. Open a web-browser and go to `http//:localhost:3000/`. You will be presented with the project.

## Unit testing instructions

- Unit tests for the back-end can be found under the <b>tests</b> directory with the back-end Django project.\
- The script `tests.py` can be run to run all of the included unit tests.

## System testing instructions

- The system can be tested by running both the front-end and the back-end simultaneously and navigating to all possible locations on the web-app.\
- By so doing, the big picture or system can be tested for any big issues.

## Other development notes, as needed
