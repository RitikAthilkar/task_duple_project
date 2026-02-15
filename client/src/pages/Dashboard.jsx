import React from 'react'
import SideBar from '../components/SideBar'
import Nav from '../components/Nav'
import KanbanBoard from '../components/Dashboard'

const Dashboard = () => {
  return (
    <>
      <div className='grid grid-cols-9'>
        <SideBar/>
        <div className='col-span-7'>
         <Nav title="Dashboard"/>

        </div>
      </div>
    </>
  )
}

export default Dashboard
