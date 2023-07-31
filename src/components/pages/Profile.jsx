import React, { useState, useEffect} from 'react';
import { setTitle } from '../../assets/js/script';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CCollapse } from '@coreui/react';
import { getUserFromToken,
    getUserProfile,
    getProfilePostsFromToken,
    getFollows,
    followUser } 
    from '../../axios/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import Thumbnail from '../partials/Thumbnail';
import ModalViewPost from '../partials/ModalViewPost';
import ModalCreatePost from '../partials/ModalCreatePost';
import ModalLoading from '../partials/ModalLoading';
import ModalComplete from '../partials/ModalComplete';
import ModalFollower from '../partials/ModalFollower';
import ModalFollowing from '../partials/ModalFollowing';
import Sidenav from '../partials/Sidenav';
import Post from '../partials/Post';

export default function Profile(props) {
    setTitle('Profile');
    let navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const queryParameters = new URLSearchParams(window.location.search);
    const paramId = queryParameters.get("id");
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const [likeModal, setLikeModal] = useState(0);
    
    const isMobile = window.matchMedia("(max-width: 680px)").matches;
    const [visible1, setVisible1] = useState(true);
    const [visible2, setVisible2] = useState(!isMobile);

    useEffect( () =>{
        if(token){
            loadNavnVerify(token);
            loadProfile(token, paramId);
            loadNumbers(token, paramId);
            loadPosts(token, paramId);
        }else{
            navigate('/user/login');
        }
    }, []);

    const [user, setUser] = useState({});
    const {user_id, username, pic} = user;
    const loadNavnVerify = async (getToken) =>{
        const response = await getUserFromToken({token: getToken});
        if(response.data.status == "success") {
            setUser(response.data.user);
        } else {
            navigate('/user/login');
        }
    }

    const [follow, setFollow] = useState("Follow");
    const followHandle = async (isFollowing) =>{
        setIsBtnDisabled(true);
        const response = await followUser({token: token, id: paramId, isFollowing: isFollowing});
        event.currentTarget.disabled = false;
        if(response.data.status == "success") {
            await loadNumbers(token, paramId);
            setLikeModal(likeModal+1);
            if(isFollowing){
                setFollow("Following");
            } else {
                setFollow("Follow");
            }
        } else {
            navigate('/user/login');
        }
        setIsBtnDisabled(false);
    }

    const [profile, setProfile] = useState({});
    const loadProfile = async (getToken, getProfileId) =>{
        const response = await getUserProfile({token: getToken, id: getProfileId});
        if(response.data.status == "success") {
            setProfile(response.data.user);
            setFollow(response.data.btnFollow);
        } else {
            navigate('/user/login');
        }
    }

    const [numFollower, setNumFollower] = useState("");
    const [numFollowing, setNumFollowing] = useState("");
    const [numPost, setNumPost] = useState("");
    const loadNumbers = async (getToken, getProfileId) =>{
        const response = await getFollows({token: getToken, id: getProfileId});
        if(response.data.status == "success") {
            const getNumFollower = response.data.numFollower;
            const getNumFollowing = response.data.numFollowing;
            const followerX = (getNumFollower>1)?" followers":" follower";
            setNumFollower(getNumFollower+followerX);
            setNumFollowing(getNumFollowing+" following");

            const postX = (response.data.numPost>1)?" posts":" post";
            setNumPost(response.data.numPost+postX);
        } else {
            navigate('/user/login');
        }
    }

    const [posts, setPosts] = useState(['loading']);
    const loadPosts = async (getToken, getProfileId) =>{
        const response = await getProfilePostsFromToken({token: getToken, id: getProfileId});
        if(response.data.status == "success") {
            setPosts(response.data.allPosts);
            loadNumbers(token, paramId);
        } else {
            navigate('/user/login');
        }
    }

    const handleCollapse = (post_id) => {
        setVisible1(!visible1);
        setVisible2(!visible2);
        setTimeout(() => {
            const element = document.getElementById(post_id);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest"
                });
            }
        }, 500);
    }

    return (
        <div>
            <Sidenav
                user_id={user_id}
                username={username}
                pic={pic}
                profile_id={paramId}
                follow={follow}
                loadNumbers={loadNumbers}
                loadProfile={loadProfile}
                likeModal={likeModal}
                setLikeModal={setLikeModal} 
                theme={props.theme}
                setTheme={props.setTheme}
            />
            <div className={`home container-fuild justify-content-center ${props.theme}`} style={{minHeight: "100vh"}}>
                <ModalCreatePost 
                    user_id={user_id}
                    username={username}
                    pic={pic}
                    reloadPosts={loadPosts}
                    page={"profile"}
                    paramId={paramId}
                    theme={props.theme}
                />
                <button id="modalLoadingBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalLoading" hidden></button>
                <ModalComplete theme={props.theme}></ModalComplete>
                <button id="modalCompleteBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalComplete" hidden></button>
                <ModalLoading theme={props.theme}></ModalLoading>
                
                <ModalFollower
                    profile_id={paramId}
                    follow={follow}
                    loadNumbers={loadNumbers}
                    likeModal={likeModal}
                    setLikeModal={setLikeModal}
                    theme={props.theme}
                />
                <ModalFollowing
                    profile_id={paramId}
                    follow={follow}
                    loadNumbers={loadNumbers}
                    likeModal={likeModal}
                    setLikeModal={setLikeModal}
                    theme={props.theme}
                />
                <div className='profile-page p-0 m-0 d-flex h-100'>
                    <CCollapse className="" id="collapseThumbnail" horizontal visible={visible1}>
                        <div className='profile-page d-flex justify-content-center align-item-center flex-column pt-5' style={{paddingLeft:12, paddingRight:12}}>
                            <div className='d-flex justify-content-center align-items-center flex-column flex-lg-row gap-4'>
                                <div className='col-12 col-lg-3 d-flex justify-content-center mb-4'>
                                    <img className='rounded-circle img-thumbnail' src={profile.pic} alt="" style={{height: 150, width: 150}}/>
                                </div>
                                <div className='d-flex flex-column col-auto col-lg-8 mb-4'>
                                    <div className='d-flex align-items-start'>
                                        <p className='fs-5 me-4 py-1'>{profile.username}</p>
                                        {
                                        (profile.isOwner==true)?
                                        <Link to={"/user/settings"} className="btn btn-info">Edit profile</Link>
                                        :
                                        <div className='d-flex align-items-center gap-3'>
                                            {
                                            (follow=="Follow")?
                                            <button className="btn btn-primary" onClick={(event)=>followHandle(true)} disabled={isBtnDisabled}>&nbsp;Follow&nbsp;</button>
                                            :
                                            <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#unfollowModal">Following</button>
                                            }
                                            <Link to={`/user/chat?id=${paramId}`} className="btn btn-info">Message</Link>
                                            <div className="dropdown">
                                                <button className='border-0 bg-transparent fs-4' data-bs-toggle="dropdown">
                                                    <FontAwesomeIcon icon="fa-solid fa-ellipsis" className={`${props.theme}`} />
                                                </button>
                                                <ul className={`dropdown-menu dropdown-menu-start ${props.theme=="dark" ? "darker" : "lighter"}`}>
                                                    <li>
                                                        <p className={`dropdown-item mb-0 nav-menu ${props.theme=="dark" ? "text-white" : ""}`} style={{cursor: "pointer"}}>Block</p>
                                                    </li>
                                                    <li>
                                                        <p className={`dropdown-item mb-0 nav-menu ${props.theme=="dark" ? "text-white" : ""}`} style={{cursor: "pointer"}}>Report</p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        }
                                        
                                    </div>
                                    <div className='d-flex gap-5'>
                                        <p>{numPost}</p>
                                        <p className='follow-count' style={{cursor: "pointer"}} data-bs-toggle="modal" data-bs-target="#modalFollower">{numFollower}</p>
                                        <p className='follow-count' style={{cursor: "pointer"}} data-bs-toggle="modal" data-bs-target="#modalFollowing">{numFollowing}</p>
                                    </div>
                                    <div>
                                        <p className='fw-semibold mb-0'>{profile.fname}</p>
                                    </div>
                                    <div>
                                        <p>{profile.bio}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex flex-column align-items-center'>
                                <ul className="d-flex justify-content-center nav nav-tabs gap-5 w-100" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={`bg-transparent text-primary nav-link active`} id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">POSTS</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={`bg-transparent text-primary nav-link`} id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">REELS</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={`bg-transparent text-primary nav-link`} id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">TAGGED</button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-4 mb-5 col-12 col-xl-12 col-xxl-10" id="myTabContent">
                                    <div className="tab-pane fade show active w-100" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                                    {
                                    (posts.length>0 && posts[0]!=="loading")?
                                    <div className='d-flex row'>
                                        {
                                        posts.map((data)=>(
                                            <div
                                            key={data.id}
                                            className='col-4 mb-3 d-flex justify-content-center'>
                                                <Thumbnail
                                                    post_id={data.id}
                                                    attachment={data.attachment}
                                                    isMobile={isMobile}
                                                    handleCollapse={handleCollapse}
                                                    visible1={visible1}
                                                />

                                                {(!isMobile)?
                                                <ModalViewPost
                                                    post_id={data.id}
                                                    user_id={data.user_id}
                                                    username={data.username} 
                                                    pic={data.pic}
                                                    caption={data.caption}
                                                    attachment={data.attachment}
                                                    date={data.date} 
                                                    update={data.update}
                                                    isLiked={data.isLiked}
                                                    numLikes={data.numLikes} 
                                                    numComments={data.numComments}
                                                    likeModal={likeModal}
                                                    setLikeModal={setLikeModal} 
                                                    loadNumbers={loadNumbers}
                                                    loadProfile={loadProfile}
                                                    paramId={paramId}
                                                    isOwner={profile.isOwner}
                                                    loadPosts={loadPosts}
                                                    theme={props.theme}
                                                />:<></>}
                                            </div>
                                        ))
                                        }
                                    </div>
                                    :
                                    <div>
                                        {
                                        (posts[0]=="loading")?
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                        :
                                        <div className='text-center'>No post to show</div>
                                        }
                                    </div>
                                    }
                                    </div>
                                    <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0">
                                        <div className='text-center'>Coming soon</div>
                                    </div>
                                    <div className="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabIndex="0">
                                        <div className='text-center'>Coming soon</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CCollapse>
                    {
                    (isMobile)?
                    <CCollapse className='' id="collapsePost" horizontal visible={visible2}>
                        <div className='profile-page d-flex flex-column align-items-center'>
                            <div className={`post-header d-flex w-100 px-3 sticky-top ${props.theme}`}>
                                <button className={`float-end border-0 bg-transparent fs-1 p-0 ${props.theme=="dark"?"black-icon":"black-link"}`}
                                onClick={()=>handleCollapse()} 
                                aria-expanded={props.visible2} aria-controls="collapseChat">
                                    <FontAwesomeIcon icon="fa-solid fa-angle-left" />
                                </button>
                                <div className='d-flex flex-column justify-content-center align-items-center m-0 p-0' style={{width:"calc(100% - 15.6px)"}}>
                                    <div>{username}</div>
                                    <div className='fw-bold'>POSTS</div>
                                </div>
                            </div>
                            {
                            (posts.length>0 && posts[0]!=="loading")?
                            <div className='d-flex flex-wrap flex-column pt-3 gap-3'>
                                {
                                posts.map((data)=>(
                                    <Post
                                        key={data.id}
                                        post_id={data.id}
                                        user_id={data.user_id}
                                        username={data.username} 
                                        pic={data.pic}
                                        caption={data.caption}
                                        attachment={data.attachment}
                                        date={data.date} 
                                        update={data.update}
                                        owner={data.owner}
                                        isLiked={data.isLiked}
                                        numLikes={data.numLikes} 
                                        numComments={data.numComments}
                                        mdy={data.mdy}
                                        likeModal={likeModal}
                                        setLikeModal={setLikeModal} 
                                        theme={props.theme}
                                        loadNumbers={loadNumbers}
                                        loadProfile={loadProfile}
                                        paramId={paramId}
                                        loadPosts={loadPosts}
                                    />
                                ))
                                }
                                <div className='d-flex justify-content-center fw-light'>No more post to show</div>
                            </div>
                            :
                            <div>
                                {
                                (posts[0]=="loading")?
                                <div className="d-flex justify-content-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                :
                                <div>No post to show</div>
                                }
                            </div>
                            }
                        </div>
                    </CCollapse>
                    :
                    <></>
                    }
                </div>
                <div className="modal fade" id="unfollowModal" tabIndex="-1" aria-labelledby="unfollowModalLabel4" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className={`modal-content ${props.theme}`}>
                            <div className="modal-header d-flex" data-bs-theme={`${props.theme}`}>
                                <h1 className="modal-title fs-5" id="unfollowModalLabel4">Unfollow</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                            Do you want to unfollow {profile.fname}?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={(event)=>followHandle(false)} data-bs-dismiss="modal">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer draggable={false} autoClose={4000} theme={props.theme}/>
        </div>
    )
}