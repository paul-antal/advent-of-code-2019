//Still needs some cleaning up. This is the modified part for part 2 right now.

function getSegments(instructions) {
    var segments = [];
    var currentPosition = { x: 0, y: 0 };
    for (let instruction of instructions) {
      var previousPosition = { ...currentPosition };
      switch (instruction.direction) {
        case "U":
          currentPosition.y += instruction.distance;
          break;
        case "R":
          currentPosition.x += instruction.distance;
          break;
        case "D":
          currentPosition.y -= instruction.distance;
          break;
        case "L":
          currentPosition.x -= instruction.distance;
          break;
        default:
          console.log("oups");
      }
      segments.push([previousPosition, { ...currentPosition }]);
    }
    return segments;
  }
  
  function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    //Math time
    let denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  
    if (denominator === 0) {
      return false;
    }
  
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
  
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return false;
    }
  
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);
  
    return { x, y };
  }
  
  function manDist(point){
    return Math.abs(point.x) + Math.abs(point.y);
  }
  
  function manDistTwoPoints(point1, point2){
    return manDist({x: point1.x - point2.x, y: point1.y - point2.y})
  }
  
  manDistTwoPoints({"x":-1008,"y":0},{"x":-1008,"y":-951})
  
  function getIntersections(first, second) {
    var firstSegments = getSegments(first);
    var secondSegments = getSegments(second);
  
    var intersections = [];
      var stepsFirstWire = 0;
    for (let firstSegment of firstSegments) {
          var stepsSecondWire = 0;
      for (let secondSegment of secondSegments) {
        var intersection = intersect(
          firstSegment[0].x,
          firstSegment[0].y,
          firstSegment[1].x,
          firstSegment[1].y,
          secondSegment[0].x,
          secondSegment[0].y,
          secondSegment[1].x,
          secondSegment[1].y
        );
        if (intersection) {
          let distance = stepsFirstWire + stepsSecondWire +
              manDistTwoPoints(intersection, firstSegment[0]) +
              manDistTwoPoints(intersection, secondSegment[0]);
              
          return {intersection, distance};
        }
        stepsSecondWire += manDistTwoPoints(...secondSegment);
      }
      stepsFirstWire += manDistTwoPoints(...firstSegment);
    }
    return intersections;
  }
  
  function parsePath(pathString) {
    return pathString.split(",").map(s => {
      return {
        direction: s[0],
        distance: Number(s.slice(1))
      };
    });
  }
  
  function main() {
    var splitInput = input.split(";");
    var first = parsePath(splitInput[0]);
    var second = parsePath(splitInput[1]);
      var intersection = getIntersections(first, second);
  }
  
  main();
  