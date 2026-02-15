import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Nav from '../components/Nav'
import { Select, Modal } from 'antd';
import { formatDate } from "../utility/Formatdate";
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
const Workspace = () => {
    const server = process.env.REACT_APP_SERVER
    const navigate = useNavigate()
    const location = useLocation()
    const projectId = useParams()

    const [menu, setMenu] = useState(false)
    const [form, setForm] = useState({ projectId: projectId })
    const [member, setmember] = useState([])
    const [memberTask, setmemberTask] = useState([])
    const [availmember, setAvailmember] = useState([])
    const [project, setProject] = useState([])
    const [projectTasks, setProjectTasks] = useState([])
    const [taskHistory, setTaskHistory] = useState([])
    const [modalbtn, setModalbtn] = useState(false);
    const [taskmodalbtn,setTaskModalbtn] = useState(false);

    const availableMember = [
        { value: "1", label: "Ritik" },
        { value: "2", label: "Rahul" },
        { value: "3", label: "Monika" },
        // {_id:"2", name:"Rahul"},
        // {_id:"3", name:"monika"}
    ]

    const getAvailableMembers = async () => {
        try {
            const res = await axios.post(`${server}/admin/fetch/user`, { status: 'available' }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                const formattedMembers = res.data.data.map((member) => ({
                    value: member._id,
                    label: member.name
                }));

                setAvailmember(formattedMembers);
            }
        } catch (error) {
            alert(error.response.data.message)
        }
    }
    const getMembers = async () => {

        try {
            const res = await axios.post(`${server}/admin/fetch/project/member`, { members: project.members }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {

                const formattedMembers = res.data.data.map((member) => ({
                    value: member._id,
                    label: member.name
                }));

                setmemberTask(formattedMembers)

                setmember(res.data.data)

            }
        } catch (error) {
            alert(error.response.data.message)
        }
    }
    const getProject = async () => {

        try {
            const res = await axios.post(`${server}/fetch/project/detail`, { projectId: projectId }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                setProject(res.data.data)
                // console.log(res.data.data)
            }

        } catch (error) {
            alert(error.response.data.message)
        }
    }
    const getTask = async () => {

        try {
            const res = await axios.post(`${server}/fetch/project/task`, { projectId: projectId }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                setProjectTasks(res.data.data)
                const todo = res.data.data.filter((task) => task.status === "todo");
                const inprocess = res.data.data.filter((task) => task.status === "inprocess");
                const completed = res.data.data.filter((task) => task.status === "completed");
                setTaskHistory({
                    todo: todo.length,
                    inprocess: inprocess.length,
                    completed: completed.length
                })
            }

        } catch (error) {
            alert(error.response.data.message)
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }
    const handleSubmit = async (e, id, memberid = null) => {
        e.preventDefault();

        if (id == 1) {
            try {
                const res = await axios.put(`${server}/admin/assigned-member`, form, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    setModalbtn(false)
                    getProject();
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)
            }
        } else if (id == 2) {

            try {
                const res = await axios.delete(`${server}/admin/delete/project/${projectId.id}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    // space for notification
                    navigate('/')
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)

            }
        }else if(id==3){
            try {
                const res = await axios.post(`${server}/admin/create/task`, form, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    setTaskModalbtn(false)
                    getProject();
                    alert(res.data.message)
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)
            }
        }else if(id==4){
            try {
                const res = await axios.put(`${server}/admin/remove-member`, {projectId:projectId.id,members:memberid}, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    getProject();
                    alert(res.data.message)
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)
            }
        }
    }

    //Use Effect 
    useEffect(() => {
        getProject();
        getAvailableMembers();
    }, [])
    useEffect(() => {
        if (project.length != 0) {
            getMembers();
            getTask();
        }
    }, [project])

    return (
        <>
            <div className='grid grid-cols-9'>
                <SideBar />
                <div className='col-span-7'>
                    <Nav title="Manage Projects" />
                    <div className='p-3'>

                 

                        <div className='flex justify-start'>
                            <h2 className='text-xl font-semibold capitalize'>{project.name}</h2>
                      
                        </div>
                        <h2 className='text-base capitalize'>{project.description}</h2>
                        <div className='border shadow-sm my-2 p-4 rounded-xl'>

                            <table className='w-full'>
                                <thead>
                                    <tr className='text-left border-b '>
                                        <th className='p-2 font-semibold'>Workaspace Name</th>
                                        <th className='p-2 font-semibold'>Due Date</th>
                                        <th className='p-2 font-semibold'>Total Members</th>
                                        <th className='p-2 font-semibold'>Total Task assigned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='p-2'>{project?.workspaceId?.name}</td>
                                        <td className='p-2'>{formatDate(project?.due_date)}</td>
                                        <td className='p-2'>{project?.members?.length}</td>
                                        <td className='p-2'>{projectTasks?.length}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                           <div className='border shadow-sm my-2 p-4 rounded-xl'>
                        
                                                    <table className='w-full'>
                                                        <thead>
                                                            <tr className='text-left border-b '>
                                                                <th className='p-2 font-semibold'>Total Task</th>
                                                                <th className='p-2 font-semibold'>Pending Task</th>
                                                                <th className='p-2 font-semibold'>In Process</th>
                                                               <th className='p-2 font-semibold'>Completed</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className='p-2'>{projectTasks?.length}</td>
                                                                <td className='p-2'>{taskHistory.todo}</td>
                                                                <td className='p-2'>{taskHistory.inprocess}</td>
                                                                <td className='p-2'>{taskHistory.completed }</td>
                                                         
                                                            </tr>
                                                        </tbody>
                                                    </table>
                        
                            </div>
                    
                        <div className='mt-5'>
                            <div className='flex justify-between'>
                            <h2 className='text-xl capitalize'>Members</h2>
                            <div>
                               <button onClick={() => { setModalbtn(true) }} className='border border-gray-300 bg-blue-500/10 text-blue-800 font-bold p-1 text-sm rounded-md hover:bg-blue-700 hover:text-white hover:border-0 mb-3'><i class="bi bi-plus-circle me-2 "></i>Add Member</button>
                                <button onClick={() => { setTaskModalbtn(true) }} className='border border-gray-300 p-1 px-2 text-sm rounded-md bg-black text-white hover:text-white hover:border-0 mb-3 ms-2'><i class="bi bi-plus-circle me-2 "></i>Create Task</button>
                            </div>
                            </div>
                                <p className='text-red-600 text-xs '>*To view and edit assigned tasks click on the view task button on member card</p>
                            <div className="grid grid-cols-12  m-3 gap-0">

                                {member.map((item, index) => {
                                    return (
                                        <>
                                            <div className=" col-span-4  cursor-pointer relative" key={item.id} >
                                                <div className='border rounded-xl shadow-sm p-4 '>
                                                    <div className="">
                                                        <h2 className='text-lg capitalize'>{item.name}</h2>
                                                        <div className='flex my-2'>
                                                            <button onClick={() => { navigate(`/user`,{state:{projectId:projectId,userId:item._id}}) }} className='text-xs capitalize bg-green-500 text-white p-1 rounded-sm'>View Task</button>
                                                            <button onClick={(e) => { handleSubmit(e, 4, item._id) }}  className='text-xs capitalize border border-red-500  text-red-500 p-1 rounded-sm ms-2'>Remove From Project </button>
                                                        </div>
                                                    </div>

                                                </div>
                                                {/* <i className='bi-three-dots-vertical absolute top-4 right-4' onClick={() => { setMenu(!menu) }}></i>
                                                        {menu && (
                                                            <>
                                                                <ul className='flex justify-center items-center p-1 rounded-sm bg-gray-50 absolute  top-10 right-4 border w-[5vw]'>
                                                                    <li>  <i className='bi-trash-fill text-red-500' onClick={() => { setMenu(!menu) }}></i></li>
                                                                    <li>  <i className='bi-pen-fill ms-3 text-blue-600' onClick={() => { setMenu(!menu) }}></i></li>
                                                                </ul>
                                                            </>
                                                        )} */}
                                            </div>

                                        </>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='flex justify-between items-center mt-5 border-t pt-3'>
                            <p className='text-red-600 text-xs '>*Please note once deleted cannot be undone </p>
                            <button onClick={(e) => { handleSubmit(e, 2) }} className='bg-red-500 text-white p-1 text-sm rounded-md hover:bg-orange-500 hover:text-white hover:border-0 mb-3 ms-2' >Delete Project</button>
                        </div>
                    </div>
                   
                </div>
            </div>

            {/* add member modal */}
            <Modal
                open={modalbtn}
                title="Add Member "
                onCancel={() => { setModalbtn(false) }}
                footer={null}
            >
                <form onSubmit={(e) => { handleSubmit(e, 1) }}>

                    <div className='grid grid-cols-12 gap-1'>
                        <div className="col-span-12">
                            <div className="flex flex-col ">
                                <label htmlFor="">Assign Project Members</label>
                                <Select
                                    mode='multiple'
                                    showSearch
                                    placeholder="select members"
                                    onChange={(val) => setForm({ ...form, members: val })}
                                    options={availmember}
                                    className=''

                                />
                            </div>
                        </div>

                        <div className="col-span-12">
                            <div className="flex w-full justify-end  my-3">
                                <button type='button' className='border border-orange-500 p-2 rounded-md  font-semibold' onCancel={() => { setModalbtn(false) }}>Cancel</button>
                                <button type='submit' className='bg-orange-500 p-2 rounded-md text-white font-semibold ms-2'>Submit</button>
                            </div>
                        </div>
                    </div>



                </form>
            </Modal>

            {/* task modal */}
            <Modal
                open={taskmodalbtn}
                title="Create Task"
                onCancel={() => { setTaskModalbtn(false) }}
                footer={null}
            >
                <form onSubmit={(e) => { handleSubmit(e, 3) }}>
                    {/* {JSON.stringify(projectId)}
                    {JSON.stringify(form)} */}
                    <div className='grid grid-cols-12 gap-1'>
                        <div className="col-span-12">
                            <div className="flex flex-col ">
                                <label htmlFor="">Task Heading</label>
                                <input type='text' name='task_name' id="" placeholder="Enter Name" className='text-base p-1 border border-gray-200' onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="flex flex-col ">
                                <label htmlFor="">Task Description</label>
                                <input type='text' name='task_description' id="" placeholder="Enter Description (optional)" className='text-base p-1 border border-gray-200' onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="flex flex-col ">
                                <label htmlFor="">Assign Task To</label>
                                <Select
                                   
                                    showSearch
                                    placeholder="select members"
                                    onChange={(val) => setForm({ ...form, task_member: val })}
                                    options={memberTask}
                                    className=''
                                />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <div className="flex flex-col ">
                                <label htmlFor="">Task Due Date</label>
                                <input type='date' name='task_due_date' id="" placeholder="Enter Description (optional)" className='text-base p-1 border border-gray-200' onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <div className="flex flex-col ">
                                <label htmlFor="">Task priority</label>
                                <select className='text-base p-1 border border-gray-200' name="task_priority" onChange={handleChange} requiredg>
                                    <option>select priority</option>
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                 </select>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="flex w-full justify-end  my-3">
                                <button type='submit' className='border border-orange-500 p-2 rounded-md  font-semibold' onCancel={() => { setTaskModalbtn(false) }}>Cancel</button>
                                <button type='submit' className='bg-orange-500 p-2 rounded-md text-white font-semibold ms-2'>Submit</button>
                            </div>
                        </div>
                    </div>



                </form>
            </Modal>
        </>
    )
}

export default Workspace
