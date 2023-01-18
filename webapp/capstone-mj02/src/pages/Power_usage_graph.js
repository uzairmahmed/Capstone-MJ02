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
    var points = [];
    //read
    useEffect(() =>{
      onValue(ref(db, 'LED-Strip/'), snapshot => {
        const data=snapshot.val();
        var current = snapshot.child("current").key;
        if(data !== null){
          //points.push(current);
          console.log(current);
          Object.values(data).map((iot) => {
            setIotDatas(oldArray => [...oldArray, iot]);
            points.push({iot});
            console.log(points);
            //console.log("Current " + points[0].iot.current);
          });
        }
      });
    }, []);

    return(
      
        <div>
          <div>{console.log("POINTS:" + points)}</div>
          
          <div className='text-bold text-center'>
            {iotDatas.map(iot => (
              <>
                <h1 className='text-bold text-blue-600'>Current: {iot.current}</h1>
              </>
            ))}
          </div>
          <h2 className='text-bold text-red-600'>{points}</h2>
        

            <div className="py-5">
                <h1 className="text-4xl text-center">Power Usage Graph</h1>
                <ResponsiveContainer className="py-5" width="100%" aspect={3}>
                    <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="1 " horizontal="true" vertical = ""/>
                    <XAxis dataKey="month" label={{ value: 'Time (hours)', position: 'insideBottom' }}/>
                    <YAxis label={{ value: 'Power Usage (Watts)', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="watts" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Powerusagegraph;

