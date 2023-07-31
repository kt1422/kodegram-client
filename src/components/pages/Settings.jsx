import React, { useState, useEffect} from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";
import { setTitle } from '../../assets/js/script';
import { getUserFromToken, updateUser, updatePass } from '../../axios/api';
import Sidenav from '../partials/Sidenav';
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { v4 } from "uuid";
import ModalCreatePost from '../partials/ModalCreatePost';
import ModalLoading from '../partials/ModalLoading';
import ModalComplete from '../partials/ModalComplete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = (props) => {
    setTitle('Settings');
    let navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const [likeModal, setLikeModal] = useState(0);

    const [user, setUser] = useState({});
    const {user_id, username, pic} = user;

    const [userpic, setUserpic] = useState("");
    const [userfname, setUserFname] = useState("");
    const [userusername, setUserUsername] = useState("");
    const [userbio, setUserbio] = useState("");

    const [file, setFile] = useState(undefined);
    const [isPicChange, setIsPicChange] = useState(false);
    const [upload, setUpload] = useState("");
    const [triggerSave, setTriggerSave] = useState(0);

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const loadNavnVerify = async (getToken) =>{
        const response = await getUserFromToken({token: getToken});
        if(response.data.status == "success") {
            setUser(response.data.user);
            setUserpic(response.data.user.pic);
            setUserFname(response.data.user.fname);
            setUserUsername(response.data.user.username);
            setUserbio(response.data.user.bio);
        } else {
            navigate('/user/login');
        }
    }

    useEffect( () =>{
        if(token){
            loadNavnVerify(token);
        }else{
            navigate('/user/login');
        }
    }, []);

    const handlePic = (file) =>{
        if(file.length>0){
            const getUrl = URL.createObjectURL(file[0]);
            setUserpic(getUrl);
            setIsPicChange(true);
            setFile(file[0]);
        }
    }

    const handleUpdate = async (e) =>{
        e.preventDefault();
        if(isPicChange){
            const imageRef = ref(storage, `images/${file.name + v4()}`);
            uploadBytes(imageRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    setUpload(url);
                });
            });
        }else{
            setUpload(userpic);
        }
        // setTriggerSave(triggerSave+1);
    }

    const handleSave = async () => {
        const response = await updateUser({
            token: token,
            pic: upload,
            fname: userfname,
            username: userusername,
            bio: userbio
        });
        if(response.data.status == "success") {
            navigate(0);
        }else if(response.data.status == "failed") {
            toast.error(response.data.message);
        }else{
            navigate('/user/login');
        }
    }

    useEffect( () =>{
        if(upload){
            handleSave();
        }
    }, [upload]);

    const handleChangePass = async (e) => {
        e.preventDefault();
        if(newPass!=confirmPass){
            toast.error("Invalid! Please make sure both passwords match.");
        }else if(newPass.length<8){
            toast.error("Invalid length! Password must be at least 8 characters.");
        }else{
            const response = await updatePass({token: token, newPass: newPass, oldPass: oldPass});
            if(response.data.status == "success") {
                cookies.remove('userToken');
                toast.success("You have successfuly update your account! You'll be logged out in few seconds. Please re-login again.");
                setTimeout(() => {
                    cookies.remove('userToken');
                    navigate('/user/login');
                }, 5000);
            }else if(response.data.status == "failed"){
                toast.error(response.data.message);
            }else{
                cookies.remove('userToken');
                toast.error("Sorry, your login session has expired. Please log in again.");
                setTimeout(() => {
                    cookies.remove('userToken');
                    navigate('/user/login');
                }, 5000);
            }
        }
    }

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
            />
            <div className={`container-fuild justify-content-center ${props.theme} pb-5`} style={{minHeight: "100vh"}}>
                <ModalCreatePost
                    user_id={user_id}
                    username={username}
                    pic={pic}
                    page={"settings"}
                    theme={props.theme}
                />
                <button id="modalLoadingBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalLoading" hidden></button>
                <ModalComplete theme={props.theme}></ModalComplete>
                <button id="modalCompleteBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalComplete" hidden></button>
                <ModalLoading theme={props.theme}></ModalLoading>
                
                <div className="home d-flex flex-column flex-lg-row justify-content-center align-items-start pt-4 px-3 pb-5">
                    <div className="setbtn nav flex-row flex-lg-column gap-3 nav-pills mb-3 me-4 col-auto col-lg-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <button className="nav-link active" id="profile-tab" data-bs-toggle="pill" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">Edit Profile</button>
                        <button className="nav-link" id="password-tab" data-bs-toggle="pill" data-bs-target="#password" type="button" role="tab" aria-controls="password" aria-selected="false">Change Password</button>
                    </div>
                    <div className="tab-content border rounded p-4 col-12 col-lg-8" id="v-pills-tabContent">
                        <div className="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                            <h3 className='mb-4'>Edit Profile</h3>
                            <form action="" onSubmit={(e)=>handleUpdate(e)}>
                                <div className="d-flex flex-row w-100 justify-content-center mb-4 gap-4">
                                    <div className="">
                                        <img src={userpic} className="rounded-circle img-thumbnail" alt="" style={{width: 150, height: 150}} />
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                        <p className='fs-5 mt-2'>{username}</p>
                                        <input id='chooseAvatar' type='file' accept="image/png, image/jpeg" onChange={(e) => handlePic(e.target.files)} hidden/>
                                        <button type="button" className="btn btn-primary btn-sm" onClick={()=>document.getElementById('chooseAvatar').click()}>Change photo</button>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="fname" className="form-label">Name</label>
                                    <input type="text" id='fname' className={`form-control ${props.theme}`} value={userfname} onChange={(e)=>{setUserFname(e.target.value)}} required/>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" id='username' className={`form-control ${props.theme}`} value={userusername} onChange={(e)=>{setUserUsername(e.target.value)}} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">Bio</label>
                                    <textarea id="bio" className={`form-control ${props.theme}`}  rows="5" value={userbio} onChange={(e)=>{setUserbio(e.target.value)}}></textarea>
                                </div>
                                <div className="row float-end">
                                    <div className="form-group">
                                        <button type="submit" className='btn btn-primary'>&nbsp;Update&nbsp; </button>
                                    </div>  
                                </div>
                            </form>
                        </div>
                        <div className="tab-pane fade" id="password" role="tabpanel" aria-labelledby="password-tab" tabIndex="0">
                            <h3>Change Password</h3>
                            <form action="" onSubmit={(e)=>handleChangePass(e)}>
                                <p>You’ll be logged out of all sessions including this one to protect your account if anyone is trying to gain access. </p>
                                <p>Your password must be at least 8 characters and should include a combination of numbers, letters and special characters (!$@%). </p>
                                <div className="mb-3">
                                    <label htmlFor="oldpass" className="form-label">Old password</label>
                                    <input id='oldpass' type="password" className={`form-control ${props.theme}`} onChange={(e)=>{setOldPass(e.target.value)}} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newpass" className="form-label">New password</label>
                                    <input id='newpass' type="password" className={`form-control ${props.theme}`} onChange={(e)=>{setNewPass(e.target.value)}} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmpass" className="form-label">Confirm new password</label>
                                    <input id='confirmpass' type="password" className={`form-control ${props.theme}`} onChange={(e)=>{setConfirmPass(e.target.value)}} required/>
                                </div>
                                <div className="row float-end">
                                    <div className="form-group">
                                        <button type='submit' className='btn btn-primary'>&nbsp;Change password&nbsp;</button>
                                    </div>  
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer draggable={false} autoClose={4000} theme={props.theme}/>
        </div>
    )
}

export default Settings