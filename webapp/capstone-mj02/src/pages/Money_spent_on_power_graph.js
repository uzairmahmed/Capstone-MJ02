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
import { ref, onValue } from "firebase/database";
import moment from "moment";

function Moneyspentonpowergraph() {
  const [device, setDevice] = useState();
  const [iotDatas, setIotDatas] = useState([]);
  const [ogiotDatas, setOgIotDatas] = useState([]);
  const [month_selection, setMonth] = useState("");
  const [type, setType] = useState();
  const [average, setAverage] = useState(0);
  const constant_money = 0.00000000181666667;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let average_money_spent = 0;

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

    // console.log(new Date(ogiotDatas[0].date).toLocaleString('default', {month:'long'}))
    if (type === "Month") {
      setAverage(0);
      const filteredData = ogiotDatas.filter(
        (ogiotDatas) =>
          new Date(ogiotDatas.date).toLocaleString("default", {
            month: "long",
          }) === month_selection
      );
      for (let i = 0; i < filteredData.length; i++) {
        average_money_spent += filteredData[i].power_mW;
      }
      average_money_spent =
        (average_money_spent * constant_money) / (24 * 60 * 60 * 30); //30 must be replaced by the number of days per month!
      setAverage(average_money_spent);
      setIotDatas(filteredData);
    } else if (type === "All") {
      setAverage(0);
      const firstDate = new Date(ogiotDatas[0].date);
      const lastDate = new Date(ogiotDatas[ogiotDatas.length - 1].date);
      const timeDifference = lastDate.getTime() - firstDate.getTime();

      for (let i = 0; i < ogiotDatas.length; i++) {
        average_money_spent += ogiotDatas[i].power_mW;
      }
      average_money_spent =
        (average_money_spent * constant_money) / timeDifference;
      setAverage(average_money_spent);
      setIotDatas(ogiotDatas);
    } else if (type === "7_Days") {
      setAverage(0);
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const sevenDaysAgoMonth = sevenDaysAgo.getMonth(); // returns a number between 0 and 11 representing the month (0 = January, 1 = February, etc.)
      const sevenDaysAgoDate = sevenDaysAgo.getDate(); // returns a number between 1 and 31 representing the day of the month

      const filteredData7days = ogiotDatas.filter(
        (ogiotDatas) =>
          new Date(ogiotDatas.date).getMonth() === sevenDaysAgoMonth &&
          new Date(ogiotDatas.date).getDate() >= sevenDaysAgoDate
      );
      for (let i = 0; i < filteredData7days.length; i++) {
        average_money_spent += filteredData7days[i].power_mW;
      }
      average_money_spent =
        (average_money_spent * constant_money) / (24 * 60 * 60 * 7); // 7 reps, last 7 days!
      setAverage(average_money_spent);
      setIotDatas(filteredData7days);
    } else if (type === "Today") {
      setAverage(0);
      const now = moment();
      const startOfDay = now.startOf("day");
      const filteredDataToday = ogiotDatas.filter((ogiotData) =>
        moment(ogiotData.date).isSameOrAfter(startOfDay)
      );
      for (let i = 0; i < filteredDataToday.length; i++) {
        average_money_spent += filteredDataToday[i].power_mW;
      }
      average_money_spent =
        (average_money_spent * constant_money) / (24 * 60 * 60);
      setAverage(average_money_spent);
      setIotDatas(filteredDataToday);
    }
  }, [type, month_selection, device, ogiotDatas]);

  function formatXAxis(tickItem) {
    return moment(tickItem).fromNow();
  }

  return (
    <div>
      <div>
        <select defaultValue="" onChange={(e) => setDevice(e.target.value)}>
          <option value="">Select Device</option>
          <option value="iOT_1">iOT_1</option>
          <option value="iOT_2">iOT_2</option>
          <option value="iOT_3">iOT_3</option>
        </select>
      </div>

      {device && (
        <div>
          <select defaultValue="" onChange={(e) => setType(e.target.value)}>
            <option value="Live">Select an option</option>
            <option value="Today">Today</option>
            <option value="7_Days">Past 7 days</option>
            <option value="Month">Month</option>
            <option value="All">All</option>
          </select>
        </div>
      )}

      {type === "Month" && (
        <div>
          <select defaultValue="" onChange={(e) => setMonth(e.target.value)}>
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
        <h1 className="text-4xl text-center">Money Spent on Power</h1>
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
              label={{ value: "Date", position: "insideBottom" }}
            />
            <YAxis
              label={{
                value: "Power Usage (mWatts)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="power_mW"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <h3 className="text-2xl text-center">Average Amount spent: ${average}</h3>
    </div>
  );
}

export default Moneyspentonpowergraph;
