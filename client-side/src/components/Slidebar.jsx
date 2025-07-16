import React, { useState, useEffect } from 'react';
import { RiHome3Line, RiMenu2Fill } from "react-icons/ri";
import { CiBookmarkCheck } from "react-icons/ci";
import { FaUserTie, FaSignOutAlt } from 'react-icons/fa';
import { RxCross1 } from "react-icons/rx";
import './Slidebar.css';
import { Link } from 'react-router-dom';
import { IoCarSport } from "react-icons/io5";

function Slidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const token = localStorage.getItem("token")
    const adminToken = localStorage.getItem("adminToken")

    

    const handleSlidebar = (event) => { 
        event.stopPropagation(); // Prevents immediate closing when clicking the button
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.slidebar') && !event.target.closest('.slidebar-btn')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    return (
        <>
            {/* Sidebar */}
            <div className={`slidebar ${isOpen ? 'open' : ''}`}>
                <ul className='slidebar-list'>
                    <li>
                    <Link to={"/"} className='icon'>    <RiHome3Line size={30}  /> <span className={isOpen ? 'visible' : 'hidden'}>Home</span></Link>
                    </li>
                    <li>
                    <Link to={"/bookings"} className='icon'>    <CiBookmarkCheck size={30}  /> <span className={isOpen ? 'visible' : 'hidden'}>Bookings</span></Link>
                    </li>
                    <li>
                    <Link to={"/profile"} className='icon'>    <FaUserTie size={30} className='icon' /> <span className={isOpen ? 'visible' : 'hidden'}>Profile</span></Link>
                    </li>
                    {adminToken ?
                        (
                    <li>
                    <Link to={"/managecar"} className='icon'>    <IoCarSport size={30} className='icon' /> <span className={isOpen ? 'visible' : 'hidden'}>Manage Car</span></Link>
                    </li>
                        ):
                            (null)}
                </ul>
                    <Link to={"/authuser"} className="logout-btn" >
                    <FaSignOutAlt size={30} className='icon'/> <span className={isOpen ? 'visible' : 'hidden'}>Logout</span>
                </Link>
                
            </div>

            {/* Toggle Button */}
            <div className={`slidebar-btn ${isOpen ? 'rotate' : ''}`} onClick={handleSlidebar}>
                {isOpen ? <RxCross1 size={30} /> : <RiMenu2Fill size={30} />}
            </div>
        </>
    );
}

export default Slidebar;
