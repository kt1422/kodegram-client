import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import iconlogo from '../../assets/img/circle-logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalLogout from './ModalLogout';
import ModalSearch from './ModalSearch';

const Sidenav = (props) => {
    let chatPage = "";
    try {
        chatPage = props.page;
    } catch (error) {
        //not chat page
    }

    const handleThemeToggle = () => {
        const theme = props.theme == "light" ? "dark" : "light";
        const cookies = new Cookies();
        cookies.set('theme', theme, { path: '/' });
        props.setTheme(theme);
    };
    return (
        <div>
            <ModalLogout theme={props.theme}></ModalLogout>
            <ModalSearch
                profile_id={props.profile_id}
                follow={props.follow}
                loadNumbers={props.loadNumbers}
                loadProfile={props.loadProfile}
                likeModal={props.likeModal}
                setLikeModal={props.setLikeModal}
                theme={props.theme}
            />
            <div className={`sidenav ${props.theme} ${chatPage}`}>
                <div className="sidenav-header">
                    <Link to={"/home"} className="d-flex nav-link">
                        <div className='con1 mb-1'>
                            <img className="logo my-1 me-3" src={iconlogo} alt="Instagram" />
                        </div>
                        <div className='con2 d-flex align-items-center pt-1'>
                            <span className="kode fs-2 fw-semibold billabong">Kodegram</span>
                        </div>
                    </Link>
                </div>
                <nav>
                    <ul className="nav-list ps-0">
                        <li className="nav-item">
                            <Link to={"/home"} className="nav-link">
                            <FontAwesomeIcon icon="fa-solid fa-home" className="nav-icon" />
                            <span className="nav-label">Home</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/user/chat"} className="nav-link">
                            <FontAwesomeIcon icon="fa-solid fa-message" className="nav-icon" />
                            <span className="nav-label">Messages</span>
                            </Link>
                        </li>
                        <li className="nav-item hide-icon">
                            <Link className="nav-link">
                            <FontAwesomeIcon icon="fa-solid fa-heart" className="nav-icon" />
                            <span className="nav-label">Notifications</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link data-bs-toggle="modal" data-bs-target="#createPostModal" className="nav-link">
                            <FontAwesomeIcon icon="fa-solid fa-plus-square" className="nav-icon" />
                            <span className="nav-label">Create</span>
                            </Link>
                        </li>
                        <li className="nav-item hide-icon">
                            <Link to={`/user/profile?id=${props.user_id}`} className="nav-link" reloadDocument>
                            <FontAwesomeIcon icon="fa-solid fa-user-circle" className="nav-icon" />
                            <span className="nav-label">Profile</span>
                            </Link>
                        </li>
                        <li className="nav-item hide-icon">
                            <Link to={"/user/aboutus"} className="nav-link">
                            <FontAwesomeIcon icon="fa-solid fa-question-circle" className="nav-icon" />
                            <span className="nav-label">About Us</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link data-bs-toggle="modal" data-bs-target="#modalSearch" className="nav-link">
                            <FontAwesomeIcon icon="fa-solid fa-search" className="nav-icon" />
                            <span className="nav-label">Search</span>
                            </Link>
                        </li>
                        <li className="nav-item hide-icon">
                            <button className={`nav-link border-0 bg-transparent`} onClick={handleThemeToggle}>
                            <FontAwesomeIcon icon={props.theme=="dark" ? "fa-solid fa-moon" : "fa-solid fa-sun"} className="nav-icon" />
                            <span className="nav-label">Switch Theme</span>
                            </button>
                        </li>
                        <li className="nav-item dropdown dropup pfp">
                            <a className="nav-link dropdown-toggle pff" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img className="rounded-circle border border-dark bg-white me-2" src={props.pic} alt="" style={{width: 25, height: 25}}/>
                                <span className="nav-label"> {props.username} </span>
                            </a>
                            <ul className={`dropdown-menu ${props.theme=="dark" ? "darker" : "lighter"}`}>
                                <li>
                                    <Link to={`/user/profile?id=${props.user_id}`} className={`dropdown-item nav-menu ${props.theme=="dark" ? "text-white" : ""}`} reloadDocument>Profile</Link>
                                </li>
                                <li>
                                    <Link to={"/user/aboutus"} className={`dropdown-item nav-menu ${props.theme=="dark" ? "text-white" : ""}`}>About Us</Link>
                                </li>
                                <li>
                                    <Link className={`dropdown-item nav-menu ${props.theme=="dark" ? "text-white" : ""}`} onClick={handleThemeToggle}>Switch Theme</Link>
                                </li>
                                <li>
                                    <Link to={"/user/settings"} className={`dropdown-item nav-menu ${props.theme=="dark" ? "text-white" : ""}`}>Settings</Link>
                                </li>
                                <li>
                                    <Link className={`dropdown-item nav-menu ${props.theme=="dark" ? "text-white" : ""}`} data-bs-toggle="modal" data-bs-target="#exampleModal4">Log out</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Sidenav