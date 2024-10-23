import React from 'react'
import BannerCard from '../home/BannerCard'

const Banner = () => {
  return (
    <div className='px-4 lg:px-24 bg-teal-200 flex items-center'>
        <div className='flex w-full flex-col md:flex-row justify-between items-center py-40 gap-12'>
            <div className='md:w-2/3 space-y-6 h-full'>
                <h2 className='text-6xl font-bold leading-snug text-black'>
                    Click Here to buy books! <span className='text-blue-700'> for the best price you've ever got!</span>
                </h2>
                <p className='md:w-5/6'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                </p>
                <div>
                    <input type='search' name='search' id='search' placeholder='Search for a book' className='py-3 px-3 rounded-md outline-none '/>
                    <button className='px-6 py-3 bg-blue-700 ml-2 text-white font-medium hover:bg-black transition-all ease-in duration-200'>Search</button>
                </div>
            </div>


            <div>
                <BannerCard/>

            </div>
        </div>
    </div>
  )
}

export default Banner
