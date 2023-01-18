const { XMLParser } = require("fast-xml-parser");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  attributesGroupName: "attributes",
});

const parseDroneData = (dataXML) => {
  const parsedXMLObj = parser.parse(dataXML);
  return {
    drones: parsedXMLObj.report.capture.drone,
    snapshotTimestamp: parsedXMLObj.report.capture.attributes.snapshotTimestamp,
  };
};

module.exports = parseDroneData;
