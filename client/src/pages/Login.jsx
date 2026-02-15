import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../global/AuthContex";
import logo from '../assets/logo/logo-duple.svg'
const Register = () => {
    const [form, setForm] = useState({});
    const navigate = useNavigate()
    const { setIsAuth, setUser } = useAuth();
    const [emailInput, setEmailinput] = useState(false)
    const [showpassword, setShowpassword] = useState(true)
    const server = process.env.REACT_APP_SERVER
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
            const res = await axios.post(`${server}/auth/login`, form)
            if (res.status == 200) {
                setIsAuth(true);
                setUser(res?.data.user);
                localStorage.setItem('token', res.data?.user?.token)
                navigate('/')
            }
            // console.log(res);
        } catch (error) {
            alert(error.response?.data?.message);
        }
    }
    return (
        <>
            <div className='w-screen min-h-screen'>
                <div className='grid grid-cols-12 w-full  h-screen'>
                    <div className='col-span-12 lg:col-span-6  flex justify-center  mt-[10vw]'>
                        <div>
                            <img src={logo} alt="logo" className='w-[20vw] mb-3' />
                            <h2 className='text-3xl sm:text-4xl font-bold'>Project Management System</h2>
                        </div>


                    </div>
                    <div className='col-span-12 lg:col-span-6  flex justify-center items-center '>
                        <form onSubmit={handleSubmit}>
                            <div className='bg-gradient-to-b from-orange-500 to-orange-600 p-3 rounded rounded-xl shadow-2xl w-full sm:w-[30vw]'>
                                <div className='text-center '>
                                    <h2 className='text-xl font-bold text-white'>Login</h2>
                                </div>

                                {!emailInput ? <>
                                    <div className="flex flex-col my-3">
                                        <label className='text-white text-sm font-semibold'>Employee Id</label>
                                        <input type='text' name='employee_id' id="userId" placeholder="Enter employee Id" className='text-sm p-1 border border-gray-200 rounded-md ' onChange={handleChange} />
                                    </div>
                                </> :
                                    <>

                                        <div className="flex flex-col my-3">
                                            <label className='text-white text-sm font-semibold'>Email</label>
                                            <input type='email' name='email' id="userId" placeholder="Enter Email" className='text-sm p-1 border border-gray-200 rounded-md' onChange={handleChange} />
                                        </div>
                                    </>}

                                <div className="flex flex-col my-3">
                                    <label className='text-white text-sm font-semibold'>Password</label>
                                    <div className='relative w-full'>
                                        <i className='bi bi-eye-fill absolute right-3 top-1 text-gray-500 cursor-pointer' onClick={() => setShowpassword(!showpassword)}></i>
                                        <input type={`${showpassword?'password':'text'}`} name='password' id="password" placeholder="Enter password" className='text-sm p-1 border border-gray-200 rounded-md w-full' onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="flex flex-col my-3">
                                    {!emailInput ? <>
                                        <h2 className='text-sm cursor-pointer text-white' onClick={() => { setEmailinput(true) }}>Login With Email</h2>
                                    </> :
                                        <>
                                            <h2 className='text-sm cursor-pointer text-white' onClick={() => { setEmailinput(false) }}>Login With Employee Id</h2>
                                        </>}
                                </div>
                                <div className="flex flex-col my-3">
                                    <button type='submit' className=' p-1 bg-white rounded-xl text-orange-500 font-semibold'>Submit</button>
                                    <div className='text-center my-2'>
                                        <h2 className='text-sm text-white'>Don't have an account? <span className='text-white font-semibold cursor-pointer' onClick={() => navigate('/register')}>Register</span></h2>
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
