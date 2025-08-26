import React from 'react'
import Appheader from './_components/appheader'

const DashboardLayout = ({ children }: any) => {
    return (
        <div>
            <Appheader></Appheader>
            {children}
        </div>
    )
}

export default DashboardLayout 
