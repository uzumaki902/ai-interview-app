import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import CreateInterviewDialog from "@/app/_components/createinterviewdialog";


const Emptypage = () => {

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4 -mt-30 min-w[250]">
            <div className="flex flex-col items-center gap-6 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-10 bg-white dark:bg-gray-900">
                <Image
                    src="/interview.svg"
                    alt="emptypage"
                    width={130}
                    height={130}
                />
                <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300 text-center">
                    You have not created any interview
                </h1>
             <CreateInterviewDialog />
            </div>
            

        </div>

    );
};

export default Emptypage;
