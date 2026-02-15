import React, { useState } from 'react'

const Workspace = () => {
    const [menu, setMenu] = useState(false)
    const workspace = [
        { id: 1, name: "Duple Work Space", des: "created for interview" },
        { id: 2, name: "Duple Work Space", des: "created for interview" },
        { id: 3, name: "Duple Work Space", des: "created for interview" },
        { id: 4, name: "Duple Work Space", des: "created for interview" },
        { id: 5, name: "Duple Work Space", des: "created for interview" },
        { id: 6, name: "Duple Work Space", des: "created for interview" },
    ]
    return (
        <>
            <div className="grid grid-cols-12  m-3 gap-0">
                <div className='col-span-12 flex justify-end'>
                    <div className='flex '>
                    <input className='p-1  rounded-md text-sm  border-gray-300 focus:outline-0 focus:border-gray-100 border' placeholder='search workspace'/>
                        <button className="p-2 rounded-md ms-1 bg-orange-500 text-white text-sm">Search</button>
                    </div>
                </div>
                {workspace.map((item, index) => {
                    return (
                        <>
                            <div className=" col-span-4 p-3 cursor-pointer relative" key={item.id}>
                                <div className='border rounded-xl shadow-sm p-4'>
                                    <h2 className='text-base'>{item.name}</h2>
                                    <p className='text-sm'>{item.des}</p>
                                </div>
                                <i className='bi-three-dots-vertical absolute top-4 right-4' onClick={() => { setMenu(!menu)}}></i>
                                 {menu && (
                                    <>
                                        <ul className='flex justify-center items-center p-1 rounded-sm bg-gray-50 absolute  top-10 right-4 border w-[5vw]'>
                                            <li>  <i className='bi-trash-fill text-red-500' onClick={() => { setMenu(!menu) }}></i></li>
                                            <li>  <i className='bi-pen-fill ms-3 text-blue-600' onClick={() => { setMenu(!menu) }}></i></li>
                                       </ul>
                                    </>
                                 )}
                            </div>

                        </>
                    )
                })}

            </div>

        </>
    )
}

export default Workspace
