import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getMessage, sendMessage, setRead } from "../../axios/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import iconlogo from '../../assets/img/circle-logo.png';
import Cookies from 'universal-cookie';


const Convo = (props) => {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const scrollRef = useRef();
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [isMobile, setIsMobile] = useState(
        window.matchMedia("(max-width: 680px)").matches
    );

    const handleGetMessage = async () => {
        const response = await getMessage({
            token: token, 
            convo: props.currentChat.convo
        });
        if(response.data.status == "success") {
            setMessages(response.data.allMessages);
        } else {
            navigate('/user/login');
        }
    }

    useEffect( () => {
        if(props.currentChat){
            handleGetMessage();
        }
    }, [props.currentChat]);

    const [inputMsg, setInputMsg] = useState("");
    const handleKeyDown =(e)=>{
        setInputMsg(e.target.value);
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
        e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
    }

    const handleSend = async (e) => {
        e.preventDefault();
        if(inputMsg.length > 0){
            const response = await sendMessage({
                token: token,
                recipient: props.currentChat.user_id,
                convo: props.currentChat.convo,
                message: inputMsg
            });

            if(response.data.status == "success") {
                setMessages(oldmsg => [...oldmsg, response.data.newChat]);
                props.socket.current.emit("send-msg", {
                    username: props.user.username,
                    fname: props.user.fname,
                    pic: props.user.pic,
                    from: response.data.newChat.sender,
                    to: response.data.newChat.recipient,
                    msg: response.data.newChat.message,
                    date: response.data.newChat.date,
                    convo: response.data.newChat.convo
                });

                setInputMsg("");
                if(props.currentChat.convo==""){
                    props.setNewChatUser([]);
                }
                await props.getUserConvos(token);
                if(props.currentChat.convo==""){
                    props.setCurrentSelected(response.data.newChat.convo);
                    props.setCurrentChat(prev => ({
                        // Retain the existing values
                        ...prev,
                        // update the firstName
                        convo: response.data.newChat.convo
                    }));
                }else{
                    props.setCurrentSelected(props.currentChat.convo);
                }
            } else {
                navigate('/user/login');
            }
        }
    }

    const handleSetRead = async (token, convo) => {
        await setRead({token: token, convo: convo });
    }

    useEffect(() => {
        if (props.socket.current) {
            props.socket.current.on("msg-recieve", (data) => {
                setArrivalMessage({
                    username: data.username,
                    fname: data.fname,
                    sender: data.from,
                    recipient: data.to, 
                    message: data.msg,
                    date: data.date,
                    convo: data.convo
                });
            });
        }
    }, [props.triggerSocket]);

    useEffect(() => {
        if(arrivalMessage !== null){
            if(props.currentChat!=undefined){
                if(props.currentChat.user_id === arrivalMessage.sender){
                    handleSetRead(token, arrivalMessage.convo)
                    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
                } else {
                    if(!isMobile){
                        toast(`${arrivalMessage.fname} has sent you a message`);
                    }
                }
            }

            props.getUserConvos(token);
            
            if(props.currentChat!=undefined){
                if(props.newChatUser.length>0){
                    if(props.newChatUser[0].user_id==arrivalMessage.sender){
                        props.setNewChatUser([]);  
                        if(props.currentChat.convo==""){
                            props.setCurrentSelected(arrivalMessage.convo);
                            props.setCurrentChat(prev => ({
                                // Retain the existing values
                                ...prev,
                                // update the firstName
                                convo: arrivalMessage.convo
                            }));
                        }else{
                            props.setCurrentSelected(props.currentChat.convo);
                        }
                    }else{
                        props.setCurrentSelected(props.currentChat.convo);
                    }
                }else{
                    props.setCurrentSelected(props.currentChat.convo);
                }
            }else{
                if(!isMobile){
                    toast(`${arrivalMessage.fname} has sent you a message`);
                }
            }
        }
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className='d-flex flex-column h-100'>
            {
            (props.currentSelected===undefined)?
            <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                <img className="rounded-circle border bg-white" src={iconlogo} alt="" width={100} height={100} />
                <div className="fs-5 mt-3">Your messages</div>
                <div className="fw-light">Send private messages to your friends and enjoy</div>
                <button className="btn btn-primary btn-sm mt-3 px-3 rounded rounded-3" data-bs-toggle="modal" data-bs-target="#modalChat">Send message</button>
            </div>
            :
            <div className='d-flex flex-column h-100'>
                <div className="border-bottom d-flex">
                    {
                    (props.isMobile)?
                    <div className="d-flex align-items-center justify-content-center ps-3 pt-2">
                        <button className={`border-0 bg-transparent fs-1 p-0 ${props.theme=="dark"?"black-icon":"black-link"}`}
                        onClick={()=>props.handleCollapse()} 
                        aria-expanded={props.visible2} aria-controls="collapseChat">
                            <FontAwesomeIcon icon="fa-solid fa-angle-left" />
                        </button>
                    </div>
                    :
                    <></>
                    }
                    {/* <Link to={`/user/profile?id=${props.currentChat.user_id}`} className="nav-link d-flex px-3 pb-2" style={{paddingTop: "14px"}}>
                        <img className="rounded-circle border border-dark bg-white me-3" src={props.currentChat.pic} alt="" style={{width: 50, height: 50}}/>
                        <div className='name-link d-flex align-items-center'>{props.currentChat.fname}</div>
                    </Link> */}
                    <div className="w-100 d-flex justify-content-between align-items-center pb-2 px-3" style={{paddingTop: "14px"}}>
                        <div className="d-flex">
                            <img className="rounded-circle border border-dark bg-white me-2" src={props.currentChat.pic} alt="" style={{width: 50, height: 50}}/>
                            <div className='d-flex align-items-center'>{props.currentChat.fname}</div>
                        </div>
                        <div className="dropdown">
                            <button className='border-0 bg-transparent' data-bs-toggle="dropdown">
                                <FontAwesomeIcon icon="fa-solid fa-ellipsis" className={`${props.theme} fs-3`} />
                            </button>
                            <ul className={`dropdown-menu dropdown-menu-end ${props.theme=="dark" ? "darker" : "lighter"}`}>
                                <li>
                                    <Link to={`/user/profile?id=${props.currentChat.user_id}`} className={`dropdown-item mb-0 nav-menu ${props.theme=="dark" ? "text-white" : ""}`}>View profile</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="style-5 overflow-auto h-100">
                    <div className="d-flex flex-column h-100 px-3">
                        <div className="d-flex flex-column justify-content-center align-items-center my-5">
                            <img className="rounded-circle border bg-white" src={props.currentChat.pic} alt="" height={100} width={100} />
                            <div className="fs-5 mt-2">{props.currentChat.fname}</div>
                            <div className="fw-light">{props.currentChat.username} • Kodegram</div>
                            <Link to={`/user/profile?id=${props.currentChat.user_id}`} className="btn btn-primary btn-sm mt-3 px-3 rounded rounded-3">View profile</Link>
                        </div>
                    {
                        messages.map((message) => {
                            return (
                                <div ref={scrollRef} key={uuidv4()} className={`${message.sender == props.user.user_id ? "align-self-end":"align-self-start"}`}>
                                    <div className="d-flex gap-2 mt-3">
                                        {message.sender == props.user.user_id?
                                        <img className="rounded-circle" style={{height: 30, width: 30}} src={props.user.pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} alt="" />
                                        :
                                        <img className="rounded-circle" style={{height: 30, width: 30}} src={props.currentChat.pic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"} alt="" />
                                        }
                                        <span className="py-1 px-2 bg-info rounded-3 chat-width" style={{wordWrap:"break-word"}}>{message.message}</span>
                                    </div>
                                    <div className={`d-flex ${message.sender == props.user.user_id ? "justify-content-end":"justify-content-start"}`}>
                                        <span className="fw-light py-1" style={{fontSize: 12}}>{message.date}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
                <div className="p-3">
                    <form className='d-flex align-items-start border rounded-4' onSubmit={(e) => handleSend(e)}>
                        <div className="d-flex rounded w-100">
                            <textarea
                                className={`style-5 border-0 comment-box col rounded-4 p-3 ${props.theme=="dark"?"darker":"lighter"}`} 
                                rows={1} id='message' name='message' 
                                placeholder='Send a message...' 
                                value={inputMsg} style={{resize: "none"}} 
                                onChange={(e)=>handleKeyDown(e)}>
                            </textarea>
                        </div>
                        {
                        (inputMsg!=="")?
                        <div className="d-flex align-self-stretch border-start">
                            <div className="d-flex align-items-center">
                                <button type="submit" className={`border-0 bg-transparent fw-semibold col-auto px-3 ${props.theme=="dark"?"text-white":""}`}>
                                    Send
                                </button>
                            </div>
                        </div>
                        :
                        <div></div>
                        }
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default Convo