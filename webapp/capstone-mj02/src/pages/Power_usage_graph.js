import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import { getDatabase, ref, onValue, set, orderByChild, startAt, endAt, query} from "firebase/database";
  
function Powerusagegraph (){
    const [iotData, setIotData] = useState("");
    const [iotDatas, setIotDatas] = useState([]);
    const [ogiotDatas, setOgIotDatas] = useState([]);
    const [month_selection , setMonth] = useState("January");
    const [type, setType] = useState();
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

    //read
    /* 
    const queryRef = query(
      ref(db, 'your-data-path'),
      orderByChild('timestamp'), // Order the data by timestamp or another relevant child key
      startAt(`2023-${month}-01T00:00:00`), // Specify the start of the month you want to retrieve
      endAt(`2023-${month}-31T23:59:59`) // Specify the end of the month you want to retrieve
    );
    */
    /*useEffect(() =>{
      let queryRef; 
      if (type === "Month") {
        console.log(type);
        iotDatas = [];
        let startTimestamp = new Date(`2023-02-01T00:00:00`);
        let endTimestamp = new Date(`2023-02-31T23:59:59`);
        console.log(startTimestamp);
        console.log(endTimestamp);
        const db_ref = ref(db, 'iOT_1'+ '/logs/')
        //queryRef = query(ref(db, 'iOT_1' + '/logs/'),orderByChild('logs'),startAt(`2023-02-01T00:00:00`),endAt(`2023-02-31T23:59:59`));
        queryRef = orderByChild(db_ref, `month`).equalTo(`February`);
      } else {
        iotDatas = [];
        queryRef = ref(db, 'iOT_1' + '/logs/');
      }
      onValue(queryRef, snapshot => {
        const data=snapshot.val();
        var power = snapshot.child("power_mW").key;
        //console.log(data);
        //console.log(power);
        if(data !== null){
          const values = Object.values(data);
          console.log(values);
          setIotDatas(values);
          const points = iotDatas.map(({power}) => power);
          //console.log(points);
        }
      });
    }, [type, month_selection]);*/
    //read
    useEffect(() =>{
      onValue(ref(db, 'iOT_1'+'/logs/'), snapshot => {
        const data=snapshot.val();
        var power = snapshot.child("power_mW").key;
        //console.log(data);
        //console.log(power);
        if(data !== null){
          const values = Object.values(data);
          //console.log(values);
          setOgIotDatas(values);
          const points = iotDatas.map(({power}) => power);
          //console.log(points);
        }
      });
    }, []);

    useEffect(() => {
      console.log(ogiotDatas.date);
      if (type === "Month") {
        const filteredData = ogiotDatas.filter(
          (ogiotDatas) => ogiotDatas.month === month_selection
        );
        setIotDatas(filteredData);
        console.log(filteredData);
      } else if(type === "Live") {
        setIotDatas(ogiotDatas);
      } else if (type === "7_Days"){
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const sevenDaysAgoMonth = sevenDaysAgo.getMonth(); // returns a number between 0 and 11 representing the month (0 = January, 1 = February, etc.)
        const sevenDaysAgoDate = sevenDaysAgo.getDate(); // returns a number between 1 and 31 representing the day of the month
        const currentMonthName = monthNames[sevenDaysAgoMonth];
        
        console.log(currentMonthName);
        console.log(sevenDaysAgoDate);
        const filteredData7days = ogiotDatas.filter(
          (ogiotDatas) => (ogiotDatas.month === currentMonthName && ogiotDatas.day >= sevenDaysAgoDate)
        );
        setIotDatas(filteredData7days);
      }
    }, [type, month_selection]);
  
    return(
        <div>
           <div>
              <select defaultValue="" onChange= {e =>setType(e.target.value)}>
                <option value="">Select an option</option>
                <option value="Live">Live</option>
                <option value="7_Days">Past 7 days</option>
                <option value="Month" >Month</option>
              </select>
            </div>

            {type === "Month" && (<div>
              <h1>{month_selection} </h1>
              <select defaultValue="" onChange= {e =>setMonth(e.target.value)}>
                <option value="">Select a month</option>
                <option value="January" defaultValue>January</option>
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
            </div>)}


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
                    <CartesianGrid strokeDasharray="1 " horizontal="true" vertical = ""/>
                    <XAxis dataKey="current time" label={{ value: 'Time (hours)', position: 'insideBottom' }}/>
                    <YAxis label={{ value: 'Power Usage (mWatts)', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stats.power_mW"  stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Powerusagegraph;

