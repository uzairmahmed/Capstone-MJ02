import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import { getDatabase, ref, onValue, set} from "firebase/database";
  
function Powerusagegraph (){
    const [iotData, setIotData] = useState("");
    const [iotDatas, setIotDatas] = useState([]);
    const [month_selection , setMonth] = useState();
    const [type, setType] = useState();

    
    //read
    useEffect(() =>{
      onValue(ref(db, 'iOT_1'+'/logs/'), snapshot => {
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
    }, []);

    /*
    const db = getDatabase();
  const dataRef = ref(db, '/groups');
  onValue(dataRef, (snapshot) => {
  snapshot.forEach((groupSnapshot) => {
    console.log(groupSnapshot.key); // "-N02...R1r", "-N02...1T8"
    console.log(groupSnapshot.child("g_id").val()); // "jystl", "nijfx"

    snapshot.child("members").forEach((memberSnapshot) => {
      ... // each of the child snapshots of the `members` nodes
    });
  })
})
    */

    return(
        <div>
           <div>
              <select value={type} onChange= {e =>setType(e.target.value)}>
                <option value="Live" selected>Live</option>
                <option value="7_Days">Past 7 days</option>
                <option value="Month" >Month</option>
              </select>
            </div>

            {type == "Month" && (<div>
              <h1>{month_selection} </h1>
              <select value={month_selection} onChange= {e =>setMonth(e.target.value)}>
                <option value="Jan" selected>January</option>
                <option value="Feb">Febuary</option>
                <option value="Mar">March</option>
                <option value="Apr">April</option>
                <option value="May">May</option>
                <option value="Jun">June</option>
                <option value="Jul">July</option>
                <option value="Aug">August</option>
                <option value="Sep">September</option>
                <option value="Oct">October</option>
                <option value="Nov">November</option>
                <option value="Dec">December</option>
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

