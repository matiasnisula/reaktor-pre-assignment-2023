import Pilot from "./pilot";

const PilotList = ({ pilotList }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Pilot ID</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Phone number</th>
          <th>Email</th>
          <th>Last violated</th>
        </tr>
      </thead>
      <tbody>
        {pilotList.map(([droneId, pilot]) => {
          return <Pilot key={pilot.pilotId} pilot={pilot} />;
        })}
      </tbody>
    </table>
  );
};

export default PilotList;
