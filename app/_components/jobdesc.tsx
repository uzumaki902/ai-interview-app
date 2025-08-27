import React from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const Jobdesc = ({ onHandleInputChange }: any) => {
    return (
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-md space-y-6">
            {/* Job Title */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Job Title
                </label>
                <Input
                    type="text"
                    placeholder="Type job title"
                    onChange={(e) => onHandleInputChange('jobTitle', e.target.value)}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Job Description */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-black-700 dark:text-gray-300">
                    Job Description
                </label>
                <Textarea
                    placeholder="Type job description"
                    onChange={(e) => onHandleInputChange('jobTitle', e.target.value)}
                    className="border border-gray-300 dark:border-black-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px]"
                />
            </div>
        </div>


    )
}

export default Jobdesc
