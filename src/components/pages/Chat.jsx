import React, { useState, useEffect, useRef } from 'react';
import { setTitle } from '../../assets/js/script';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getUserFromToken, getConvo, url, setRead } from '../../axios/api';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CCollapse } from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import Sidenav from '../partials/Sidenav';
import ModalCreatePost from '../partials/ModalCreatePost';
import ModalLoading from '../partials/ModalLoading';
import ModalComplete from '../partials/ModalComplete';
import Convo from '../partials/Convo';
import ModalChat from '../partials/ModalChat';

const Chat = (props) => {
    setTitle('Messages');
    let navigate = useNavigate();

    const socket = useRef();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const queryParameters = new URLSearchParams(window.location.search);
    const paramId = queryParameters.get("id");

    const [likeModal, setLikeModal] = useState(0);
    const [triggerSocket, setTriggerSocket] = useState(false);
    const [triggerProfile, setTriggerProfile] = useState(false);
    const [profileChat, setProfileChat] = useState({});

    const [isMobile, setIsMobile] = useState(
        window.matchMedia("(max-width: 680px)").matches
    );
    const [visible1, setVisible1] = useState(true);
    const [visible2, setVisible2] = useState(!isMobile);

    const [currentUser, setCurrentUser] = useState(undefined);

    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [newChatUser, setNewChatUser] = useState([]);

    const [user, setUser] = useState({});
    const {user_id, username, pic} = user;
    const authentication = async (token) =>{
        const response = await getUserFromToken({token: token});
        if(response.data.status == "success") {
            setUser(response.data.user);
            setCurrentUser(response.data.user);
        } else {
            navigate('/user/login');
        }
    }

    const [convos, setConvos] = useState([]);
    const getUserConvos = async (token) =>{
        const response = await getConvo({token: token, paramId: paramId});
        if(response.data.status == "success") {
            setConvos(response.data.chatUsers);
            setProfileChat(response.data.profileChat);
            setTriggerProfile(true);
        } else {
            navigate('/user/login');
        }
    }

    const changeCurrentChat = (convo, contact) => {
        setCurrentSelected(convo);
        setCurrentChat(contact);
        if(contact.isRead==false && convo!=""){
            handleSetRead(token, convo);
            const index = convos.findIndex(obj => {
                return obj.convo === convo;
            });
            convos[index].isRead = true;
        }
        if(isMobile){
            handleCollapse();
        }
    };

    const handleCollapse = () => {
        setVisible1(!visible1);
        setVisible2(!visible2);
    }

    const handleSetRead = async (token, convo) => {
        await setRead({token: token, convo: convo });
    }

    const handleNewChat = (userData) => {
        const convo = convos.filter(user =>{
            return user.user_id == userData.user_id
        });
        if(convo.length>0){
            changeCurrentChat(convo[0].convo, convo[0]);
        }else{
            const newConvo = [
                {
                    user_id: userData.user_id,
                    username: userData.username,
                    fname: userData.fname,
                    pic: userData.pic,
                    convo: "",
                    lastMessage: "",
                    lastDate: "",
                    lastSender: "",
                    isRead: false
                }
            ];
            setNewChatUser(newConvo);
            changeCurrentChat("", newConvo[0]);
        }
    }
    
    useEffect( () =>{
        authentication(token);
        getUserConvos(token);
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(url);
            socket.current.emit("add-user", currentUser.user_id);
            setTriggerSocket(true);
        }
    }, [currentUser]);
    
    useEffect(() => {
        if(Object.keys(profileChat).length > 0){
            handleNewChat(profileChat);
        }
    }, [triggerProfile]);

    return (
        <div>
            <Sidenav
                user_id={user_id}
                username={username}
                pic={pic}
                likeModal={likeModal}
                setLikeModal={setLikeModal} 
                theme={props.theme}
                setTheme={props.setTheme}
                page={"chat"}
            />
            <div className={`chat-body container-fuild container-fuild justify-content-center chat-page ${props.theme}`}>
                <ModalCreatePost
                    user_id={user_id}
                    username={username}
                    pic={pic}
                    page={"chat"}
                    theme={props.theme}
                />
                <button id="modalLoadingBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalLoading" hidden></button>
                <ModalComplete theme={props.theme}></ModalComplete>
                <button id="modalCompleteBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalComplete" hidden></button>
                <ModalLoading theme={props.theme}></ModalLoading>

                <div className='container-fuild p-0 m-0 d-flex h-100'>
                    <CCollapse id="collapseConvo" horizontal visible={visible1} >
                        <div className='d-flex flex-column border-end m-0 convo-con h-100'>
                            <div className='px-3 pt-4 pb-2 d-flex justify-content-between'>
                                <h4>{username}</h4>
                                <button 
                                className={`border-0 bg-transparent fs-5 p-0 ${props.theme=="dark"?"black-icon":"black-link"}`}
                                data-bs-toggle="modal" data-bs-target="#modalChat">
                                    <FontAwesomeIcon icon="fa-regular fa-pen-to-square"/>
                                </button>
                            </div>
                            <div className='px-3 pb-3 fw-bold'>Messages</div>
                            <div className='style-5 overflow-auto h-100 w-100'>
                                {
                                newChatUser.map((data)=>(
                                    <div
                                    key={data.user_id}
                                    className={`w-100 ${(data.convo === currentSelected) ? (props.theme=="dark"?"dark-selected":"light-selected") : ""}`}
                                    onClick={() => changeCurrentChat(data.convo, data)} 
                                    aria-expanded={visible1} aria-controls="collapseConvo" >
                                        <div className='d-flex convo w-100 m-0' style={{cursor: "pointer"}}>
                                            <div className='d-flex convo-head'>
                                                <img src={data.pic} className='rounded-circle border border-dark my-2' alt="" />
                                            </div>
                                            <div className='m-0 p-0 d-flex flex-column justify-content-center convo-body'>
                                                <div className='lastChat'>{data.fname}</div>
                                                <div className='d-flex'>
                                                    <div className='fw-light lastChat m-0 p-0' style={{fontSize:"13px"}}>{data.lastSender==user.user_id?"You: ":""}{data.lastMessage}</div>
                                                    <div className='fw-light m-0 p-0 pe-3' style={{fontSize:"13px"}}>&nbsp;{data.lastDate!=""?"•"+data.lastDate:""}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                }
                                {
                                convos.map((data)=>(
                                    <div
                                    key={data.user_id}
                                    className={`w-100 ${(data.convo === currentSelected) ? (props.theme=="dark"?"dark-selected":"light-selected") : ""}`}
                                    onClick={() => changeCurrentChat(data.convo, data)}
                                    aria-expanded={visible1} aria-controls="collapseConvo" >
                                        <div className='d-flex convo w-100 m-0' style={{cursor: "pointer"}}>
                                            <div className='d-flex convo-head'>
                                                <img src={data.pic} className='rounded-circle border border-dark my-2' alt="" />
                                            </div>
                                            <div className='m-0 p-0 d-flex flex-column justify-content-center convo-body'>
                                                <div className='lastChat'>{data.fname} {(data.isRead==false && data.user_id==data.lastSender)?"🔵":""}</div>
                                                <div className='d-flex'>
                                                    <div className='fw-light lastChat m-0 p-0' style={{fontSize:"13px"}}>{data.lastSender==user.user_id?"You: ":""}{data.lastMessage}</div>
                                                    <div className='fw-light m-0 p-0 pe-3' style={{fontSize:"13px"}}>&nbsp;{data.lastDate!=""?"•"+data.lastDate:""}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                        </div>
                    </CCollapse>
                    <CCollapse className='' id="collapseChat" horizontal visible={visible2}>
                        <div className='msg-body h-100'>
                            <Convo
                                user={user}
                                currentChat={currentChat}
                                setCurrentChat={setCurrentChat}
                                socket={socket}
                                getUserConvos={getUserConvos}
                                currentSelected={currentSelected}
                                setCurrentSelected={setCurrentSelected}
                                newChatUser={newChatUser}
                                setNewChatUser={setNewChatUser}
                                triggerSocket={triggerSocket}
                                theme={props.theme}
                                isMobile={isMobile}
                                handleCollapse={handleCollapse}
                                visible2={visible2}
                            />
                        </div>
                    </CCollapse>
                </div>
            </div>
            <ModalChat handleNewChat={handleNewChat} theme={props.theme} likeModal={likeModal} setLikeModal={setLikeModal} />
            <ToastContainer draggable={false}/>
        </div>
    )
}

export default Chat