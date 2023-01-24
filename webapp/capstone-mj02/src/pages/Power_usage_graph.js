import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import { getDatabase, ref, onValue, set} from "firebase/database";



const data = [
    {
      week: 'January 7-14',
      watts: 4,
    },
    {
      week: 'Febuary 14-28',
      watts: 5,
    },
    {
      week: 'March 1-8',
      watts: 7,
      
    },
    {
      week: 'April 7-14',
      watts: 4.5,
      
    },
  ];

  
function Powerusagegraph (){
    const [iotData, setIotData] = useState("");
    const [iotDatas, setIotDatas] = useState([]);
    
    //read
    useEffect(() =>{
      onValue(ref(db, 'LED-Strip/'), snapshot => {
        const data=snapshot.val();
        var current = snapshot.child("current").key;
        if(data !== null){
          const values = Object.values(data);
          console.log(values);
          setIotDatas(values);
          const points = iotDatas.map(({current}) => current);
          console.log(points);
        }
        
      });
    }, []);

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
                    <YAxis label={{ value: 'Power Usage (Watts)', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="current"  stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Powerusagegraph;

