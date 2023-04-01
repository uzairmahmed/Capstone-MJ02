import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import { getDatabase, ref, onValue, set, orderByChild, startAt, endAt, query} from "firebase/database";
  
function Moneyspentonpowergraph (){
    const [iotData, setIotData] = useState("");
    const [iotDatas, setIotDatas] = useState([]);
    const [ogiotDatas, setOgIotDatas] = useState([]);
    const [month_selection , setMonth] = useState("January");
    const [type, setType] = useState();
    const [average, setAverage] = useState();
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
        var power = snapshot.child("power_mW").key;
        if(data !== null){
          const values = Object.values(data);
          setOgIotDatas(values);
          const points = iotDatas.map(({power}) => power);
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
      } else if(type === "Today") {
        //console.log(ogiotDatas[0].stats.power_mW);

        for (let i = 0; i < ogiotDatas.length; i++) { //HERE IS WHERE WE MULTIPLY POWER USAGE FOR 5 MIN, AND THEN STORES IT WITHIN THE POWER_MW
          ogiotDatas[i].stats.power_mW *= 0.0000000090833; //0.0000000090833 is the mw per 5 min!
          //average_money_spent += ogiotDatas[i].stats.power_mW;
        } //note, we neeed it for 24 hrs! AND, each point is taken every 5 min
        //THIS IS WHERE WE FILTER OUT THE ZEROS OR SOME SHIT, AND WE CAN SEE HOW LONG IT WAS ON FOR! (THE DEVICE)
        const filteredPoints = ogiotDatas.filter(dataPoint => dataPoint.stats.power_mW > 0);
        for (let i = 0; i < filteredPoints.length; i++) {
          average_money_spent += filteredPoints[i].stats.power_mW;
          //console.log(average_money_spent);
        }
        average_money_spent = average_money_spent/(24*60*60);
        setAverage(average_money_spent);
        //console.log(filteredPoints[0].stats.power_mW);
        console.log(average_money_spent);
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
        setIotDatas(filteredData7days);
      }
    }, [type, month_selection]);
  
    return(
        <div>
           <div>
              <select defaultValue={type} onChange= {e =>setType(e.target.value)}>
                <option value="Today">Today</option>
                <option value="7_Days">Past 7 days</option>
                <option value="Month" >Month</option>
              </select>
            </div>

            {type === "Month" && (<div>
              <h1>{month_selection} </h1>
              <select defaultValue={month_selection} onChange= {e =>setMonth(e.target.value)}>
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
                    <YAxis label={{ value: 'Money ($)', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stats.power_mW"  stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <h3>Average Amount spent: ${average}</h3> 
        </div>

        
    );
}

export default Moneyspentonpowergraph;

