import createGradient from '@/lib/createGradient'
import Image from 'next/image'
import React from 'react'
import { RiArrowRightSLine } from "react-icons/ri";

export default function page() {
    return (
        <div className='w-full h-screen flex justify-center items-center' style={{ backgroundImage: createGradient("#f09609") }}>
            <div className="bg-white h-[800px] max-w-[380px] shadow-md rounded-xl">
                <Image
                    alt={"Image"}
                    src="https://res.cloudinary.com/duslrhgcq/image/upload/v1722596805/uipp20sdomferllsv8lj.webp"
                    width={380}
                    height={310}
                    className="rounded-xl"
                />
                <div className='px-4 mt-4'>
                    <h1 className='text-center text-[20px] font-bold'></h1>
                    <h2 className='text-center mt-2 font-semibold'>Click to shop from your favourite store</h2>
                    <button className='w-full rounded-full mt-3 px-3 py-2 bg-[#FFE141] flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <Image
                                alt="blinkit_logo"
                                src="https://res.cloudinary.com/duslrhgcq/image/upload/v1723557318/ionaeneynhil6uwjyyol.png"
                                width={50}
                                height={50}
                                className='w-[50px] h-[50px]'
                            />
                            <div className='flex flex-col items-start'>
                                <p className='font-semibold'>BLINKIT</p>
                                <p className='text-xs'>Pack of 12 at $2.79</p>
                            </div>
                        </div>
                        <RiArrowRightSLine size={25} />
                    </button>
                    <button className='w-full rounded-full mt-3 px-3 py-2 bg-[#3E0169] flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <Image
                                alt="blinkit_logo"
                                src="https://res.cloudinary.com/duslrhgcq/image/upload/v1723558198/tptvmccj48nnsqmoiani.png"
                                width={50}
                                height={50}
                                className='w-[50px] h-[50px] object-contain'
                            />
                            <div className='flex flex-col items-start'>
                                <p className='font-semibold text-white'>BLINKIT</p>
                                <p className='text-xs text-white'>Pack of 12 at $2.79</p>
                            </div>
                        </div>
                        <RiArrowRightSLine size={25} className='text-white'/>
                    </button>
                    <button className='w-full rounded-full mt-3 px-3 py-2 bg-[#D7EDFA] flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <Image
                                alt="blinkit_logo"
                                src="https://res.cloudinary.com/duslrhgcq/image/upload/v1723558256/xqrdmgstwvpfw4t0jqpm.png"
                                width={50}
                                height={50}
                                className='w-[50px] h-[50px]'
                            />
                            <div className='flex flex-col items-start'>
                                <p className='font-semibold text-black'>BLINKIT</p>
                                <p className='text-xs text-black'>Pack of 12 at $2.79</p>
                            </div>
                        </div>
                        <RiArrowRightSLine size={25} className='text-black'/>
                    </button>
                </div>
            </div>
        </div>
    )
}
