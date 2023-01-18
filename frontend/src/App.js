import React from "react";
import io from "socket.io-client";

import PilotList from "./components/PilotList";

const backendUrl = process.env.URL || "https://divine-sun-9500.fly.dev/";
const socket = io(backendUrl);

const App = () => {
  const [isConnected, setIsConnected] = React.useState(socket.connected);
  const [pilotList, setPilotList] = React.useState([]);

  React.useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("pilotUpdate", (data) => {
      console.log("pilots:", JSON.parse(data));
      setPilotList(JSON.parse(data));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pilotUpdate");
    };
  }, []);

  return (
    <div>
      <h1>Pilots violated no drone zone</h1>
      <PilotList pilotList={pilotList} />
      <div>
        <p>Connected: {"" + isConnected}</p>
      </div>
    </div>
  );
};

export default App;
