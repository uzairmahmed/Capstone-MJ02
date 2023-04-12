import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { db } from "../components/firebaseConfig/firebase";
import { useState, useEffect } from "react";
import {
  ref,
  onValue,
} from "firebase/database";
import moment from "moment";

function Powerusagegraph() {
  const [device, setDevice] = useState();
  const [iotDatas, setIotDatas] = useState([]);
  const [ogiotDatas, setOgIotDatas] = useState([]);
  const [month_selection, setMonth] = useState("January");
  const [type, setType] = useState();
  //read
  useEffect(() => {
    if (device) {
      onValue(ref(db, device + "/logs/"), (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const values = Object.values(data);
          setOgIotDatas(values);
        }
      });
    }
  }, [device]);

  useEffect(() => {
    if (type === "Month") {
      const filteredData = ogiotDatas.filter(
        (ogiotDatas) =>
          new Date(ogiotDatas.date).toLocaleString("default", {
            month: "long",
          }) === month_selection
      );
      setIotDatas(filteredData);
    } else if (type === "All") {
      setIotDatas(ogiotDatas);
    } else if (type === "7_Days") {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const sevenDaysAgoMonth = sevenDaysAgo.getMonth(); // returns a number between 0 and 11 representing the month (0 = January, 1 = February, etc.)
      const sevenDaysAgoDate = sevenDaysAgo.getDate(); // returns a number between 1 and 31 representing the day of the month

      const filteredData7days = ogiotDatas.filter(
        (ogiotDatas) =>
          new Date(ogiotDatas.date).getMonth() === sevenDaysAgoMonth &&
          new Date(ogiotDatas.date).getDate() >= sevenDaysAgoDate
      );
      setIotDatas(filteredData7days);
    } else if (type === "Live") {
      //two mins ago
      const now = new Date();
      const tenMinsAgo = new Date(now.getTime() - 2 * 60 * 1000);

      const filteredData10mins = ogiotDatas.filter(
        (ogiotDatas) => new Date(ogiotDatas.date) >= tenMinsAgo
      );
      setIotDatas(filteredData10mins);
    }
  }, [type, month_selection, device, ogiotDatas]);

  function formatXAxis(tickItem) {
    return moment(tickItem).fromNow();
  }

  return (
    <div>
      <div>
        <select class="w-48 px-2 py-1 rounded-md text-gray-800 bg-gray-200 mt-5 ml-2" defaultValue="" onChange={(e) => setDevice(e.target.value)}>
          <option value="">Select Device</option>
          <option value="iOT_1">iOT_1</option>
          <option value="iOT_2">iOT_2</option>
        </select>
      </div>

      {device && (
        <div>
          <select class="w-48 px-2 py-1 rounded-md text-gray-800 bg-gray-200 mt-2 ml-2" defaultValue="" onChange={(e) => setType(e.target.value)}>
            <option value="Live">Select an option</option>
            <option value="Live">Live</option>
            <option value="7_Days">Past 7 days</option>
            <option value="Month">Month</option>
            <option value="All">All</option>
          </select>
        </div>
      )}

      {type === "Month" && (
        <div>
          <select class="w-48 px-2 py-1 rounded-md text-gray-800 bg-gray-200 mt-2 ml-2" defaultValue="" onChange={(e) => setMonth(e.target.value)}>
            <option value="">Select a month</option>
            <option value="January" defaultValue>
              January
            </option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
      )}

      <div className="py-5">
        <h1 className="text-4xl text-center">Power Usage Graph</h1>
        <ResponsiveContainer className="py-5" width="100%" aspect={3}>
          <LineChart
            width={500}
            height={300}
            data={iotDatas}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="1 " horizontal="true" vertical="" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              label={{ value: "Date", position: "insideBottom", dy: 10 }}
            />
            <YAxis
              label={{
                value: "Power Usage (mWatts)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend verticalAlign="top" height={30} />
            <Line
              type="monotone"
              dataKey="power_mW"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Powerusagegraph;
