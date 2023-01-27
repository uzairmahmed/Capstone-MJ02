import {Link} from 'react-router-dom';

function Controlspage (){
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
                                <p className='mt-2 text-gray-400'>on/off</p>
                            </div>

                            <div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Color Changer</p>
                                <p className='mt-2 text-gray-400'></p>
                            </div>
                </div>
            </div>
        </div>    
    );
}

export default Controlspage;