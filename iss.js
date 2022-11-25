const request = require('request');
const fetchMyIP = function (callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    const data = JSON.parse(body);
    if (error) {
      callback(error);
      return;
    } // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, data['ip']);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    const data = JSON.parse(body);
    const { latitude, longitude } = data;
    if (error) {
      callback(error);
      return;
    } // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyoverTimes = (coords, callback) => {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    const data = JSON.parse(body);
    if (error) {
      callback(error);
      return;
    } // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, data.response);
  });
};
const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error);
      return;
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        callback(error);
        return;
      }
      fetchISSFlyoverTimes(loc, (error, rando) => {
        if (error) {
          callback(error)
          return;

        } callback(null, rando)
      })
    })
  })
}




module.exports = { nextISSTimesForMyLocation };