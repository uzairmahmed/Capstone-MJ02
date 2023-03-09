import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import { getDatabase, ref, onValue, set} from "firebase/database";
  
function Powerusagegraph (){
    const [iotData, setIotData] = useState("");
    const [iotDatas, setIotDatas] = useState([]);
    
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

