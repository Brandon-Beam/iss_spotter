const request = require('request-promise-native');
const fetchMyIP = (callback) => {
  return request(`https://api.ipify.org?format=json`,);
}
const fetchCoordsByIP = (body) => {
  const ip = JSON.parse(body).ip
  return request(`http://ipwho.is/${ip}`)
};
const fetchISSFlyoverTimes = (body) => {
  const coords = JSON.parse(body)
  return request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`)
}
const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyoverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    })
    .catch((error) => {
      console.log("It didn't work: ", error.message);
    });
};

module.exports = { nextISSTimesForMyLocation };

