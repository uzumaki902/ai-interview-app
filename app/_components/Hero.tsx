
"use client";
import React from 'react'
import { motion } from "motion/react";
import Image from "next/image";
import Header from './Header';

const Hero = () => {
    return (
        <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">

            <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
                {"Nail every interview. Land the job."
                    .split(" ")
                    .map((word, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                                ease: "easeInOut",
                            }}
                            className="mr-2 inline-block"
                        >
                            {word}
                        </motion.span>
                    ))}
            </h1>
            <motion.p
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 0.3,
                    delay: 0.8,
                }}
                className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
            >
                Get AI-powered mock interviews, instant feedback, and personalized tips to land your dream job.
            </motion.p>
            <motion.div
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 0.3,
                    delay: 1,
                }}
                className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
            >
                <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    Login
                </button>
                <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
                    Sign Up
                </button>
            </motion.div>
            <motion.div
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.3,
                    delay: 1.2,
                }}

                className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
                <div className="w-full overflow-hidden rounded-xl border border-white-300 dark:border-gray-700">
                    <img
                        src="/pic.svg"
                        alt="Landing page preview"
                        className="aspect-[16/9] h-auto w-full object-cover"
                        height={1000}
                        width={1000}
                    />
                </div>


            </motion.div>
        </div>


    )
}

export default Hero
