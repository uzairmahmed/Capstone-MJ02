import React, {useState} from 'react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import {Link} from 'react-router-dom';


export const Navbar = () => {
    const [nav, setNav] = useState(false);
    const handleClick = () => setNav(!nav)

  return (
    <div className='w-screen h-[80px] z-10 bg-zinc-200 drop-shadow-lg'>
        <div className='px-2 flex justify-between items-center w-full h-full'>
            <div className='flex items-center'>
                <h1 className='text-3xl font-bold mr-4 sm:text-4xl'>Capstone MJ02</h1>
                <ul className='hidden md:flex'>

                    <li className='px-3'> 
                        <Link to='/'>Home Iot Device Statistics</Link> 
                    </li>

                    <li className='px-3'> 
                        <Link to='/network_statistics'>Network Statistics</Link> 
                    </li>
                    
                </ul>
            </div>

            <div className='md:hidden' onClick={handleClick}>
                {!nav ? <Bars3Icon className='w-5'/> : <XMarkIcon className='w-5' />}
            </div>
        </div>

        <ul className={!nav ? 'hidden' : 'absolute bg-zinc-200 w-full px-8'}>
            <li className='border-b-2 border-zinc-300 w-full'>Home</li>
            <li className='border-b-2 border-zinc-300 w-full'>About</li>
            <li className='border-b-2 border-zinc-300 w-full'>Support</li>
            <li className='border-b-2 border-zinc-300 w-full'>Platforms</li>
            <li className='border-b-2 border-zinc-300 w-full'>Pricing</li>
        </ul>

        
    </div>
  )
}
