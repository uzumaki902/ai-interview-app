import React from 'react'
    ;
import Image from "next/image";
import Link from "next/link";
import { UserButton } from '@clerk/nextjs';
const MenuOption = [
    {
        name: 'Dashboard',
        path: '/dashbaord'
    },
    {
        name: 'How it works?',
        path: '/dashbaord'
    }
]


const Appheader = () => {
    return (
        <div>
            <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
                {/* Left side - logo and title */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={40}
                        height={40}
                    />
                    <h1 className="text-base font-bold md:text-2xl">
                        AI Interview App
                    </h1>
                    <div>
                        <ul className="flex gap-40">
                            {MenuOption.map((option, index) => (
                                <li
                                    key={index}
                                    className={
                                        option.name === "Dashboard"
                                            ? "text-black-500  hover:text-blue-400 cursor-pointer ml-80" // Tailwind applied only for Dashboard
                                            : "text-gray-700 hover:text-blue-400 cursor-pointer"
                                    }
                                >
                                    {option.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <UserButton />



            </nav>
        </div>
    )
}

export default Appheader
