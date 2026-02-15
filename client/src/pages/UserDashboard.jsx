import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Nav from '../components/Nav'
import TaskBoard from '../components/Taskboard'
import { Select, Modal } from 'antd';
import { formatDate } from "../utility/Formatdate";
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../global/AuthContex';
const Workspace = () => {
    const server = process.env.REACT_APP_SERVER
    const {user} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const userId = user._id
    const [menu, setMenu] = useState(false)
    const [form, setForm] = useState({ userid: userId })
    const [userData, setUserData] = useState([])
    const [availmember, setAvailmember] = useState([])
    const [project, setProject] = useState([])
    const [modalbtn, setModalbtn] = useState(false);



    const getUser = async () => {

        try {
            const res = await axios.post(`${server}/admin/fetch/user-details`, { id: user._id }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                setUserData(res.data.data)

            }
        } catch (error) {
            // alert(error.response.data.message)
        }
    }
    const getProject = async () => {

        try {
            const res = await axios.post(`${server}/fetch/user/project`, { userId: user._id }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                setProject(res.data.data)
                // console.log(res.data.data)
            }

        } catch (error) {
            // alert(error.response.data.message)
        }
    }


    //Use Effect 
    useEffect(() => {
        getUser();
        getProject();
        // getAvailableMembers();
    }, [])

    return (
        <>
            <div className='grid grid-cols-9'>
                <SideBar />
                <div className='col-span-7'>
                    <Nav title="Project Task Dashboard" />
                    <div className='p-3'>
                        {/* {JSON.stringify(user)} */}
                        {/* <div className='flex justify-end'>
                            <button onClick={(e) => { handleSubmit(e, 2) }} className='bg-red-500 text-white p-1 text-sm rounded-md hover:bg-orange-500 hover:text-white hover:border-0 mb-3 ms-2' >Remove From Project</button>
                        </div> */}

                        <div className='flex justify-between'>
                            <h2 className='text-xl font-semibold capitalize'>{userData?.name}</h2>
                            <h2 className='text-base capitalize'>Employee Id : {userData?.employee_id}</h2>
                        </div>

                        <div className='border shadow-sm my-2 p-4 rounded-xl'>
                            <div className='flex justify-between items-center border-b pb-2'> 
                            <h2 className='text-lg font-semibold'>Assigned Project </h2>
                            <h2 className='text-base '>Team : {project?.members?.length} Members </h2>
                            </div>

                            <table className='w-full mt-3'>
                                <thead>
                                    <tr className='text-left border-b '> 
                                        <th className='p-2 font-semibold'>Workaspace Name</th>       
                                        <th className='p-2 font-semibold'>Project Name</th>       
                                        <th className='p-2 font-semibold'>Due Date</th>       
                                   </tr>
                                </thead>
                                <tbody>             
                                    <tr>
                                        <td className='p-2'>{project?.workspaceId?.name}</td>
                                        <td className='p-2'>{project?.name}</td>
                                        <td className='p-2'>{formatDate(project?.due_date)}</td>            
                                    </tr>
                                </tbody>
                            </table>
                                    
                            
                        </div>
               
                        <div className=''>
                            <TaskBoard userId={userId} />
                        </div>


                    </div>

                </div>
            </div>
         

        </>
    )
}

export default Workspace
