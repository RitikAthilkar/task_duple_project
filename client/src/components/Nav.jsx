import React, {useState} from 'react'
import { Button, Modal } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../global/AuthContex';
const Nav = ({title}) => {
  const server = process.env.REACT_APP_SERVER
      const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({});
    const [workspacebtn, setWorkspacebtn] = useState(false);
    const {user} = useAuth()

  return (
    <>
      <div className='shadow p-3 m-2 h-15 rounded-xl'>
              <div className='flex justify-between relative'>
        
                <div>
                    <h2 className='text-xl'>{title}</h2>

                </div>
                <div className='flex items-center cursor-pointer' onClick={()=>{setOpen(!open)}}>
                  <div className='flex flex-col items-end'>
              <h2 className="text-base capitalize" >{user.name}</h2>
                  </div>
                  <i class="bi bi-person-circle ms-2 text-xl"></i>
                  <i class="bi bi-caret-down-fill text-gray-400 ms-1 text-xs"></i>
                </div>
                  {open && (
                      <div className="absolute top-6 right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">

                          <ul className="py-2 text-sm text-gray-700">

                              <li className="px-4 py-2 hover:bg-gray-100 capitalize">
                                 Role : {user.role}
                              </li>


                              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500" onClick={()=>{localStorage.removeItem("token");navigate('/login')}}>
                                  Logout
                              </li>

                          </ul>
                      </div>
                  )}

             </div>
          
              
 
      </div>
    </>
  )
}

export default Nav
