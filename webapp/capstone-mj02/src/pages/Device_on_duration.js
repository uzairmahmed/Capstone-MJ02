import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import {ref, onValue} from "firebase/database";
  
function Deviceonduration (){
  const data = [
    {
      week: 'January 7-14',
      device_on_duration: 40,
      
    },
    {
      week: 'Febuary 14-28',
      device_on_duration: 50,
      
    },
    {
      week: 'March 1-8',
      device_on_duration: 70,
      
    },
    {
      week: 'April 7-14',
      device_on_duration: 45,
      
    },
  ];

  const data_daily = [
    {
      week: 'January 7-14',
      device_on_duration: 40,
      
    },
    {
      week: 'Febuary 14-28',
      device_on_duration: 50,
      
    },
    {
      week: 'March 1-8',
      device_on_duration: 70,
      
    },
    {
      week: 'April 7-14',
      device_on_duration: 45,
      
    },
  ];
    var today = new Date().getDate();
    const [iotDatas, setIotDatas] = useState([]);
    const [ogiotDatas, setOgIotDatas] = useState([]);
    const [month_selection , setMonth] = useState("");
    const [type, setType] = useState();
    const [average, setAverage] = useState();
    const [counter, setCounter] = useState(0);
    const [onDuration, setOnDuration] = useState();
    const [onDurationToday, setOnDurationToday] = useState([
      {
        today: today,
        device_on_duration: 0,
      }]);
    const [onDurationMonths, setOnDurationMonths] = useState({
      "January": 0,
      "February": 0,
      "March": 0,
      "April": 0,
      "May": 0,
      "June": 0,
      "July": 0,
      "August": 0,
      "September": 0,
      "October": 0,
      "November": 0,
      "December": 0
    });

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
    let on_duration = 0; 

    useEffect(() =>{
      onValue(ref(db, 'iOT_1'+'/logs/'), snapshot => {
        const data=snapshot.val();
        if(data !== null){
          const values = Object.values(data);
          setOgIotDatas(values);
        }
      });
    }, []);

    useEffect(() => {
      
      if (type === "Month") {
        const filteredData = ogiotDatas.filter(
          (ogiotDatas) => ogiotDatas.month === month_selection
        );
        if(counter===0){
          for (let i = 0; i < ogiotDatas.length; i++) { //HERE IS WHERE WE MULTIPLY POWER USAGE FOR 5 MIN, AND THEN STORES IT WITHIN THE POWER_MW
            ogiotDatas[i].stats.power_mW = 5; //0.0000000090833 is the mw per 5 min!
            //average_money_spent += ogiotDatas[i].stats.power_mW;
          } //note, we neeed it for 24 hrs! AND, each point is taken every 5 min
          setCounter(1);   
        }
        for (let i = 0; i < filteredData.length; i++) {
          average_money_spent += filteredData[i].stats.power_mW;
        } 
        average_money_spent = average_money_spent/(24*60*60*30); //30 must be replaced by the number of days per month!
        setAverage(average_money_spent);
        setIotDatas(filteredData);
      
      } else if(type === "Today") {
        //PUT LOGIC HERE FOR FILTERING LAST 24 HRS! 

        const filteredPoints = ogiotDatas.filter(dataPoint => dataPoint.stats.power_mW > 0);
        if(counter===0){
          for (let i = 0; i < ogiotDatas.length; i++) { //HERE IS WHERE WE MULTIPLY POWER USAGE FOR 5 MIN, AND THEN STORES IT WITHIN THE POWER_MW
            ogiotDatas[i].stats.power_mW = 5; //each duration is 5 min!
          } //note, we need it for 24 hrs! AND, each point is taken every 5 min
          setCounter(1);   
        }
        //THIS IS WHERE WE FILTER OUT THE ZEROS OR SOME SHIT, AND WE CAN SEE HOW LONG IT WAS ON FOR! (THE DEVICE)
        //NOTE: Each point is 5 min
        for (let i = 0; i < filteredPoints.length; i++) {
          on_duration += filteredPoints[i].stats.power_mW;
          //console.log(average_money_spent_daily);
        } 
        //on_duration = on_duration/(24*60*60); //avg time it was on?
        setOnDurationToday([{ today: new Date().toLocaleDateString(), device_on_duration: on_duration }, ...onDurationToday.slice(1)]);
        //console.log(filteredPoints[0].stats.power_mW);
        setIotDatas(ogiotDatas);
      
      } else if (type === "7_Days"){
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const sevenDaysAgoMonth = sevenDaysAgo.getMonth(); // returns a number between 0 and 11 representing the month (0 = January, 1 = February, etc.)
        const sevenDaysAgoDate = sevenDaysAgo.getDate(); // returns a number between 1 and 31 representing the day of the month
        const currentMonthName = monthNames[sevenDaysAgoMonth];
        
        const filteredData7days = ogiotDatas.filter(
          (ogiotDatas) => (ogiotDatas.month === currentMonthName && ogiotDatas.day >= sevenDaysAgoDate)
        );
        if(counter===0){
          for (let i = 0; i < ogiotDatas.length; i++) { //HERE IS WHERE WE MULTIPLY POWER USAGE FOR 5 MIN, AND THEN STORES IT WITHIN THE POWER_MW
            ogiotDatas[i].stats.power_mW = 5; //0.0000000090833 is the mw per 5 min!
            //average_money_spent += ogiotDatas[i].stats.power_mW;
          } //note, we neeed it for 24 hrs! AND, each point is taken every 5 min
          setCounter(1);   
        }

        for (let i = 0; i < filteredData7days.length; i++) {
          average_money_spent += filteredData7days[i].stats.power_mW;
          //console.log(average_money_spent_daily);
        } 
        average_money_spent = average_money_spent/(24*60*60*7); // 7 reps, last 7 days! 
        setAverage(average_money_spent);
        setIotDatas(filteredData7days);
      }
    }, [type, month_selection]);
  
    return(
        <div>
           <div>
              <select defaultValue="" onChange= {e =>setType(e.target.value)}>
                <option value="">Select an option</option>
                <option value="Today">Today</option>
                <option value="7_Days">Past 7 days</option>
                <option value="Month" >Month</option>
              </select>
            </div>

            {type === "Month" && (<div>
              {/* <h1>{month_selection} </h1> */}
              <select defaultValue="" onChange= {e =>setMonth(e.target.value)}>
                <option value="">Select a month</option>
                <option value="January">January</option>
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
                <h1 className="text-3xl text-center">Device On Duration</h1>
                {type === "Month" && (
                  <h1 className="text-3xl text-center"> for the month: {month_selection}</h1>
                )}

              {type === "Today" && (
                <ResponsiveContainer className="py-5" width="100%" aspect={3}>
                  <BarChart width={730} height={250} data={onDurationToday}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="today" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="device_on_duration" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}

            {type === "Month" && (
                <ResponsiveContainer className="py-5" width="100%" aspect={3}>
                  <BarChart width={730} height={250} data={onDurationMonths}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="onDuration" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
            )}
                {/* <ResponsiveContainer className="py-5" width="100%" aspect={3}>
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
                    <YAxis label={{ value: 'Money ($)', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stats.power_mW"  stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer> */}
            </div>
            <h3 className="text-2xl text-center">Time Device was On: {onDurationToday[0].device_on_duration} minutes</h3> 
        </div>

        
    );
}

export default Deviceonduration;







/* import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
    {
      week: 'January 7-14',
      device_on_duration: 40,
      
    },
    {
      week: 'Febuary 14-28',
      device_on_duration: 50,
      
    },
    {
      week: 'March 1-8',
      device_on_duration: 70,
      
    },
    {
      week: 'April 7-14',
      device_on_duration: 45,
      
    },
  ];
  
function Deviceonduration (){
    return(
        <div>

            <div className="py-5">
                <h1 className="text-4xl text-center">Device On Duration</h1>
                <ResponsiveContainer className="py-5" width="100%" aspect={3}>
                  <BarChart width={730} height={250} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="device_on_duration" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Deviceonduration; */