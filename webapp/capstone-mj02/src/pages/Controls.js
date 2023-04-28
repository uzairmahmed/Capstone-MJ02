import { Slider, Sketch, Material, Colorful, Compact, Circle, Wheel, Block, Github, Chrome } from '@uiw/react-color';
import { rgbaToHexa} from '@uiw/color-convert';
import { db } from "../components/firebaseConfig/firebase";
import { useState, useEffect } from "react";
import { BsBatteryCharging, BsFillLightbulbFill } from 'react-icons/bs';

import { getDatabase, get, child, ref, set, update } from "firebase/database";
import Toggle from "../components/Toggle.jsx";

function Controlspage() {
    const [hex, setHex] = useState("#fff");
    const [rgb, setRGB] = useState({ r: 255, g: 255, b: 255 });
    const [device1, setDevice1] = useState(true);
    const [device2, setDevice2] = useState(true);
    const [pickerOpen, setPickerOpen] = useState(false)

    useEffect(() => {
        loadData()
    }, []);

    async function loadData() {
        const dbRef = ref(getDatabase());
        var vals = await get(child(dbRef, `/`)).then((snapshot) => {
            if (snapshot.exists()) {
                return (snapshot.val())
            } else {
                return []
            }
        }).catch((error) => {
            console.error(error);
            return error.message
        });

        const tempColor = (vals.iOT_1.control.color.split(','))
        setDevice1(vals.iOT_1.control.on_off);
        setDevice2(vals.iOT_2.control.on_off)
        setHex(rgbaToHexa({ b: tempColor[2], g: tempColor[1], r: tempColor[0], a: 1 }))
        setRGB({r:tempColor[0], g:tempColor[1], b:tempColor[2]})
    }

    // Push Function
    async function Push (device, val) {
        console.log(device1)
        console.log(device2)
        var colString = (device !== 'iOT_1') ? 
        "[255, 255, 255]" : 
        String(rgb.r).padStart(3,0)+","+String(rgb.g).padStart(3,0)+","+String(rgb.b).padStart(3,0)

        await update(ref(db, device + '/control'), {
            on_off: val,
            color: colString
        });
    }

    return (
        <div className='w-full my-10'>
            <div className='mx-auto '>
                <div className='text-center'>
                <div className='flex flex-row justify-between items-center border shadow-md py-5 px-10 mx-10 my-5'>
                        <div className='flex flex-row items-center'>
                            <BsFillLightbulbFill className='w-10 h-10' />
                            <p className='ml-10 font-medium text-gray-900 text-2xl '>Device 1: Light Strip</p>
                        </div>
                        <div style={{ backgroundColor: hex }} className="flex flex-col rounded-full border cursor-pointer justify-center items-center">
                            <div onClick={() => { setPickerOpen(true) }} className="w-full h-full">
                                <p style={{filter: "invert(1)", mixBlendMode: "difference"}} className="mx-5 mt-1 text-sm font-semibold justify-center">Change Color: ({rgb.r}, {rgb.g}, {rgb.b})</p>
                            </div>
                            <div className="w-1 h-1">
                                {pickerOpen ?
                                    <div className="absolute">
                                        <Chrome style={{ zIndex:100, marginTop: 15 }} color={hex} onChange={(color) => {
                                            setRGB(color.rgb)
                                            setHex(color.hex);
                                        }} />
                                        <div className="absolute w-full flex-col z-50">
                                            <button onClick={() => { setPickerOpen(false) }} className="w-1/2 bg-white shadow-xl p-1 border border-gray-300 hover:bg-gray-300">
                                                Close
                                            </button>
                                            <button onClick={() => { 
                                                setPickerOpen(false) 
                                                Push('iOT_1', device2) }} className="w-1/2 bg-white shadow-xl p-1 border border-gray-300 hover:bg-gray-300">
                                                Set
                                            </button>
                                        </div>
                                    </div>
                                    : <></>}
                            </div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <Toggle toggle={device1} outerFunction={(val) => Push('iOT_1', val)} />
                        </div>
                    </div>
                    <div className='flex flex-row justify-between items-center border shadow-md py-5 px-10 mx-10 my-5'>
                        <div className='flex flex-row items-center'>
                            <BsBatteryCharging className='w-10 h-10' />
                            <p className='ml-10 font-medium text-gray-900 text-2xl '>Device 2: Power Bank</p>
                        </div>
                        <Toggle toggle={device2} outerFunction={(val) => Push('iOT_2', val)} />
                    </div>
                 
                </div>
            </div>
        </div>
    );
}

export default Controlspage;

