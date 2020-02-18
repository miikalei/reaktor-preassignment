import React, { useState } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'
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

  const renderPackage = (packagename) => {
    const packageObject = packageData.find(packageObject => packageObject.package === packagename)
    if (!packageObject) {
      return (
        <div>
          Package data not found :(
        </div>
      )
    }
    return (
      <div>
        <h2>{packageObject.package}</h2>
        <h3>{packageObject.descriptionHeader}</h3>
        <p>{packageObject.descriptionDetails}</p>
        <h3>Dependencies</h3>
        <ul>
          {packageObject.dependencyList.map(dependency => {
            return (
              <li key={dependency}>Juuh
              <ul>
                {dependency.map(alternative => {
                  return(
                    <li key={alternative}>
                      {alternative}
                    </li>
                  )
                })}
              </ul>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="App">
    <BrowserRouter>
      <input type="file" onChange={(event) => loadFile(event.target.files[0])}/>
      <button onClick={ () => loadFile() }>Load default file</button>
      <Link to="/">Home</Link>
      <Route exact path="/:packagename" render={({match}) => renderPackage(match.params.packagename)}/>
      <Route exact path="/" render={() =>
        <div>
          <ul>
            { packageData.map(packageObject =>
              <li key={packageObject.package}>
                <Link to={`/${packageObject.package}`}>{packageObject.package}</Link><br/>
              </li>)
            }
          </ul>
        </div>
      }/>
    </BrowserRouter>
    </div>
  );
}

export default App;
