import React, { useState } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'

import { Container, List, Input, Button, Header } from 'semantic-ui-react'
import './App.css';

import parseText from './parser.js'

function App() {
  const [ packageData, setPackageData ] = useState([])
  const packageNameList =  packageData.map(packageObject => packageObject.package)

  // Function that sets the state of the app, given the file handle
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

  // Helper function that renders a link if package is found, and only text if not.
  const renderPackageLink = (packagename) => {
    if (packageNameList.includes(packagename)) {
      return <Link to={`/${packagename}`}>{packagename}</Link>
    } else return <>{packagename}</>
  }

  // Function that takes the state and lists all the packages as links
  const renderPackageList = (packageData) => {
    if (packageData.length ===0) return (
      <div className="ui raised very padded text container segment">Welcome to my preassignment for applying to Reaktor!<br/>

      This small web app allows you to browse package information contained in Debian control files.<br/>

      You can read your own by choosing a valid file (such as /var/lib/dpkg/status) or by using the provided example file.
      </div>
    )
    return (
      <div style={{height:"500px"}}>
        <Header as='h2' dividing>Found {packageData.length} packages to browse:</Header>
        <List className="CustomList">
          { packageData.map(packageObject =>
            <List.Item key={packageObject.package}>
              <Link to={`/${packageObject.package}`}>{packageObject.package}</Link><br/>
            </List.Item>)
          }
        </List>
      </div>
    )
  }

  // Function for displaying all information on a single package.
  const renderPackage = (packagename) => {
    const packageObject = packageData.find(packageObject => packageObject.package === packagename)
    if (!packageObject) return <div>Package data not found :(</div>
    return (
      <div>
        <Header as='h2' dividing>{packageObject.package}</Header>
        <Header as='h3'>{packageObject.descriptionHeader}</Header>
        <p>{packageObject.descriptionDetails}</p>
        { packageObject.dependencyList.length === 0 && <Header as='h3'>No dependencies</Header> }
        { packageObject.dependencyList.length !== 0 && <div>
          <Header as='h3'>Dependencies</Header>
          <List>
            {/*Go through the dependencies, and list a link for each*/}
            {packageObject.dependencyList.map(dependency => {
              return (
                <div key={dependency}>
                  {dependency.length === 1 && <List.Item>{renderPackageLink(dependency[0])}</List.Item>}
                  {/*// If there are alternatives, list them in a sublist*/}
                  {dependency.length !== 1 && <div>
                    <List.Item>Any of the following:
                      <List>
                        {dependency.map(alternative => {
                          return(
                            <List.Item key={alternative}>
                              {renderPackageLink(alternative)}
                            </List.Item>
                          )
                        })}
                      </List>
                    </List.Item>
                  </div>}
                </div>
              )
            })}
          </List>
        </div>}
        {/*Same thing for inverse dependencies*/}
        { packageObject.invDependencyList.length === 0 && <h3>No inverse dependencies</h3> }
        { packageObject.invDependencyList.length !== 0 && <div>
          <Header as='h3'>Inverse dependencies</Header>
          <List>
            {packageObject.invDependencyList.map(dependency => {
              return <List.Item key = {dependency}>{renderPackageLink(dependency)}</List.Item>
            })}
          </List>
        </div>}
      </div>
    )
  }

  // Render everything!
  return (
    <div className="App">
      <Container text>
        <BrowserRouter>
          <Link to="/"><Button>Home</Button></Link>
          <Button onClick={ () => loadFile() }>Load default file</Button>
          <Input type="file" onChange={(event) => loadFile(event.target.files[0])}/>
          { packageData.length!==0 && <Button onClick={ () => setPackageData([]) }>Reset</Button>}
          <Route exact path="/:packagename" render={({match}) => renderPackage(match.params.packagename)}/>
          <Route exact path="/" render={() => renderPackageList(packageData)}/>
        </BrowserRouter>
      </Container>
    </div>
  );
}

export default App;
