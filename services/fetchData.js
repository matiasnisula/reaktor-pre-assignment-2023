const axios = require("axios");

const fetchData = async (url) => {
  try {
    console.log("fetching..");
    const result = await axios.get(url);
    return result.data;
  } catch (error) {
    console.log("ERROR:", error);
  }
};

module.exports = fetchData;
