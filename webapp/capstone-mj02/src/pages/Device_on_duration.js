import {
  BarChart,
  Bar,
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

function Deviceonduration() {
  var today = new Date().getDate();
  const [device, setDevice] = useState();
  const [iotDatas, setIotDatas] = useState([]);
  const [ogiotDatas, setOgIotDatas] = useState([]);
  const [month_selection, setMonth] = useState("");
  const [type, setType] = useState();
  const [onDuration, setOnDuration] = useState();
  const [onDurationToday, setOnDurationToday] = useState([
    {
      today: today,
      device_on_duration: 0,
    },
  ]);
  const [onDurationMonths, setOnDurationMonths] = useState([
    {
      month: "January",
      device_on_duration: 0,
    },
    {
      month: "February",
      device_on_duration: 0,
    },
    {
      month: "March",
      device_on_duration: 0,
    },
    {
      month: "April",
      device_on_duration: 0,
    },
    {
      month: "May",
      device_on_duration: 0,
    },
    {
      month: "June",
      device_on_duration: 0,
    },
    {
      month: "July",
      device_on_duration: 0,
    },
    {
      month: "August",
      device_on_duration: 0,
    },
    {
      month: "September",
      device_on_duration: 0,
    },
    {
      month: "October",
      device_on_duration: 0,
    },
    {
      month: "November",
      device_on_duration: 0,
    },
    {
      month: "December",
      device_on_duration: 0,
    },
  ]);

  const totalOnDuration = onDurationMonths.reduce((total, current) => {
    return total + current.device_on_duration;
  }, 0);

  const [onDurationSevenDays, setOnDurationSevenDays] = useState([
    {
      day: 1,
      device_on_duration: 0,
    },
    {
      day: 2,
      device_on_duration: 0,
    },
    {
      day: 3,
      device_on_duration: 0,
    },
    {
      day: 4,
      device_on_duration: 0,
    },
    {
      day: 5,
      device_on_duration: 0,
    },
    {
      day: 6,
      device_on_duration: 0,
    },
    {
      day: 7,
      device_on_duration: 0,
    },
  ]);

  const totalOnDurationSevenDays = onDurationSevenDays.reduce(
    (total, current) => {
      return total + current.device_on_duration;
    },
    0
  );

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
  let on_duration = 0;

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
      for (let i = 0; i < ogiotDatas.length; i++) {
        ogiotDatas[i].power_mW = 1; //each point is 1 minute!
      }

      for (let i = 0; i < monthNames.length; i++) {
        const months = monthNames[i];

        const filteredData = ogiotDatas.filter(
          (ogiotDatas) =>
            new Date(ogiotDatas.date).toLocaleString("default", {
              month: "long",
            }) === monthNames[i]
        );

        setIotDatas(filteredData);

        for (let i = 0; i < filteredData.length; i++) {
          on_duration += filteredData[i].power_mW;
        }
        const Index = onDurationMonths.findIndex(
          (month) => month.month === months
        );
        const updatedOnDurationMonths = [...onDurationMonths];
        updatedOnDurationMonths[Index].device_on_duration = on_duration;
        setOnDurationMonths(updatedOnDurationMonths);

        on_duration = 0;
      }
    } else if (type === "Today") {
      const now = moment();
      const startOfDay = now.startOf("day");
      const filteredDataToday = ogiotDatas.filter((ogiotData) =>
        moment(ogiotData.date).isSameOrAfter(startOfDay)
      );
      const filteredPoints = filteredDataToday.filter(
        (dataPoint) => dataPoint.power_mW > 0
      );
      for (let i = 0; i < ogiotDatas.length; i++) {
        ogiotDatas[i].power_mW = 1; //each point is 1 minute!
      }

      for (let i = 0; i < filteredPoints.length; i++) {
        on_duration += filteredPoints[i].power_mW;
      }

      setOnDurationToday([
        {
          today: new Date().toLocaleDateString(),
          device_on_duration: on_duration,
        },
        ...onDurationToday.slice(1),
      ]);
      setIotDatas(ogiotDatas);
      on_duration = 0;
      setOnDuration(0);
    } else if (type === "7_Days") {
      for (let i = 0; i < ogiotDatas.length; i++) {
        ogiotDatas[i].power_mW = 1; //each point is 1 minute!
      }

      for (let i = 1; i < 8; i++) {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const sevenDaysAgoMonth = sevenDaysAgo.getMonth(); // returns a number between 0 and 11 representing the month (0 = January, 1 = February, etc.)
        const sevenDaysAgoDate = sevenDaysAgo.getDate(); // returns a number between 1 and 31 representing the day of the month

        let DAYSDIFFERENCE = 0;
        const filteredData7days = ogiotDatas.filter((ogiotDatas) => {
          const date = new Date(ogiotDatas.date);
          const timeDiff = now.getTime() - date.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          DAYSDIFFERENCE = daysDiff;
          return (
            new Date(ogiotDatas.date).getMonth() === sevenDaysAgoMonth &&
            new Date(ogiotDatas.date).getDate() >= sevenDaysAgoDate
          );
        });

        for (let i = 0; i < filteredData7days.length; i++) {
          on_duration += filteredData7days[i].power_mW;
        }
        const Index = onDurationSevenDays.findIndex(
          (day) => day.day === DAYSDIFFERENCE
        );
        const updatedOnDurationSevenDays = [...onDurationSevenDays];
        updatedOnDurationSevenDays[Index].device_on_duration = on_duration;
        setOnDurationSevenDays(updatedOnDurationSevenDays);
        on_duration = 0;
      }
    }
  }, [type, month_selection, device, ogiotDatas]);

  return (
    <div>
      <div class="flex ">
        <select class="w-48 px-2 py-1 rounded-md text-gray-800 bg-gray-200 mt-5 ml-2" defaultValue="" onChange={(e) => setDevice(e.target.value)}>
          <option value="">Select Device</option>
          <option value="iOT_1">iOT_1</option>
          <option value="iOT_2">iOT_2</option>
          <option value="iOT_3">iOT_3</option>
        </select>
      </div>
      {device && (
        <div class="flex mt-4">
          <select class="w-48 px-2 py-1 rounded-md text-gray-800 bg-gray-200 ml-2" defaultValue="" onChange={(e) => setType(e.target.value)}>
            <option value="">Select an option</option>
            <option value="Today">Today</option>
            <option value="7_Days">Past 7 days</option>
            <option value="Month">Months</option>
          </select>
        </div>
      )}


      <div className="py-5">
        <h1 className="text-3xl text-center">Device On Duration</h1>
        {type === "Month" && (
          <h1 className="text-3xl text-center"> per month </h1>
        )}
        {type === "7_Days" && (
          <h1 className="text-3xl text-center"> for the past week </h1>
        )}

        {type === "Today" && (
          <ResponsiveContainer className="py-5" width="100%" aspect={3}>
            <BarChart width={730} height={250} data={onDurationToday}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="today"
                label={{ value: "Today", position: "insideBottom", dy: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={30} />
              <Bar dataKey="device_on_duration" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {type === "Month" && (
          <ResponsiveContainer className="py-5" width="100%" aspect={3}>
            <BarChart width={730} height={250} data={onDurationMonths}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{ value: "Months", position: "insideBottom", dy: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={30} />
              <Bar dataKey="device_on_duration" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {type === "7_Days" && (
          <ResponsiveContainer className="py-5" width="100%" aspect={3}>
            <BarChart width={730} height={250} data={onDurationSevenDays}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                label={{ value: "Day(s) ago", position: "insideBottom", dy: 7 }}
              />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={30} />
              <Bar dataKey="device_on_duration" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {type === "Today" && (
        <h3 className="text-2xl text-center">
          Time Device was on today: {onDurationToday[0].device_on_duration}{" "}
          minutes
        </h3>
      )}
      {type === "Month" && (
        <h3 className="text-2xl text-center">
          Time Device was on throughout the year: {totalOnDuration} minutes
        </h3>
      )}

      {type === "7_Days" && (
        <h3 className="text-2xl text-center">
          Time Device was in the past week: {totalOnDurationSevenDays} minutes
        </h3>
      )}
    </div>
  );
}

export default Deviceonduration;
