import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import {ref, onValue} from "firebase/database";
  
function Moneyspentonpowergraph (){
    const [iotDatas, setIotDatas] = useState([]);
    const [ogiotDatas, setOgIotDatas] = useState([]);
    const [month_selection , setMonth] = useState("");
    const [type, setType] = useState();
    const [average, setAverage] = useState(0);
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
        setAverage(0);
        const filteredData = ogiotDatas.filter(
          (ogiotDatas) => ogiotDatas.month === month_selection
        );

        for (let i = 0; i < filteredData.length; i++) {
          average_money_spent += filteredData[i].stats.power_mW;
        } 
        average_money_spent = (average_money_spent*0.0000000090833)/(24*60*60*30); //30 must be replaced by the number of days per month!
        setAverage(average_money_spent);
        console.log(filteredData);
        setIotDatas(filteredData);
      
      } else if(type === "Today") {
        setAverage(0);
        const now = new Date();
        const today = now.getDate();
        const currentMonthName = monthNames[now.getMonth()]; // get the name of the current month
        
        console.log(currentMonthName);
        console.log(today);
        console.log(ogiotDatas[100])

        const filteredDataToday = ogiotDatas.filter(
          (ogiotDatas) => (ogiotDatas.month === currentMonthName && parseInt(ogiotDatas.day.padStart(2, '0')) === today)
        );

        const filteredPoints = filteredDataToday.filter(dataPoint => dataPoint.stats.power_mW > 0);
        //THIS IS WHERE WE FILTER OUT THE ZEROS OR SOME SHIT, AND WE CAN SEE HOW LONG IT WAS ON FOR! (THE DEVICE)
        //NOTE: Each point is 30 sec
        for (let i = 0; i < filteredPoints.length; i++) {
          average_money_spent += filteredPoints[i].stats.power_mW;
        } 
        average_money_spent = (average_money_spent*0.0000000090833)/(24*60*60);
        setAverage(average_money_spent);
        console.log(filteredDataToday);
        setIotDatas(filteredDataToday);
      } else if (type === "7_Days"){
        setAverage(0);
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const sevenDaysAgoMonth = sevenDaysAgo.getMonth(); // returns a number between 0 and 11 representing the month (0 = January, 1 = February, etc.)
        const sevenDaysAgoDate = sevenDaysAgo.getDate(); // returns a number between 1 and 31 representing the day of the month
        const currentMonthName = monthNames[sevenDaysAgoMonth];
        
        const filteredData7days = ogiotDatas.filter(
          (ogiotDatas) => (ogiotDatas.month === currentMonthName && ogiotDatas.day >= sevenDaysAgoDate)
        );

        for (let i = 0; i < filteredData7days.length; i++) {
          average_money_spent += filteredData7days[i].stats.power_mW;
          //console.log(average_money_spent_daily);
        } 
        average_money_spent = (average_money_spent*0.0000000090833)/(24*60*60*7); // 7 reps, last 7 days! 
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
                <h1 className="text-3xl text-center">Money Spent Graph</h1>
                {type === "Month" && (
                  <h1 className="text-3xl text-center"> for the month: {month_selection}</h1>
                )}
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
                    <YAxis label={{ value: 'Money ($)', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stats.power_mW"  stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <h3 className="text-2xl text-center">Average Amount spent: ${average}</h3> 
        </div>

        
    );
}

export default Moneyspentonpowergraph;

