import React, { useState } from 'react'
import axios from 'axios'
import logo from '../assets/logo/logo-duple.svg'
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const [form, setForm] = useState({});
    const navigate = useNavigate()
    const server = process.env.REACT_APP_SERVER
        const [showpassword, setShowpassword] = useState(true)
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value,
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${server}/auth/register`, form)
            if (res.data.success) {
                navigate('/login')
            } else {
                alert(res.data.message)
            }
            console.log(res);
        } catch (error) {
            console.log(`Registration Error ${error}`)
        }
    }
    return (
        <>
            <div className='w-screen min-h-screen '>
                <div className='grid grid-cols-12 w-full  h-screen'>
                    <div className='col-span-12 lg:col-span-6  flex justify-center mt-[10vw]'>
                        <div>
                            <img src={logo} alt="logo" className='w-[20vw] mb-3' />
                            <h2 className='text-3xl sm:text-4xl font-bold'>Project Management System</h2>
                             {/* {JSON.stringify(form)} */}
                        </div>

                    </div>
                    <div className='col-span-12 lg:col-span-6   flex justify-center items-center '>
                        <form onSubmit={handleSubmit} >
                            <div className='bg-gradient-to-b from-orange-500 to-orange-600 p-3 rounded rounded-xl  shadow-2xl w-full sm:w-[30vw]'>
                                <div className='text-center '>
                                    <h2 className='text-xl font-bold text-white'>Registration</h2>
                                </div>
                                <div className="flex flex-col my-3">
                                    <label className='text-white text-sm font-semibold'>Select Role </label>
                                    <select name='role' className='text-sm p-1 border border-gray-200 rounded-md' onChange={handleChange}>
                                        <option selected disabled>select role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                                <div className="flex flex-col my-3">
                                    <label className='text-white text-sm font-semibold'>Full Name</label>
                                    <input type='text' name='name' placeholder="Enter Name" className='text-sm p-1 border border-gray-200 rounded-md' onChange={handleChange} />
                                </div>
                                <div className="flex flex-col my-3">
                                    <label className='text-white text-sm font-semibold'>Employee Id</label>
                                    <input type='text' name='employee_id' placeholder="Enter employee Id" className='text-sm p-1 border border-gray-200 rounded-md' onChange={handleChange} />
                                </div>
                                <div className="flex flex-col my-3">
                                    <label className='text-white text-sm font-semibold'>Email</label>
                                    <input type='email' name='email' placeholder="Enter Email" className='text-sm p-1 border border-gray-200 rounded-md' onChange={handleChange} />
                                </div>
                                <div className="flex flex-col my-3">
                                    <label className='text-white text-sm font-semibold'>Password</label>
                                    <div className='relative w-full'>
                                        <i className='bi bi-eye-fill absolute right-3 top-1 text-gray-500 cursor-pointer' onClick={() => setShowpassword(!showpassword)}></i>
                                        <input type={`${showpassword?'password':'text'}`} name='password' id="password" placeholder="Enter password" className='text-sm p-1 border border-gray-200 rounded-md w-full' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="flex flex-col my-3">
                                    {/* <h2 className='text-sm'>Login With Email</h2> */}
                                </div>
                                <div className="flex flex-col my-3">
                                    <button type='submit' className='bg-white p-1 rounded-xl text-orange-500 font-semibold'>Submit</button>
                                    <div className='text-center my-2'>
                                        <h2 className='text-sm text-white'>Already have an account? <span className='text-white font-semibold cursor-pointer' onClick={() => navigate('/login')}>Login</span></h2>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
