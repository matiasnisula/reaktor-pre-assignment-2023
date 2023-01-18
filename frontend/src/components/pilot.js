const Pilot = ({ pilot }) => {
  return (
    <tr key={pilot.pilotId}>
      <td>{pilot.pilotId}</td>
      <td>{pilot.firstName}</td>
      <td>{pilot.lastName}</td>
      <td>{pilot.phoneNumber}</td>
      <td>{pilot.email}</td>
      <td>{pilot.lastViolated}</td>
    </tr>
  );
};

export default Pilot;
