import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Jobdesc from './jobdesc';
import Resupload from './resupload';
import { useState } from "react";


const CreateInterviewDialog = () => {
    const [formData,setFormData]=useState<any>()
    const onHandleInputChange=(field:string,value:string)=>{
        setFormData((prev:any)=>({
            ...prev,
            [field]:value
        }))
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Button
                        variant="outline"
                        className="rounded-2xl border-2 border-blue-500 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-white font-semibold shadow-lg hover:opacity-90 transition"
                    >
                        + Create Interview
                    </Button>

                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Please submit your details</DialogTitle>
                        <DialogDescription>
                            <Tabs defaultValue="account" className="w-[400px]">
                                <TabsList>
                                    <TabsTrigger value="res">Resume Upload</TabsTrigger>
                                    <TabsTrigger value="desc">Job desrcription</TabsTrigger>
                                </TabsList>
                                <TabsContent value="res"><Resupload /></TabsContent>
                                <TabsContent value="desc"><Jobdesc onHandleInputChange={onHandleInputChange}  /></TabsContent>
                            </Tabs>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose>
                            <Button variant={'outline'}  className="border border-black-600 text-black-600 font-medium px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg active:scale-95">Cancel</Button>
                        </DialogClose>
                        <Button  className="bg-blue-600 border border-black-600 text-black-600 font-medium px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg active:scale-95">Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreateInterviewDialog;
