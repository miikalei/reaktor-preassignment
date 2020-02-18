import React, { useState } from 'react';

import './App.css';

import parseText from './parser.js'

function App() {
  const [ packageData, setPackageData ] = useState([])

  const loadFile = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setPackageData(parseText(event.target.result))
      reader.readAsText(file)
    } else {
      fetch('/data/defaultdata')
        .then((r) => r.text())
        .then((data) => setPackageData(parseText(data)))
    }
  }

  return (
    <div className="App">
      <input type="file" onChange={(event) => loadFile(event.target.files[0])}/>
      <button onClick={ () => loadFile() }>Load default file</button>
      <div id="textarea">
        { packageData.map(packageObject => <p key={packageObject.package}>
          Name: {packageObject.package}<br/>
          Description: {packageObject.descriptionHeader}<br/>
          Descriptiondetails: {packageObject.descriptionDetails}<br/>
          Dependencies: {packageObject.dependencyList.length}
          </p>) }
      </div>
    </div>
  );
}

export default App;
