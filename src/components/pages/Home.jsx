import React, { useState, useEffect} from 'react';
import { setTitle } from '../../assets/js/script';
import { useNavigate } from "react-router-dom";
import { getUserFromToken, getHomePostsFromToken } from '../../axios/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import Sidenav from '../partials/Sidenav';
import Post from '../partials/Post';
import ModalCreatePost from '../partials/ModalCreatePost';
import ModalLoading from '../partials/ModalLoading';
import ModalComplete from '../partials/ModalComplete';
import iconlogo from '../../assets/img/circle-logo.png';

const Home = (props) => {
    setTitle('Home');
    let navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const [likeModal, setLikeModal] = useState(0);

    const [user, setUser] = useState({});
    const {user_id, username, pic} = user;
    const authentication = async (token) =>{
        const response = await getUserFromToken({token: token});
        if(response.data.status == "success") {
            setUser(response.data.user);
        } else {
            navigate('/user/login');
        }
    }

    const [posts, setPosts] = useState(['loading']);
    const loadPosts = async (token) =>{
        const response = await getHomePostsFromToken({token: token});
        if(response.data.status == "success") {
            setPosts(response.data.allPosts);
        } else {
            navigate('/user/login');
        }
    }

    useEffect( () =>{
        if(token){
            authentication(token);
            loadPosts(token);
        }else{
            navigate('/user/login');
        }
    }, []);
    
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
            <div className={`home container-fuild ${props.theme}`} style={{minHeight: "100vh"}}>
                <ModalCreatePost
                    user_id={user_id}
                    username={username}
                    pic={pic}
                    reloadPosts={loadPosts}
                    page={"home"}
                    theme={props.theme}
                />
                <button id="modalLoadingBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalLoading" hidden></button>
                <ModalComplete theme={props.theme}></ModalComplete>
                <button id="modalCompleteBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalComplete" hidden></button>
                <ModalLoading theme={props.theme}></ModalLoading>

                <div className='container-fluid d-flex justify-content-center py-5'>
                    {
                    (posts.length>0 && posts[0]!=="loading")?
                    <div className='d-flex flex-wrap flex-column gap-3'>
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
                        <div className='d-flex flex-column'>
                            <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                                <img className="rounded-circle border bg-white" src={iconlogo} alt="" width={100} height={100} />
                                <div className="fs-5 mt-3">No post to show</div>
                                <div className="fw-light">Search your friends and follow them</div>
                                <button className="btn btn-primary btn-sm mt-3 px-3 rounded rounded-3" data-bs-toggle="modal" data-bs-target="#modalSearch">Search people</button>
                            </div>
                        </div>
                        }
                    </div>
                    }
                </div>
            </div>
            <ToastContainer draggable={false} autoClose={4000} theme={props.theme}/>
        </div>
    )
}

export default Home