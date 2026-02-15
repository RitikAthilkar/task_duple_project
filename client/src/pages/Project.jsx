import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Nav from '../components/Nav'
import { Select, Modal } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDate } from "../utility/Formatdate";
import { Pagination } from 'antd';
const Workspace = () => {
    const server = process.env.REACT_APP_SERVER
    const navigate = useNavigate()

    const location = useLocation()
    const workspaceId = location.state.id || ''


    const [menu, setMenu] = useState(false)
    const [menuId, setMenuId] = useState(null);
    const [form, setForm] = useState({ workspaceId: workspaceId })
    const [member, setmember] = useState([])
    const [project, setProject] = useState([])
    const [pagination, setPagintation] = useState({
        current: 1,
        total: 0,
        limit: 9,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: -1
    })
    const [modalbtn, setModalbtn] = useState(false);
   

  
    const getMembers = async () => {

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

                setmember(formattedMembers);
            }
        } catch (error) {
            alert(error.response.data.message)
        }
    }
    const getProject = async () => {

        try {
            const res = await axios.post(`${server}/fetch/project/?search=${form.search|| ''}&limit=${pagination.limit}&offset=${pagination.offset}&sortBy=${pagination.sortBy}&sortOrder=${pagination.sortOrder}`,{workspaceId:workspaceId}, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                setProject(res.data.data.list)
                setPagintation(prev => ({
                    ...prev,
                    total: res.data.data.paggination.totalCount
                }))
            }
          
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    const handleSearch = (e) => {
        setPagintation((prev)=>({
            ...prev,
            offset:0,current:1 
        }))
        getProject();
    }

    const handleEditChange = (id) => {
        const EditData = project?.filter((i) => i._id == id)[0]
        setForm(EditData)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }
    const handleSubmit = async (e ,id, projectId) => {
        e.preventDefault();
        if(id==1){
            try {
                const res = await axios.post(`${server}/admin/create/project`, form, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    getProject();
                    setModalbtn(false)
                    alert("Project created")
                    // console.log(res.data)
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)
            }
        } else if (id == 2) {

            try {
                const res = await axios.delete(`${server}/admin/delete/project/${projectId}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    getProject();
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)

            }
        }
       
    }

    useEffect(()=>{
         if(form.search==''){
            getProject();
         }
    },[form.search])
    useEffect(()=>{
        getProject();
    }, [, pagination.current, pagination.limit, pagination.offset])

    //Use Effect 
    useEffect(() => {
        getMembers();
        getProject();
    }, [])

    //utility functions

    return (
        <>
            <div className='grid grid-cols-9'>
                <SideBar />
                <div className='col-span-7'>
                    <Nav title="Manage Projects" />
                    <div className="grid grid-cols-12  m-3 gap-0">
                        <div className='col-span-12 flex justify-between items-center px-2 mb-3'>
                            <div>
                                <button onClick={() => { setModalbtn(true);setForm({
                                    workspaceId: workspaceId,
                                    name: '',
                                    description: '',
                                    members: [], 
                                    due_date:'',
                                    project_remark:''
                                }) }} className='bg-orange-500 text-white p-1 text-sm rounded-md hover:bg-orange-600 hover:text-white hover:border-0'><i class="bi bi-plus-circle me-2 "></i>Add Project</button>
                            </div>
                            <div className='flex '>
                            
                                <input name='search' onChange={handleChange} className='p-1  rounded-md text-sm  border-gray-300 focus:outline-0 focus:border-gray-100 border' placeholder='search project' />
                                <button onClick={handleSearch} className="p-2 rounded-md ms-1 bg-orange-500 text-white text-sm">Search</button>
                            </div>
                        </div>
                        {project && project.length!=0?project.reverse().map((item, index) => {
                            return (
                                <>
                                    <div className=" col-span-4 p-2  relative" key={item.id} >
                                        <div className='border rounded-xl shadow-sm p-4 px-5 cursor-pointer' onClick={() => { navigate(`/workspace/project/${item._id}`) }}>
                                            <div className=""> 
                                                <h2 className='text-base font-semibold capitalize'>{item.name}</h2>
                                                <h2 className='text-sm capitalize'>Due Date : {formatDate(item.due_date)}</h2>
                                            </div>
                                            <h2 className='text-sm capitalize'>Team : {item.members.length == 0 ? 'Not Assigned yet' : `${item.members.length} Members`}</h2>
                                        </div>
                                        <i className='bi-three-dots-vertical absolute top-4 right-4 cursor-pointer' onClick={() => {
                                            setMenuId(menuId === item._id ? null : item._id);
                                        }}></i>
                                        {menuId === item._id && (
                                            <>
                                                <ul className='flex justify-center items-center p-1 rounded-sm bg-gray-50 absolute  top-10 right-4 border w-[5vw]'>
                                                    <li>  <i className='bi-trash-fill text-red-500' onClick={(e) => { handleSubmit(e, 2, item._id) }}></i></li>
                                                    <li>  <i className='bi-pen-fill ms-3 text-blue-600' onClick={() => {
                                                        handleEditChange(item._id);
                                                        setModalbtn(true);
                                                    }}></i></li>
                                                </ul>
                                            </>
                                        )}
                                    </div>

                                </>
                            )
                        }):<>
                                <div className='col-span-12 border h-[30vh] flex flex-col justify-center items-center rounded-xl shadow'>
                                    <h2 className='text-base text-gray-600'>Project Not found</h2>
                                    <h2 className='text-base text-gray-600'>Add project to create and assign tasks</h2>

                                </div>
                        </>}
    
                    </div>
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.limit}
                        total={pagination.total}
                        onChange={(page, pageSize) => {
                            const offset = (page - 1) * pageSize;

                            setPagintation(prev => ({
                                ...prev,
                                current: page,
                                limit: pageSize,
                                offset
                            }));

                            // getProject();
                        }} defaultCurrent={1} />
                </div>
            </div>

            <Modal
                open={modalbtn}
                title="Create Project"
                onCancel={() => { setModalbtn(false) }}
                footer={null}
            >
                <form onSubmit={(e)=>{handleSubmit(e,1)}}>
                    {/* {JSON.stringify(form)} */}
                    <div className='grid grid-cols-12 gap-1'>
                        <div className="col-span-12">
                            <div className="flex flex-col ">
                                <label htmlFor="">Project Name</label>
                                <input type='text' name='name' id="" value={form?.name || ""} placeholder="Enter Name" className='text-base p-1 border border-gray-200' onChange={handleChange} required/>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="flex flex-col ">
                                <label htmlFor="">Description</label>
                                <input type='text' name='description' id="" value={form?.description || ""} placeholder="Enter Description " className='text-base p-1 border border-gray-200' onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="flex flex-col ">
                                <label htmlFor="">Assign Project Members</label>
                                <Select 
                                mode='multiple'
                                showSearch
                                placeholder="select members"
                                onChange={(val)=>setForm({...form,members:val})}
                                options={member}
                                 className=''
                                />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <div className="flex flex-col ">
                                <label htmlFor="">Project Due Date</label>
                                <input type='date' name='due_date' id="" value={form?.due_date || ""}  className='text-base p-1 border border-gray-200' onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <div className="flex flex-col ">
                                <label htmlFor="">Remark</label>
                                <input type='text' name='project_remark' id="" value={form?.project_remark || ""} placeholder="Give Remark (optional)" className='text-base p-1 border border-gray-200' onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="flex w-full justify-end  my-3">
                                <button type='submit' className='border border-orange-500 p-2 rounded-md  font-semibold' onCancel={() => { setModalbtn(false) }}>Cancel</button>
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
