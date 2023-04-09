import {Link} from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import {ref, onValue} from "firebase/database";

function Networkstatisticspage (){
    var today = new Date().getDate();
    const [iotDatas, setIotDatas] = useState([]);
    const [ogNetworkDatas, setOgNetworkDatas] = useState([]);
    const [client_selection , setClientSelection] = useState("");
    const clientNames = [
        "5E:B7:13:04:88:00",
        "AC:12:03:D6:B6:0E",
        "DC:A6:32:CC:53:7C"
      ];
    useEffect(() =>{
      onValue(ref(db, 'router'+'/logs/'), snapshot => {
        const data=snapshot.val();
        if(data !== null){
          const values = Object.values(data);
          setOgNetworkDatas(values);
          console.log(values[values.length-1]['devices']['5E:B7:13:04:88:00']);
        }
        
      });
    }, []);

    useEffect(() => {
        if (client_selection === "5E:B7:13:04:88:00"){
            console.log("Device 1");
        }
        else if(client_selection === "AC:12:03:D6:B6:0E"){
            console.log("Device 2");
        }
        else if(client_selection === "DC:A6:32:CC:53:7C"){
            console.log("Device 3");
        }
    }, [client_selection]);
    if(client_selection !==""){
        console.log(ogNetworkDatas[ogNetworkDatas.length-1]['devices'][client_selection].authenticated);

    }
    return(
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
             <div>
              <select defaultValue="" onChange= {e =>setClientSelection(e.target.value)}>
                <option value="">Select an option</option>
                <option value="5E:B7:13:04:88:00">Device 1 (5E:B7:13:04:88:00)</option>
                <option value="AC:12:03:D6:B6:0E">Device 2 (AC:12:03:D6:B6:0E)</option>
                <option value="DC:A6:32:CC:53:7C" >Device 3 (DC:A6:32:CC:53:7C)</option>
              </select>
            </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Network Bandwidth Usage</h2>
          {client_selection !== "" && <p className="text-gray-600">2.4 GHz</p>}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Error Packets</h2>
          {client_selection !== "" && (
            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][client_selection]["tx failed"]}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Authenticated</h2>
          {client_selection !== "" && (
            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][client_selection].authenticated === "yes" ? "True" : "False"}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Rx bitrate</h2>
          {client_selection !== "" && (
            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][client_selection]["rx bitrate"].replace("SLASH", "/")}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Tx bitrate</h2>
          {client_selection !== "" && (
            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][client_selection]["tx bitrate"].replace("SLASH", "/")}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Authorized</h2>
          {client_selection !== "" && (
            <p className="text-gray-600">
              {ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][client_selection].authorized === "yes" ? "True" : ""}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Connected Time</h2>
          {client_selection !== "" && (
            <p className="text-gray-600">{ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][client_selection]["connected time"]}</p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Connected Devices</h2>
          {client_selection !== "" && (
            <ul className="text-gray-600">
              <li>Device 1 (5E:B7:13:04:88:00): Connected</li>
              <li>Device 2 (AC:12:03:D6:B6:0E): Connected</li>
              <li>Device 2 (AC:12:03:D6:B6:0E): Connected</li>
            </ul>)}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">idk man </h2>
          {client_selection !== "" && (
            <p className="text-gray-600">{ogNetworkDatas[ogNetworkDatas.length - 1]["devices"][client_selection]["connected time"]}</p>
          )}
        </div>
        </div> 
    );
}

export default Networkstatisticspage;