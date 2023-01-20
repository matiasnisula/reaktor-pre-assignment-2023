const fetchData = require("./services/fetchData");
const parseDroneData = require("./drones");

const violatedPilots = new Map();

const dronesUrl = "https://assignments.reaktor.com/birdnest/drones";
const pilotsUrl = "https://assignments.reaktor.com/birdnest/pilots";
let isUpdated = false;
let closestDistance = 10000000;

const setIsUpdated = (value) => {
  isUpdated = value;
};
const getIsUpdated = () => {
  return isUpdated;
};

const getClosestDistance = () => {
  return closestDistance;
};

/*
  If the center of circle is (x0, y0) and radius is r,
  then the equation of the circle is (x-x0)^2 + (y-y0)^2 = r^2 
  => sqrt((x-x0)^2 + (y-y0)^2) = r.
  Point (x, y) is inside circle (no drone zone)
  if sqrt((x-x0)^2 + (y-y0)^2) < r.
*/
const checkViolation = (positionX, positionY) => {
  let violation = false;
  const origin = {
    x: 250000,
    y: 250000,
  };
  const radius = 100000;
  const droneDistance = Math.sqrt(
    Math.pow(positionX - origin.x, 2) + Math.pow(positionY - origin.y, 2)
  );
  if (droneDistance < radius) {
    violation = true;
  }
  if (droneDistance < closestDistance) {
    closestDistance = droneDistance;
  }
  return violation;
};

// timeLimit (min)
const removeOutdatedViolations = (timeLimit) => {
  const timeLimitInMs = timeLimit * 60 * 1000;
  const dateNowMs = Date.now();
  for (let [droneId, pilot] of violatedPilots.entries()) {
    const lastViolatedInMs = Date.parse(pilot.lastViolated);
    if (dateNowMs - lastViolatedInMs > timeLimitInMs) {
      violatedPilots.delete(droneId);
      setIsUpdated(true);
    }
  }
};

const updateViolatedPilots = async (drones, timestamp) => {
  try {
    for (let drone of drones) {
      if (!checkViolation(drone.positionX, drone.positionY)) {
        continue;
      }
      let pilotInfo = violatedPilots.get(drone.serialNumber);
      if (!pilotInfo) {
        pilotInfo = await fetchData(`${pilotsUrl}/${drone.serialNumber}`);
      }
      violatedPilots.set(drone.serialNumber, {
        ...pilotInfo,
        lastViolated: timestamp,
      });
      setIsUpdated(true);
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
};

const fetchAndUpdatePilots = async () => {
  setIsUpdated(false);
  const resultXML = await fetchData(dronesUrl);
  const result = parseDroneData(resultXML);
  await updateViolatedPilots(result.drones, result.snapshotTimestamp);
  removeOutdatedViolations(10);
};

module.exports = {
  fetchAndUpdatePilots,
  violatedPilots,
  setIsUpdated,
  getIsUpdated,
  getClosestDistance,
};
