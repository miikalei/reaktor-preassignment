# reaktor-preassignment
My preassignment solution for applying to Reaktor.

**Live demo available at https://shielded-sea-75465.herokuapp.com/**

## Description

~~The complete assignment description can be found at https://www.reaktor.com/junior-dev-assignment/.~~ 
UPDATE: The assignment has been changed to a newer one, and is no longer visible on Reaktor website (14.12.2020)

I built a small webapp that allows user to browse information contained in Debian package control files. Namely, the file we are interwsted is ```/var/lib/dpkg/status``` on Debian and Ubuntu systems. The user can read their own file or use the example file provided in the assignment description. For each package, the user can read the description, list other packages the package depends on, as well as list all inverse dependencies (which other packages depend on the package).

## Implementation

The app is implemented using React, since in my mind this approach provides good mantainability, since the state and rendering are completely separated. The app was configured using [create-react-app](https://create-react-app.dev), and uses [semantic-ui-react](https://react.semantic-ui.com) for styling and [express](https://expressjs.com) for static serving. The app was deployed on [heroku](https://www.heroku.com) using their free plan.

My contributions are seen mainly in three files of interest: ```parser.js``` handles the parsing of the control file into a data structure that the app can use, ```App.js``` contains the frontend logic and its styling, and finally ```server/server.js``` contains the extremely simple express backend which is needed for Heroku.

## Running locally

If you wish to run the app on the local React developer server, make sure you have Node.js and npm installed (this app was built using version 13.8) and run the following commands in the root directory:

```
npm install
npm start
```

For more information, see [the React tutorial](https://reactjs.org/tutorial/tutorial.html)

#### Authors and licence

This project was done by @miikalei and is licenced under the MIT licence - see LICENCE file for details.
