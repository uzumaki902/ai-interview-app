import React from 'react'
    ;
import Image from "next/image";
import Link from "next/link";
import { UserButton, SignedOut, SignInButton, SignUpButton, SignedIn } from '@clerk/nextjs';
import ModeToggle from "@/components/mode-toggle";
const MenuOption = [
    {
        name: 'Dashboard',
        path: '/dashboard'
    },
    {
        name: 'How it works?',
        path: '/how-it-works'
    }
]


const Appheader = () => {
    return (
        <div>
            <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-3 sm:py-4 dark:border-neutral-800">
                {/* Left side - logo and title */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="sm:w-10 sm:h-10"
                        />
                    </Link>
                    <h1 className="text-base font-bold md:text-2xl">
                        AI Interview App
                    </h1>
                </div>
                <div className="hidden md:block">
                    <ul className="flex gap-6">
                        {MenuOption.map((option, index) => (
                            <li key={index}>
                                <Link href={option.path} className="text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">
                                    {option.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <ModeToggle />
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton>
                            <button className="rounded-md border px-2 py-1 sm:px-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">Sign in</button>
                        </SignInButton>
                        <SignUpButton>
                            <button className="rounded-md bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-2 text-sm hover:bg-blue-700">Sign up</button>
                        </SignUpButton>
                    </SignedOut>
                </div>
            </nav>
            {/* Mobile nav */}
            <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 px-4 py-2">
                <ul className="flex gap-4 overflow-x-auto">
                    {MenuOption.map((option, index) => (
                        <li key={index}>
                            <Link href={option.path} className="text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 text-sm">
                                {option.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Appheader
