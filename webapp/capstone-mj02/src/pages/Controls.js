import {Link} from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import { getDatabase, ref, onValue, set} from "firebase/database";
import { Slider } from "../components/Slider.jsx";

function Controlspage (){
    const [iotData, setIotData] = useState("");
    const [iotDatas, setIotDatas] = useState([]);
    const [on_off , setOn_off] = useState(false);
    
    // Push Function
    const Push = () => {
        set(ref(db, 'iOT_1/control' ), {
            on_off : on_off, 
          });
    }

    return(
        <div className='w-full my-10'>
            <div className='max-width-[1240px] mx-auto '>
                
                <div className='text-center'>
               
                    <h2 className='text-5xl font-bold'>Network Statistics Page</h2>
                    <p className='text-2xl py-10 text-gray-500'>Router Statistics</p>
                </div>

                <div className='grid gap-2 grid-cols-1 px-3 text-center md:grid-cols-2'>
                    
                            <div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Power</p>
                                <button className="bg-transparent hover:bg-indigo-500 text-indigo-500 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded" onClick={() =>{ setOn_off(!on_off); Push();}}>lol</button>
                                <p className='mt-2 text-gray-400'>{!on_off ? 'The device is On!' : 'The device is Off!'}</p>
                            </div>
                        
                            <div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Color Changer</p>
                                <p className='mt-2 text-gray-400'>Red</p>
                                <Slider />
                                <p className='mt-2 text-gray-400'>Blue</p>
                                <Slider />
                                <p className='mt-2 text-gray-400'>Green</p>
                                <Slider />
                            </div>
                </div>
            </div>
        </div>    
    );
}

export default Controlspage;