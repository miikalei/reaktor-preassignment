import React, { useState } from 'react';

import './App.css';

function App() {
  const [ textData, setTextData ] = useState("Default text")

  const loadDefaultFile = () => {
    fetch('/data/defaultdata')
      .then((r) => r.text())
      .then((data) => setTextData(data))
  }

  const loadCustomFile = (file) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      setTextData(event.target.result)
    }
    reader.readAsText(file)
  }

  return (
    <div className="App">
      <input type="file" onChange={(event) => loadCustomFile(event.target.files[0])}/>
      <button onClick={ () => loadDefaultFile() }>Load default file</button>
      <div id="textarea">
        { textData }
      </div>
    </div>
  );
}

export default App;
