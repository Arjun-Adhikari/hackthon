import { NavLink } from "react-router-dom";

export default function Nav() {

    const logIn = false



    return (
        <>
            <nav className={`min-[815px]:hidden sidebar sticky top-0 z-30 shadow-md w-full  bg-white h-[10vh] `}>
                <div className={` px-3  flex items-center justify-between  `}>
                    <NavLink to=''>
                        <img src="/logo.png" alt="logo" className=" sm:w-[18vw]  sm:h-[10vh] w-[25vw] h-[10vh] " />
                    </NavLink>
                    <div>
                        <svg className={`ml-2 menu  `} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="34" height="34" viewBox="0 0 70 40">
                            <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
                        </svg>
                        <svg className={`ml-2 close  `} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="34" height="34" viewBox="0 0 24 24">
                            <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"></path>
                        </svg>
                    </div>
                    <div className={`absolute flex flex-col shadow-md shadow-gray-200  left-0 top-full text-create  overflow-scroll  w-full max-[425px]:w-full   h-fit  z-10  gap-10 bg-white `} >
                        <div className=" overflow-scroll overflow-x-hidden flex flex-col  grow gap-y-2 ">
                            <NavLink to="" className={({ isActive }) => `relative hover:opacity-85 mx-4  ${isActive ? `` : " opacity-70"}`}>
                                Home
                            </NavLink>
                            <div to="" className={`dropdown relative hover:opacity-85 w-full  flex flex-col `}>
                                <div className=" flex items-center justify-between">
                                    <p className="mx-4 group-even:font-medium ">Courses</p>
                                    <img src="/darrow.png" className={`w-5 h-5 mx-2  duration-500`} alt="" />
                                </div>
                            </div>
                            <NavLink
                                to="/mock"
                                className={({ isActive }) =>
                                    `relative hover:opacity-85 mx-4 ${isActive ? `` : " opacity-70"}`
                                }
                            >
                                Mock Test
                            </NavLink>
                            <NavLink
                                to="/notice"
                                className={({ isActive }) =>
                                    `relative hover:opacity-85 mx-4  ${isActive ? `` : " opacity-70"}`
                                }
                            >
                                Notice
                            </NavLink>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    `relative hover:opacity-85  mx-4 ${isActive ? `` : " opacity-70"}`
                                }
                            >
                                About Us
                            </NavLink>
                        </div>
                        <div className="  flex flex-col shrink-0   h-[20vh] ">
                            <h1 className="w-full h-[1.5px] bg-black opacity-10"></h1>
                            <NavLink to={'/login'} className='my-4 text-create font-medium opacity-50 mx-8' >Sign in</NavLink>
                            <NavLink to='/contact' className='mx-8 text-create font-medium opacity-50  ' >Contact</NavLink>
                        </div>
                    </div>
                </div>
            </nav >
            <nav className={` hidden top-0 z-30  bg-white shadow-md w-full min-[815px]:sticky min-[815px]:flex justify-around items-center px-10 py-2 gap-20 `}>
                <NavLink to=''>
                    <p className=" text-3xl font-semibold">Medico</p>
                </NavLink>
                <div className="flex flex-wrap items-center justify-center text-center gap-10">
                    <NavLink
                        to=""
                        className={({ isActive }) =>
                            `relative hover:opacity-85  ${isActive ? `before:content-[''] hover:opacity-100 before:absolute  before:left-0 before:right-0 before:bottom-[-5px] before:h-[2px] before:bg-secondary before:scale-x-125` : " opacity-70"}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/chat"
                        className={({ isActive }) =>
                            `relative hover:opacity-85  ${isActive ? `before:content-[''] hover:opacity-100 before:absolute  before:left-0 before:right-0 before:bottom-[-5px] before:h-[2px] before:bg-secondary before:scale-x-125` : " opacity-70"}`
                        }
                    >
                        Ai Chat
                    </NavLink>
                    <NavLink
                        to="/chat"
                        className={({ isActive }) =>
                            `relative hover:opacity-85  ${isActive ? `before:content-[''] hover:opacity-100 before:absolute  before:left-0 before:right-0 before:bottom-[-5px] before:h-[2px] before:bg-secondary before:scale-x-125` : " opacity-70"}`
                        }
                    >
                        Profile
                    </NavLink>
                    <NavLink
                        to="/chat"
                        className={({ isActive }) =>
                            `relative hover:opacity-85  ${isActive ? `before:content-[''] hover:opacity-100 before:absolute  before:left-0 before:right-0 before:bottom-[-5px] before:h-[2px] before:bg-secondary before:scale-x-125` : " opacity-70"}`
                        }
                    >
                        Appointment
                    </NavLink>

                </div>
                <div className="flex items-center gap-4">
                    {logIn ?
                        <div className="relative drop cursor-pointer" >
                            <div className=" ">
                                <img  src={logIn.photo} className="rounded-[50%] border-secondary border object-center object-cover  w-[50px] " alt="" />
                            </div>
                            <div className={`drop `}>
                                <div className=" flex flex-col w-[150px] opacity-100 my-2">
                                    <NavLink className='my-2 flex-col flex  items-start px-8 justify-center '
                                        to='/profile'>
                                        <span className="line-clamp-1 text-left">Profile</span>
                                    </NavLink>
                                    <NavLink className='my-2 flex-col flex items-start px-8  justify-center'>
                                        <span className="line-clamp-1 text-left ">Log Out</span>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        : < NavLink to={'/login'} className="outline-1 px-4 py-2 rounded-4xl min-w-fit cursor-pointer " > Sign in </NavLink>
                    }
                    {logIn ? <NavLink to='/contact'><img src="/contact.png" className="outline-1  px-2 py-2 rounded-[50%] bject-center object-cover l w-[50px] bg-secondary cursor-pointer text-white " /></NavLink> : <NavLink to='/contact'>
                        <button className="outline-1 px-4 py-2 rounded-4xl bg-secondary cursor-pointer text-white " >Contact</button>
                    </NavLink>}
                </div>
            </nav>
        </>
    );
}
