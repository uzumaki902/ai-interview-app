"use client"
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import CreateInterviewDialog from "@/app/_components/createinterviewdialog";

import Emptypage from "./emptypage";

const Dashboard = () => {
    const { user } = useUser();
    const [interviewlist, setinterviewlist] = useState([])


    return (
        <div>
            <div className="px-10 py-20 md:px-28 lg:px-44 xl:px-56 flex justify-between items-center">

                <div>

                    <h2 className="text-3xl font-bold">Hey,{user?.fullName}</h2>

                </div>


                <div >
                    <CreateInterviewDialog />

                </div>




            </div>
            <div>
                {interviewlist.length == 0 &&
                    <Emptypage />

                }
            </div>
        </div>

    );
};

export default Dashboard;

