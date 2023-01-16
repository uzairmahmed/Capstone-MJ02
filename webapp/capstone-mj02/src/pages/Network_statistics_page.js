import {Link} from 'react-router-dom';

function Networkstatisticspage (){
    return(
        <div className='w-full my-10'>
            <div className='max-width-[1240px] mx-auto '>
                
                <div className='text-center'>
                    <h2 className='text-5xl font-bold'>Network Statistics Page</h2>
                    <p className='text-2xl py-10 text-gray-500'>Router Statistics</p>
                </div>

                <div className='grid gap-2 grid-cols-1 px-3 text-center md:grid-cols-4'>
                        <Link to='/money_spent_on_power_graph'>
                            <div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Network Bandwidth Usage</p>
                                <p className='mt-2 text-gray-400'>Time x MBPS</p>
                            </div>
                        </Link>
        

                        <Link to='/power_usage_graph'>
                            <div className='rounded-xl shadow-xl border py-10'>
                                <p className='font-bold text-indigo-500 text-4xl '>Error Rate</p>
                                <p className='mt-2 text-gray-400'>Time x Packets lost</p>
                            </div>
                        </Link>

                            <div className='grid gap-2 grid-cols-1 px-3 text-center md:grid-cols-2'>
                                <div className='rounded-xl shadow-xl border py-10'>
                                    <p className='font-bold text-indigo-500 text-2xl '>Network Security</p>
                                    <p className='mt-2 text-gray-400'></p>
                                </div>
                           
                                <div className='rounded-xl shadow-xl border py-10'>
                                    <p className='font-bold text-indigo-500 text-2xl '>Fire Wall Status</p>
                                    <p className='mt-2 text-gray-400'></p>
                                </div>
                           
                                <div className='rounded-xl shadow-xl border py-10'>
                                    <p className='font-bold text-indigo-500 text-2xl '>Signal Strength</p>
                                    <p className='mt-2 text-gray-400'></p>
                                </div>
                          
                                <div className='rounded-xl shadow-xl border py-10'>
                                    <p className='font-bold text-indigo-500 text-2xl '>Connection to Internet</p>
                                    <p className='mt-2 text-gray-400'></p>
                                </div>
                            
                                <div className='rounded-xl shadow-xl border py-10'>
                                    <p className='font-bold text-indigo-500 text-2xl '>Network Health</p>
                                    <p className='mt-2 text-gray-400'></p>
                                </div>
                       
                                <div className='rounded-xl shadow-xl border py-10'>
                                    <p className='font-bold text-indigo-500 text-2xl '>Connected Devices</p>
                                    <p className='mt-2 text-gray-400'></p>
                                </div>
                        </div>     
                </div>
            </div>
        </div>

        
    );
}

export default Networkstatisticspage;