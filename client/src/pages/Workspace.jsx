import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Nav from '../components/Nav'
import { Button, Descriptions, Modal, Pagination } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utility/Formatdate'
const Workspace = () => {
    const server = process.env.REACT_APP_SERVER
    const navigate = useNavigate()
    const [menuId, setMenuId] = useState(null);
    const [form, setForm] = useState({})
    const [search, setSearch] = useState('')

    const [workspace, setWorkspace] = useState([])
    const [pagination, setPagintation] = useState({
        total: 0,
        limit: 9,
        offset: 0,
        current: 1
    })
    const [workspacebtn, setWorkspacebtn] = useState(false);
    const [Edit, setEdit] = useState(false);

    // const workspace = [
    //     { id: 1, name: "Duple Work Space", des: "created for interview" },
    //     { id: 2, name: "Duple Work Space", des: "created for interview" },
    //     { id: 3, name: "Duple Work Space", des: "created for interview" },
    //     { id: 4, name: "Duple Work Space", des: "created for interview" },
    //     { id: 5, name: "Duple Work Space", des: "created for interview" },
    //     { id: 6, name: "Duple Work Space", des: "created for interview" },
    // ]
    useEffect(() => {
        if (form.search == '') {
            getWorkspace();
        }
    }, [form.search])

    const getWorkspace = async () => {
        console.log("get workspace called", pagination);
        try {
            const res = await axios.get(`${server}/fetch/workspace?search=${form.search || ''}&limit=${pagination.limit || 10}&offset=${pagination.offset || 0}&sortBy=${pagination.sortBy || 'createdAt'}&sortOrder=${pagination.sortOrder || -1}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                setWorkspace(res.data.data.list)
                setPagintation(prev => ({
                    ...prev,
                    total: res.data?.data.paggination?.totalCount || 0,
                    limit: pagination.limit,
                    offset: pagination.offset
                }))
            }
            console.log(res);
        } catch (error) {
            alert(error.response.data.message)
        }
    }
    const handleEditChange = (id) => {
        const EditData = workspace?.filter((i) => i._id == id)[0]
        setForm(EditData)
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }
    const handleSearch = (e) => {
        setPagintation(prev => ({
            ...prev,
            current: 1,
            offset: 0
        }))
        getWorkspace()
    }
    const handleSubmit = async (e, id, workspaceId) => {
        e.preventDefault();

        if (id == 1) {
            try {
                const res = await axios.post(`${server}/admin/create/workspace`, form, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    getWorkspace();
                    setWorkspacebtn(false)
                    setEdit(false)
                    alert(res.data.message)
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)
            }
        } else if (id == 2) {
            try {
                const res = await axios.delete(`${server}/admin/delete/workspace/${workspaceId}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    getWorkspace();
                    setWorkspacebtn(false)
                    setEdit(false)
                    alert("work space Deleted")
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)
            }
        }

    }

    //Use Effect 
    // useEffect(() => {
    //     getWorkspace();
    // }, [])
    useEffect(() => {

        getWorkspace();
    }, [pagination.current, pagination.limit, pagination.offset])
    return (
        <>
            <div className='grid grid-cols-9'>
                <SideBar />
                <div className='col-span-7'>
                    <Nav title="Workspace" />
                    <div className="grid grid-cols-12  m-3 gap-0">
                        <div className='col-span-12 flex justify-between items-center px-2 mb-3'>
                            <div>
                                <button onClick={() => {
                                    setWorkspacebtn(true);
                                    setEdit(false);
                                    setForm({ name: "", Description: "" });
                                }} className='bg-orange-500 text-white p-1 text-sm rounded-md hover:bg-orange-600 hover:text-white hover:border-0'><i class="bi bi-plus-circle me-2 "></i>Add Workspace</button>
                            </div>
                            <div className='flex '>
                                <input onChange={handleChange} name="search" value={form.search || ''} className='p-1  rounded-md text-sm  border-gray-300 focus:outline-0 focus:border-gray-100 border' placeholder='search workspace' />
                                <button onClick={handleSearch} className="p-2 rounded-md ms-1 bg-orange-500 text-white text-sm">Search</button>
                            </div>
                        </div>
                        {workspace.length != 0 ? workspace.reverse().map((item, index) => {
                            return (
                                <>
                                    <div className=" col-span-4 p-2  relative " key={item.id} >
                                        <div className='border rounded-xl shadow-md p-4 cursor-pointer' onClick={() => { navigate('/workspace/project', { state: { id: item._id } }) }}>
                                            <h2 className='text-base font-semibold capitalize'>{item.name} </h2>
                                            <p className='text-sm'>{item.des}</p>
                                            <p className='text-sm'>created on : {formatDate(item.createdAt)}</p>
                                        </div>
                                        <i
                                            className='bi-three-dots-vertical absolute top-4 right-4 cursor-pointer'
                                            onClick={() => {
                                                setMenuId(menuId === item._id ? null : item._id);
                                            }}
                                        ></i>

                                        {menuId === item._id && (
                                            <ul className='flex justify-center items-center p-1 rounded-sm bg-gray-50 absolute top-10 right-4 border w-[5vw]'>

                                                <li>
                                                    <i className='bi-trash-fill text-red-500' onClick={(e) => { handleSubmit(e, 2, item._id) }}></i>
                                                </li>

                                                <li>
                                                    <i
                                                        className='bi-pen-fill ms-3 text-blue-600'
                                                        onClick={() => {
                                                            handleEditChange(item._id);

                                                            setWorkspacebtn(true);
                                                        }}
                                                    ></i>
                                                </li>

                                            </ul>
                                        )}

                                    </div>

                                </>
                            )
                        }) : <>
                            <div className='col-span-12 border h-[30vh] flex flex-col justify-center items-center rounded-xl shadow'>
                                <h2 className='text-base text-gray-600'>Workspace Not found</h2>
                                <h2 className='text-base text-gray-600'>create workspace to add projects</h2>

                            </div>
                        </>
                        }

                    </div>
                    {/* {console.log(pagination)} */}
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

                            // getWorkspace();
                        }} defaultCurrent={1} />
                </div>
            </div>

            <Modal
                open={workspacebtn}
                title={`${Edit ? "Update Workspace" : 'Create Workspace'}`}
                onCancel={() => { setWorkspacebtn(false) }}
                footer={null}
            >

                <form onSubmit={(e) => { handleSubmit(e, 1) }}>
                    <div className="flex flex-col my-3">
                        <label>Workspace Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            className="text-base p-1 border border-gray-200"
                            value={form?.name || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex flex-col my-3">
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Enter Description (optional)"
                            className="text-base p-1 border border-gray-200"
                            value={form?.description || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex w-full justify-end  my-3">
                        <button type='button' className='border border-orange-500 p-2 rounded-md  font-semibold' onCancel={() => { setWorkspacebtn(false) }}>Cancel</button>
                        <button type='submit' className='bg-orange-500 p-2 rounded-md text-white font-semibold ms-2'>Submit</button>
                    </div>
                </form>






            </Modal>
        </>
    )
}

export default Workspace
