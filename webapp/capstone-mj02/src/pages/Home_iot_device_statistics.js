import {Link} from 'react-router-dom';

function Homeiotdevicestats (){
    return(
        <div className='w-full my-10'>
            <div className='max-width-[1240px] mx-auto '>
                
                <div className='text-center'>
                    <h2 className='text-5xl font-bold'>HOME IOT DEVICE STATS</h2>
                    <p className='text-2xl py-10 text-gray-500'>The Device Statistics</p>
                </div>

                <div className='grid gap-2 grid-cols-1 px-3 text-center md:grid-cols-3'>
                    
                        <Link to='/money_spent_on_power_graph'>
                            <div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Money spent on Power Usage</p>
                                <p className='mt-2 text-gray-400'>Time x Canadian Dollars</p>
                            </div>
                        </Link>
        

                        <Link to='/power_usage_graph'>
                            <div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Power Usage</p>
                                <p className='mt-2 text-gray-400'>Time x Watts</p>
                            </div>
                        </Link>

                        <Link to='/'>
                            <div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Device On Duration</p>
                                <p className='mt-2 text-gray-400'>Time x time device is on</p>
                            </div>
                        </Link>
                </div>
            </div>
        </div>
    );
}

export default Homeiotdevicestats;