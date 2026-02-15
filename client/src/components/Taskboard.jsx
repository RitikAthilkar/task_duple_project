import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { Select, Modal } from 'antd';
import { useAuth } from "../global/AuthContex";
export default function TaskBoard({ userId, projectId }) {
    const server = process.env.REACT_APP_SERVER
    const {user} = useAuth()
    const [taskmodalbtn,setTaskModalbtn] = useState(false);
    const [form, setForm] = useState({ task_member:userId, projectId:projectId})
    const [memberTask, setmemberTask] = useState([])
    const [columns, setColumns] = useState({
        todo: { name: "To Do", items: [] },
        inprocess: { name: "In Progress", items: [] },
        completed: { name: "Completed", items: [] },
    });

    const formatTasks = (tasks) => {
        const kanban = { todo: { name: "To Do", items: [] }, inprocess: { name: "In Progress", items: [] }, completed: { name: "Completed", items: [] } };
        tasks.forEach((task) => {
            if (kanban[task.status]) {
                kanban[task.status].items.push({
                    id: task._id,
                    title: task.task_name,
                    description: task.task_description,
                    dueDate: task.task_due_date,
                    priority: task.task_priority,
                    status: task.status,
                });
            }
        });
        return kanban;
    };

    const getUserTask = async () => {
        try {
            const res = await axios.post(`${server}/fetch/user/task`, { userId }, {
                headers: { authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.data.success) setColumns(formatTasks(res.data.data));
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }
    const handleSubmit = async (e, id, task_id = null) => {
        e.preventDefault();

         if (id == 1) {
            try {
                const res = await axios.post(`${server}/admin/create/task`, form, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    setTaskModalbtn(false)
                    alert(res.data.message)
                    getUserTask();
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)
            }
        } else if (id == 2) {
            try {
                const res = await axios.delete(`${server}/admin/delete/task/${task_id}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                if (res.data.success) {
                    getUserTask();
                    alert(res.data.message)
                }
                console.log(res);
            } catch (error) {
                alert(error.response.data.message)
            }
        }
    }

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const sourceCol = columns[source.droppableId];
        const destCol = columns[destination.droppableId];
        const sourceItems = [...sourceCol.items];
        const destItems = [...destCol.items];
        const [movedTask] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, movedTask);
        const updatedColumns = { ...columns, [source.droppableId]: { ...sourceCol, items: sourceItems }, [destination.droppableId]: { ...destCol, items: destItems } };
        setColumns(updatedColumns);
        if (source.droppableId !== destination.droppableId) {
            try {
                await axios.put(`${server}/update/task/status`, { taskId: movedTask.id, status: destination.droppableId }, {
                    headers: { authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                getUserTask();
            } catch (error) {
                alert(error.response?.data?.message || error.message);
                setColumns(columns);
            }
        }
    };

    useEffect(() => {
        getUserTask();
    }, []);
    
    return (
        <>
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="text-center w-full my-4">
                <h1 className="text-lg font-semibold">Task Board</h1>
                
            </div>
            <div className="flex justify-center gap-5">
                {Object.entries(columns).map(([id, column]) => (
                    <Droppable droppableId={id} key={id}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className={`border ${column.name == 'To Do' ? 'border-red-400' : column.name == 'In Progress' ? 'border-blue-400' : 'border-green-400'   } p-3 w-64 min-h-[400px] rounded-xl`}>
                                <div className="flex justify-between">
                                <h3 className="font-semibold mb-3 border-b pb-2">{column.name}</h3>
                                {user.role !== 'user' && column.name == 'To Do' && <button onClick={()=>{setTaskModalbtn(true)}} className={`text-xs p-1 h-9 px-3 rounded bg-green-500 text-white font-semibold`}>Add Task</button>   }
                                </div>
                                {column.items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`text-white ${item.status == 'todo' ? 'bg-red-600' : item.status == 'inprocess' ? 'bg-blue-600' : 'bg-green-600'   } p-2 rounded shadow mb-2`}>
                          
                                                <div>
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-sm text-white ">{item.description}</p>
                                                    <p className="text-xs text-white ">Due Date : {new Date(item.dueDate).toLocaleDateString()} | {item.priority}</p>
                                                </div>
                                                {user.role !=='user' && (
                                                    <div>
                                                        <button onClick={() => {
                                                            setForm({
                                                                task_id: item.id,
                                                                task_name: item.title,
                                                                task_description: item.description,
                                                                task_due_date: new Date(item.dueDate).toISOString().split('T')[0],
                                                                task_priority: item.priority,
                                                                task_member: userId,
                                                                projectId: projectId
                                                            }); setTaskModalbtn(true)
                                                        }} className={`text-xs px-1 rounded bg-white text-orange-500 font-semibold`}>Edit</button>
                                                        <button onClick={(e) => { handleSubmit(e, 2, item.id) }} className={`text-xs px-1 rounded bg-white text-red-500 ms-2 font-semibold`}>Delete</button>
                                                    </div>
                                                )}
                                     
                                              
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
            <Modal
                open={taskmodalbtn}
                title={`Create Task`}
                onCancel={() => { setTaskModalbtn(false) }}
                footer={null}
            >
                <form onSubmit={(e) => { handleSubmit(e, 1) }}>
             
                    {/* {JSON.stringify(form)} */}
                    <div className='grid grid-cols-12 gap-1'>
                        <div className="col-span-12">
                            <div className="flex flex-col ">
                                <label htmlFor="">Task Heading</label>
                                <input type='text' name='task_name' value={form.task_name || ''} placeholder="Enter Name" className='text-base p-1 border border-gray-200' onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-span-12">
                            <div className="flex flex-col ">
                                <label htmlFor="">Task Description</label>
                                <input type='text' name='task_description' id="" value={form.task_description || ''} placeholder="Enter Description (optional)" className='text-base p-1 border border-gray-200' onChange={handleChange} required />
                            </div>
                        </div>
       
                        <div className="col-span-6">
                            <div className="flex flex-col ">
                                <label htmlFor="">Task Due Date</label>
                                <input type='date' name='task_due_date' id="" value={form.task_due_date || ''} placeholder="Enter Description (optional)" className='text-base p-1 border border-gray-200' onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="col-span-6">
                            <div className="flex flex-col ">
                                <label htmlFor="">Task priority</label>
                                <select className='text-base p-1 border border-gray-200' value={form.task_priority || ''} name="task_priority" onChange={handleChange} required>
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
    );
}
