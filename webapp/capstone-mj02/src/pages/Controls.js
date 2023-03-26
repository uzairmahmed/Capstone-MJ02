import {Link} from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../components/firebaseConfig/firebase";
import {useState, useEffect} from "react";
import { getDatabase, ref, onValue, set, update} from "firebase/database";
import { Slider } from "../components/Slider.jsx";

function Controlspage (){
    const [iotData, setIotData] = useState("");
    const [iotDatas, setIotDatas] = useState([]);
    const [on_off , setOn_off] = useState(false);
    const [sliderValueRed, setSliderValueRed] = useState(150);
    const [sliderValueGreen, setSliderValueGreen] = useState(150);
    const [sliderValueBlue, setSliderValueBlue] = useState(150);
    const [which_iot , setIot] = useState(false);

    let iot_device = "iOT_1"; //note: IOT DEVICE 1 IS TRUE, IOT DEVICE 2 IS FALSE
    if(!which_iot){
        iot_device = "iOT_2"; //note: IOT DEVICE 1 IS TRUE, IOT DEVICE 2 IS FALSE
    }
    
    // Push Function
    const PushColor = () => {
        update(ref(db, iot_device + '/control'), {
            color : [sliderValueRed, sliderValueGreen, sliderValueBlue].toString()
          });
    }

    /*const Push = () => {
        set(ref(db, 'iOT_1/control' ), {
            on_off : on_off,
            red_value : sliderValueRed,  
          });
    }*/

    const PushPower = () => {
        set(ref(db, iot_device + '/control'), {
            on_off : on_off,
            color : [sliderValueRed, sliderValueGreen, sliderValueBlue].toString()
          });
    }
    const handleChangeRed = (event) => {
        setSliderValueRed(event.target.value);
      }
    const handleChangeGreen = (event) => {
        setSliderValueGreen(event.target.value);
    }

    const handleChangeBlue = (event) => {
        setSliderValueBlue(event.target.value);
    }
    /*const updateSliderValue = (value) => {
  firebase.database().ref('sliderValue').set(value);
}*/

    return(
        <div className='w-full my-10'>
            <div className='max-width-[1240px] mx-auto '>
                
                <div className='text-center'>
                    <h2 className='text-5xl font-bold'>Controls Page</h2>
                    <p className='text-2xl py-10 text-gray-500'>Device: {!which_iot ? 'Power Bank' : 'Light Strip'}</p>
                    <button className="bg-transparent hover:bg-indigo-500 text-indigo-500 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded" onClick={() =>{ setIot(!which_iot);}}>Iot Device 1/2</button> 
                </div>

                <div className='grid gap-2 grid-cols-1 px-3 text-center md:grid-cols-2'>
                    
                            <div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Power</p>
                                <button className="bg-transparent hover:bg-indigo-500 text-indigo-500 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded" onClick={() =>{ setOn_off(!on_off); PushPower();}}>on/off</button>
                                <p className='mt-2 text-gray-400'>{!on_off ? 'The device is On!' : 'The device is Off!'}</p>
                            </div>
                        
                            {which_iot && (<div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Color Changer</p>
                                {/* <p className='mt-2 text-red-400'>Red</p>
                                <Slider value={sliderValueRed} onChange={(event, value) => {
                                    setSliderValueRed(value);
                                    PushRed(value);
                                }} /> */}
                                
                                <div>
                                    <p className='mt-2 text-red-400'>Red</p>
                                        <input
                                            type="range"
                                            min="0"
                                            max="255"
                                            value={sliderValueRed}
                                            onChange={handleChangeRed}
                                        />
                                    <p>Value: {sliderValueRed}</p>
                                </div>

                                <div>
                                    <p className='mt-2 text-green-400'>Green</p>
                                        <input
                                            type="range"
                                            min="0"
                                            max="255"
                                            //value={sliderValueGreen}
                                            onChange={handleChangeGreen}
                                        />
                                    <p>Value: {sliderValueGreen}</p>
                                </div>

                                <div>
                                    <p className='mt-2 text-blue-400'>Blue</p>
                                        <input
                                            type="range"
                                            min="0"
                                            max="255"
                                            //value={sliderValueGreen}
                                            onChange={handleChangeBlue}
                                        />
                                    <p>Value: {sliderValueBlue}</p>
                                </div>

                                <button className="bg-transparent hover:bg-indigo-500 text-indigo-500 font-semibold hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent rounded" onClick={() =>{PushColor();}}>Set RGB value</button>
                            </div>)}
                </div>
            </div>
        </div>    
    );
}

export default Controlspage;