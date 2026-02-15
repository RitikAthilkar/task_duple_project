import React, {useState} from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas';
import logo from '../assets/logo/logo-duple.svg'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../global/AuthContex';
import {Modal} from 'antd'
const SideBar = () => {
   const navigate = useNavigate()
   const {user} = useAuth()
   const [modal, setModalbtn] = useState(false)
   const options = [
    {id:2, name:"Manage Workspace"},
   ]
  return (
    <>
        

          <div className='relative col-span-2  min-h-screen border-r bg-gray-50'>
            <div className='w-full border-b flex justify-center p-3'>
                  <img src={logo} alt="logo" className='h-[35px]' onClick={()=>{navigate('/')}}/>
            </div>
            <div className=''>
                <ul className='p-3'>
                      {user.role=='admin'?<>
                         <li className='border bg-white p-2 text-base rounded-lg mt-2 cursor-pointer' onClick={() => { navigate('/') }}>Workspace</li>
                      </>:
                      <>
                      <li className='border bg-white p-2 text-base rounded-lg mt-2 cursor-pointer' onClick={() => { navigate('/') }}>Manage Project</li>
                      </>}
                </ul>
            </div>

            <div className='absolute bottom-0 p-3 border w-full '>
                  <div className='bg-orange-500  h-[20vh] rounded-xl p-2 flex flex-col justify-between items-center'>
                   <h2 className='text-white text-sm'>Contact for technical support </h2>
                                <button onClick={()=>{setModalbtn(true)}} className='bg-white p-2 rounded-lg text-sm'><i class="bi bi-headset"></i> Technical Support</button>
                </div>
            </div>
          </div>


              <Modal
                    open={modal}
                    title={` `}
                    onCancel={() => { setModalbtn(false) }}
                    footer={null}
              >
                  <div className='flex flex-col justify-center items-center'>
                            <h1 className='text-lg'>For technical support, please contact the developer.</h1>
                          <button className='bg-orange-500 text-white p-2 rounded-lg mt-3' onClick={() => { window.open(`https://wa.me/8623988058`, '_blank') }}>Contact Developer</button>
                  </div>
                
              </Modal>
    </>
  )
}

export default SideBar
