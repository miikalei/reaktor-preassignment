import React, { useState } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'
import './App.css';

import parseText from './parser.js'

function App() {
  const [ packageData, setPackageData ] = useState([])
  const packageNameList =  packageData.map(packageObject => packageObject.package)


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

  const renderPackageLink = (packagename) => {
    if (packageNameList.includes(packagename)) {
      return <Link to={`/${packagename}`}>{packagename}</Link>
    } else return <p>{packagename}</p>
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
        { packageObject.dependencyList.length === 0 && <h3>No dependencies</h3> }
        { packageObject.dependencyList.length !== 0 && <>
          <h3>Dependencies</h3>
          <ul>
            {packageObject.dependencyList.map(dependency => {
              return (
                <div key={dependency}>
                  {dependency.length === 1 && <li>{renderPackageLink(dependency[0])}</li>}
                  {dependency.length !== 1 && <>
                    <li>Any of the following:
                      <ul>
                        {dependency.map(alternative => {
                          return(
                            <li key={alternative}>
                              {renderPackageLink(alternative)}
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  </>}
                </div>
              )
            })}
          </ul>
        </>}
        { packageObject.invDependencyList.length === 0 && <h3>No inverse dependencies</h3> }
        { packageObject.invDependencyList.length !== 0 && <>
          <h3>Inverse dependencies</h3>
          <ul>
            {packageObject.invDependencyList.map(dependency => {
              return <li key = {dependency}>{renderPackageLink(dependency)}</li>
            })}
          </ul>
        </>}
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
