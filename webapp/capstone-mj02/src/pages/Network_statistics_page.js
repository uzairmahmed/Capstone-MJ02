import { db } from "../components/firebaseConfig/firebase";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";

function Networkstatisticspage() {
  const [device, setDevice] = useState("");
  const [ogNetworkDatas, setOgNetworkDatas] = useState([]);
  const [client_selection, setClientSelection] = useState("");
  const clientNames = [
    "3C:61:05:D5:0A:9E",
    "AC:12:03:D6:B6:0E",
    "DC:A6:32:CC:53:7C",
  ];
  useEffect(() => {
    if (device) {
      onValue(ref(db, device + "/logs/"), (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const values = Object.values(data);
          setOgNetworkDatas(values);
        }
      });
    }
  }, [device]);

  useEffect(() => {
    if (client_selection === "3C:61:05:D5:0A:9E") {
      console.log("Device 1");
    } else if (client_selection === "AC:12:03:D6:B6:0E") {
      console.log("Device 2");
    } else if (client_selection === "DC:A6:32:CC:53:7C") {
      console.log("Device 3");
    }
    if (device === "central") {
      setClientSelection("");
    }
  }, [device, client_selection]);

  return (
    <div>
      <div>
        <select defaultValue="" onChange={(e) => setDevice(e.target.value)}>
          <option value="">Select Device</option>
          <option value="router">Router</option>
          <option value="central">Central Node</option>
        </select>
      </div>

      {device === "router" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <select
              defaultValue=""
              onChange={(e) => setClientSelection(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="3C:61:05:D5:0A:9E">
                Device 1 (3C:61:05:D5:0A:9E)
              </option>
              <option value="AC:12:03:D6:B6:0E">
                Device 2 (AC:12:03:D6:B6:0E)
              </option>
              <option value="DC:A6:32:CC:53:7C">
                Device 3 (DC:A6:32:CC:53:7C)
              </option>
            </select>
          </div>

          <div>
            <h1 class="text-2xl font-semibold mb-6 text-center">
              Device Statistics
            </h1>
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">
                  Network Bandwidth Usage
                </h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">2.4 GHz</p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">Error Packets</h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">
                    {
                      ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][
                        client_selection
                      ]["tx failed"]
                    }
                  </p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">Authenticated</h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">
                    {ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][
                      client_selection
                    ].authenticated === "yes"
                      ? "True"
                      : "False"}
                  </p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">Rx bitrate</h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">
                    {ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][
                      client_selection
                    ]["rx bitrate"].replace("SLASH", "/")}
                  </p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">Tx bitrate</h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">
                    {ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][
                      client_selection
                    ]["tx bitrate"].replace("SLASH", "/")}
                  </p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">Authorized</h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">
                    {ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][
                      client_selection
                    ].authorized === "yes"
                      ? "True"
                      : ""}
                  </p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">Connected Time</h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">
                    {
                      ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][
                        client_selection
                      ]["connected time"]
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h1 class="text-2xl font-semibold mb-6 text-center">
              Router Statistics
            </h1>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">
                  Network Bandwidth Usage
                </h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">2.4 GHz</p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">Disk Usage</h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">
                    {ogNetworkDatas[ogNetworkDatas.length - 1]["used_disk"]}/
                    {ogNetworkDatas[ogNetworkDatas.length - 1]["total_disk"]} MB
                  </p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">Memory Usage</h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">
                    {ogNetworkDatas[ogNetworkDatas.length - 1]["used_memory"]}/
                    {ogNetworkDatas[ogNetworkDatas.length - 1]["total_memory"]}{" "}
                    MB
                  </p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">
                  Average Load time for 1 minute
                </h2>
                {client_selection !== "" && (
                  <p class="text-gray-600">
                    {
                      ogNetworkDatas[ogNetworkDatas.length - 1][
                        "avg_load_1_min"
                      ]
                    }{" "}
                    Seconds
                  </p>
                )}
              </div>
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold mb-4">Connected Devices</h2>
                {client_selection !== "" && (
                  <ul class="text-gray-600">
                    <li>Device 1 (3C:61:05:D5:0A:9E): Connected</li>
                    <li>Device 2 (AC:12:03:D6:B6:0E): Connected</li>
                    <li>Device 2 (AC:12:03:D6:B6:0E): Connected</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {device === "central" && ogNetworkDatas.length > 0&& (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Network Bandwidth Usage
            </h2>
            <p className="text-gray-600">2.4 GHz</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Disk Usage</h2>

            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1]["used_disk"]}/
              {ogNetworkDatas[ogNetworkDatas.length - 1]["total_disk"]} MB
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Memory Usage</h2>

            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1]["used_memory"]}/
              {ogNetworkDatas[ogNetworkDatas.length - 1]["total_memory"]} MB
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Is React Server running
            </h2>
            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1]["react_server"] ===
              true
                ? "Yes"
                : "No"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Is Firebase Collector running
            </h2>
            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1][
                "firebase_collector"
              ] === true
                ? "Yes"
                : "No"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              Is Kiosk Display running
            </h2>
            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1]["kiosk_display"] ===
              true
                ? "Yes"
                : "No"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Networkstatisticspage;
