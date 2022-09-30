# Prototype

This directory contains two prototypes projects:
- a Low Fidelity Visual Diagram (PDF)
- a High Fidelity Backend/Frontend Prototype (tartarus.py)

## Low Fidelity Visual Diagram
- This was created in order to have a more visual understanding of the project.
- It contains views, connected by lines that help understand the navigation flow of the project.

## High Fidelity Backend/Frontend Prototype
The High Fidelity is a little more involved and has several moving parts:
- `tartarus.py`: This is a simple Flask app (Which is the framework of our frontend)
- `prototype_signin.html`: We won't write the app in html, but this is a sign-in page for the purpose of showing that we can connect the backend to the frontend
- `requirements.txt`: This contains the dependencies that you will need to get in order to be able to run `tartarus.py`.

### Running the High Fidelity Prototype
- After cloning this repository locally, install the dependencies from the requirements.txt so `tartarus.py` can use them
- Once that is complete, run the command `flask --app tartarus.py run` to get flask app running on port 5000.
- Open a browser and navigate to `http://localhost:5000`. The flask backend will respond with a simple message showing that you have reached the backend.
- Navigate to `http://localhost:5000/demo`, and you will be served the html sign-in page.
- You can try to log in to the page, and the backend will respond with an appropriate error if the user and password are not yet in the database.
- We have not written any scripts that automatically populate the database with users, but the purpose of the prototype is to give a simple demonstration of how this will work