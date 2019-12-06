class PlanetNode {
    constructor(name) {
      this.name = name;
      this.moons = [];
    }
  
    addMoon(moonNode) {
      this.moons.push(moonNode);
    }
  
    setParent(parentNode) {
      this.parent = parentNode;
    }
  }
  
  function checksum(root, orbitsSoFar) {
    let directOrbit = root.name === "COM" ? 0 : 1;
    let indirectOrbits = orbitsSoFar - directOrbit;
    let childrenOrbits = root.moons.map(m => checksum(m, orbitsSoFar + 1));
    return (
      directOrbit + indirectOrbits + childrenOrbits.reduce((a, b) => a + b, 0)
    );
  }
  
  function getCommonOrbit(firstPlanet, secondPlanet) {
    let firstPlanetOrbits = { COM: true };
    let firstPlanetOrbit = firstPlanet;
    while (firstPlanetOrbit.name !== "COM") {
      firstPlanetOrbits[firstPlanetOrbit.name] = true;
      firstPlanetOrbit = firstPlanetOrbit.parent;
    }
    let secondPlanetOrbit = secondPlanet;
    while (!firstPlanetOrbits[secondPlanetOrbit.name]) {
      secondPlanetOrbit = secondPlanetOrbit.parent;
    }
    return secondPlanetOrbit;
  }
  
  function distanceToPlanet(current, planetName) {
    if (current.name === planetName) return 0;
    return distanceToPlanet(current.parent, planetName) + 1;
  }
  
  function buildOrbitalMap(orbits) {
    let map = {};
    for (let orbit of orbits) {
      map[orbit[0]] = map[orbit[0]] || new PlanetNode(orbit[0]);
      map[orbit[1]] = map[orbit[1]] || new PlanetNode(orbit[1]);
      let parent = map[orbit[0]];
      let child = map[orbit[1]];
      parent.addMoon(child);
      child.setParent(parent);
    }
    return map;
  }
  
  function partOne() {
    let map = buildOrbitalMap(realOrbits);
    console.log(checksum(map["COM"], 0));
  }
  
  function partTwo() {
    let map = buildOrbitalMap(realOrbits);
    let commonOrbit = getCommonOrbit(map["YOU"], map["SAN"]);
  
    let myDistanceToCommon = distanceToPlanet(map["YOU"].parent, commonOrbit.name);
    let santasDistanceToCommon = distanceToPlanet(map["SAN"].parent, commonOrbit.name);
    console.log(myDistanceToCommon + santasDistanceToCommon)
  }
  
  let realOrbits = input.split("\n").map(o => o.split(")"));
  