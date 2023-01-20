import React from "react";
import io from "socket.io-client";

import PilotList from "./components/PilotList";
import { backendUrl } from "./config/config";

const socket = io(backendUrl);

const App = () => {
  const [isConnected, setIsConnected] = React.useState(socket.connected);
  const [pilotList, setPilotList] = React.useState([]);
  const [closestDistance, setClosestDistance] = React.useState();

  React.useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("pilotUpdate", (data) => {
      setPilotList(JSON.parse(data));
    });

    socket.on("closestDistance", (data) => {
      setClosestDistance(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pilotUpdate");
      socket.off("closestDistance");
    };
  }, []);

  return (
    <div>
      <h1>Pilots violated no drone zone</h1>
      <PilotList pilotList={pilotList} />
      <div>
        <p>Closest distance (m): {closestDistance}</p>
      </div>
      <div>
        <p>Connected: {"" + isConnected}</p>
      </div>
    </div>
  );
};

export default App;
