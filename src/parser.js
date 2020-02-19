const parseText = (textData) => {
  // Input: The string of the control file
  // Returns a list of package objects of form:
  // {
  //  package: packageName,
  //  descriptionHeader: First line of description
  //  descriptionDetails: Rest of the description as string
  //  dependenceList: [[packageName],[Alternative1, Alternative2]]
  // }
  const packageList = textData.split('\n\n')
  const listOfPackageObjects = packageList.map((packageText) => { // For each package in control file:
    // Get the name of the package
    const regExpPackageName = /Package:(.*)/
    const packageName = packageText.match(regExpPackageName)[1].trim()

    // Get the description
    const regExpDescription = /Description:(.+(?:\n\s.+)*)/
    const fullDescription = packageText.match(regExpDescription)[1].trim()
    const descriptionLines = fullDescription.split('\n')
    //For all lines except the first, remove starting whitespace and lines with only '.'
    const descriptionDetails = descriptionLines.slice(1).map(line => {
      if (line.startsWith(' .')) return ""
      else return line.trim()
    }).join('\n')

    // Get the list of dependencies
    const regExpDepends = /Depends:(.*)/
    let dependences = packageText.match(regExpDepends)
    let dependencyList = []
    if (dependences) {
      // Remove version numbers
      dependencyList = dependences[1].trim().replace(/\([^)]*\)/g,'').split(',')
      // List alternatives as an array
      dependencyList = dependencyList.map(dependency => [...new Set(dependency.split('|').map(string => string.trim()))])
      // Drop duplicates (due to different versions)
      dependencyList = Array.from(new Set(dependencyList.map(JSON.stringify)), JSON.parse)
    }

    // Collect everything into an object
    return {
      package: packageName,
      descriptionHeader: descriptionLines[0],
      descriptionDetails: descriptionDetails,
      dependencyList: dependencyList
    }
  })

  // Compute the inverse dependencies for each package
  listOfPackageObjects.forEach(packageObject => {
    let invDependencies = []
    listOfPackageObjects.forEach(otherPackage => {
      if (otherPackage.dependencyList.flat().includes(packageObject.package)) {
        invDependencies.push(otherPackage.package)
      }
    })
    packageObject.invDependencyList = invDependencies
  })
  
  return listOfPackageObjects
}

export default parseText
