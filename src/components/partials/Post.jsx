import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { likePost, addComment, deletePost } from '../../axios/api';
import Cookies from 'universal-cookie';
import Comment from './Comment';
import ModalLike from './ModalLike';
import ModalEditPost from './ModalEditPost';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Post = (props) => {
    let redirect = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');

    const [caption, setCaption] = useState(props.caption);
    const [update, setUpdate] = useState(props.update);
    const isMobile = window.matchMedia("(max-width: 680px)").matches;

    const hidePost = (element) =>{
        document.getElementById(element).style.display = "none";
    }

    const deletePostHandle = async (post_id) =>{
        const response = await deletePost({token: token, post_id: post_id});
        if(response.data.status == "success") {
            document.getElementById(`post${post_id}`).style.display = "none";
            try {
                props.loadNumbers(token, props.paramId);
                props.loadPosts(token, props.paramId);
            } catch (error) {
                //nothing
            }
            toast.success("Your post has been deleted");
        } else {
            redirect('/user/login');
        }
    }

    const ownerBtn =
    <ul className={`dropdown-menu dropdown-menu-end ${props.theme=="dark" ? "darker" : "lighter"}`}>
        <li>
            <p className={`dropdown-item mb-0 nav-menu ${props.theme=="dark" ? "text-white" : ""}`} data-bs-toggle="modal" data-bs-target={`#editPostModal${props.post_id}`} style={{cursor: "pointer"}}>Edit</p>
        </li>
        <li>
            <p className={`dropdown-item mb-0 nav-menu ${props.theme=="dark" ? "text-white" : ""}`} data-bs-toggle="modal" data-bs-target={`#deletePostModal${props.post_id}`} style={{cursor: "pointer"}}>Delete</p>
        </li>
        <li onClick={()=>hidePost(`post${props.post_id}`)}>
            <p className={`dropdown-item mb-0 nav-menu ${props.theme=="dark" ? "text-white" : ""}`} style={{cursor: "pointer"}}>Hide</p>
        </li>
    </ul>;

    const viewBtn = 
    <ul className={`dropdown-menu dropdown-menu-end ${props.theme=="dark" ? "darker" : "lighter"}`}>
        <li onClick={()=>hidePost(`post${props.post_id}`)}>
            <p className={`dropdown-item mb-0 nav-menu ${props.theme=="dark" ? "text-white" : ""}`} style={{cursor: "pointer"}}>Hide</p>
        </li>
    </ul>;

    const isOwner = props.owner;
    const editBtnModal = (isOwner)?
    <div className="dropdown me-1">
        <button className={`border-0 bg-transparent fs-5 p-0 ${props.theme=="dark"?"white-link":"black-link"}`} data-bs-toggle="dropdown">
            <FontAwesomeIcon icon="fa-regular fa-pen-to-square"/>
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
            <li>
                <p className={`dropdown-item mb-0 nav-menu ${props.theme=="dark" ? "text-white" : ""}`} data-bs-toggle="modal" data-bs-target={`#editPostModal${props.post_id}`} style={{cursor: "pointer"}}>Edit</p>
            </li>
            <li>
                <p className={`dropdown-item mb-0 nav-menu ${props.theme=="dark" ? "text-white" : ""}`} data-bs-toggle="modal" data-bs-target={`#deletePostModal${props.post_id}`} style={{cursor: "pointer"}}>Delete</p>
            </li>
        </ul>
    </div>
    :
    <></>;
    
    const [numLikes, setNumLikes] = useState(props.numLikes);
    const defaultWordLike = (props.numLikes>1)?"likes":"like";
    const [wordLike, setWordLike] = useState(defaultWordLike);
    const [heart, setHeart] = useState(props.isLiked);
    const [isLiking, setIsLiking] = useState(false);
    const likeHandle = async (postId, isLiked) =>{
        setIsLiking(true);
        const response = await likePost({token: token, post_id: postId, isLiked: isLiked});
        if(response.data.status == "success") {
            if(isLiked){
                setHeart("Liked");
                setNumLikes(numLikes+1);
                (numLikes<1)?setWordLike("like"):setWordLike("likes");
            } else {
                setHeart("Unlike");
                setNumLikes(numLikes-1);
                (numLikes>2)?setWordLike("likes"):setWordLike("like");
            }
            setIsLiking(false);
        } else {
            redirect('/user/login');
        }
    }

    const [comment, setComment] = useState("");
    const handleKeyDown =(e)=>{
        setComment(e.target.value);
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
        e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
    }

    const [isSending, setIsSending] = useState(false);
    const [numComments, setNumComments] = useState(props.numComments);
    const defaultWordComment = (props.numComments>1)?"comments":"comment";
    const [wordComment, setWordComment] = useState(defaultWordComment);
    const [commentBox, setCommentBox] = useState([]);
    const commentHandle = async () =>{
        setIsSending(true);
        const response = await addComment({token: token, post_id: props.post_id, comment_to: "", comment: comment});
        if(response.data.status == "success") {
            const addedComment = response.data.commentAdded;
            const user = response.data.user;
            setComment("");
            setIsSending(false);
            setNumComments(numComments+1);
            setCommentBox(oldArray => [...oldArray, {
                comment_id: addedComment._id,
                user_id: addedComment.comment_user_id,
                comment_to: addedComment.comment_to,
                comment: addedComment.comment,
                username: user.username,
                pic: user.pic
            }]);
        } else {
            redirect('/user/login');
        }
    }

    const urlLists = props.attachment;
    const [image, setImage] = useState([]);
    const [viewImage, setViewImage] = useState([]);

    useEffect( () =>{
        for(let i=0; i<urlLists.length; i++){
            const classes = (i==0)?"carousel-item active":"carousel-item";
            const img = new Image();
            img.src = urlLists[i];
            img.onload = () => {
                if(img.height>=img.width){
                    setImage(oldArray => [...oldArray, {flow: "w-100", imgUrl: urlLists[i], imgClass: classes, height: img.height}]);
                }else{
                    setImage(oldArray => [...oldArray, {flow: "h-100", imgUrl: urlLists[i], imgClass: classes, height: img.height}]);
                }
                if(img.height>img.width){
                    setViewImage(oldArray => [...oldArray, {flow: "h-100", imgUrl: urlLists[i], imgClass: classes, height: img.height}]);
                }else{
                    setViewImage(oldArray => [...oldArray, {flow: "w-100", imgUrl: urlLists[i], imgClass: classes, height: img.height}]);
                }
            };
        }
    }, []);

    return (
        <div id={`post${props.post_id}`}>
            <div className={`media card border-0 pb-3 mb-3 border-bottom ${props.theme}`}>
                <div className='d-flex justify-content-between mb-2 post-icon'>
                    <div className='d-flex'>
                        <Link to={`/user/profile?id=${props.user_id}`} className="nav-link me-2 fw-semibold d-flex">
                            <img className="rounded-circle border me-2" src={props.pic} alt="" style={{width: 40, height: 40}}/>
                            <p className='name-link pt-2 m-0'>{props.username}</p>
                        </Link>
                        <p className="d-flex h-100 m-0 pt-2 fw-light"> • {props.date}</p>
                    </div>
                    <div className='pt-2'>
                        <div className="dropdown">
                            <button className='border-0 bg-transparent' data-bs-toggle="dropdown">
                                <FontAwesomeIcon icon="fa-solid fa-ellipsis" className={`${props.theme}`} />
                            </button>
                            {
                            (props.owner)?
                            ownerBtn
                            :
                            viewBtn
                            }
                        </div>
                    </div>
                </div>
                <div id={`carousel${props.post_id}`} className="carousel slide">
                    <div className="carousel-inner rounded rounded-1 w-100">
                        {
                        image.map((data)=>(
                            <div key={data.imgUrl} className={`${data.imgClass} post-card`}>
                                <div className='w-100 h-100 d-flex justify-content-center align-items-center border rounded rounded-1' style={{overflow: "hidden"}}>
                                    <img className={data.flow} src={data.imgUrl}/>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                    {
                    (image.length>1)?
                    <div>
                        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${props.post_id}`} data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target={`#carousel${props.post_id}`} data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    :
                    <div></div>
                    }
                </div>
                <div className="d-flex justify-content-between mt-1 post-icon">
                    <div className='d-flex gap-3'>
                        {
                            (heart=="Liked")?
                            <button 
                            className={`${isMobile?"":"name-link"} border-0 bg-transparent fs-4 p-0 ${props.theme=="dark" ? "dark" : "red"}`} 
                            onClick={() => likeHandle(props.post_id, false)} 
                            disabled={isLiking}>
                                <FontAwesomeIcon icon="fa-solid fa-heart"/>
                            </button>
                            :
                            <button 
                            className={`${isMobile?"":"name-link"} border-0 bg-transparent fs-4 p-0 ${props.theme}`} 
                            onClick={()=>likeHandle(props.post_id, true)} 
                            disabled={isLiking}>
                                <FontAwesomeIcon icon="fa-regular fa-heart"/>
                            </button>
                        }
                        <button className={`${isMobile?"":"name-link"} border-0 bg-transparent fs-4 p-0 ${props.theme}`} data-bs-toggle="modal" 
                            data-bs-target={`#viewPostModalHome${props.post_id}`}>
                            <FontAwesomeIcon icon="fa-regular fa-comment"/>
                        </button>
                        <button className={`${isMobile?"":"name-link"} border-0 bg-transparent fs-4 p-0 ${props.theme}`}>
                            <FontAwesomeIcon icon="fa-regular fa-paper-plane"/>
                        </button>
                    </div>
                    <div>
                        <button className={`${isMobile?"":"name-link"} border-0 bg-transparent fs-4 p-0 ${props.theme}`}>
                            <FontAwesomeIcon icon="fa-regular fa-bookmark"/>
                        </button>
                    </div>
                </div>
                {
                    (numLikes>0)?
                    <p className='fw-semibold mb-1 post-icon' data-bs-toggle="modal" data-bs-target={`#modalLike${props.post_id}`} style={{cursor: "pointer"}}>{numLikes} {wordLike}</p>
                    :
                    <div></div>
                }
                <ModalLike
                post_id={props.post_id}
                heart={heart} 
                likeModal={props.likeModal} 
                setLikeModal={props.setLikeModal}
                loadNumbers={props.loadNumbers}
                loadProfile={props.loadProfile}
                paramId={props.paramId}
                theme={props.theme}
                />
                {
                    (caption!=="")?
                    <p className='fw-semibold mb-1 post-icon'>{props.username} <span className='fw-normal'>&nbsp;{caption}</span></p>
                    :
                    <div></div>
                }
                {
                    (numComments>0)?
                    <p className="fw-light mb-1 post-icon" data-bs-toggle="modal" data-bs-target={`#viewPostModalHome${props.post_id}`} style={{cursor: "pointer"}}>View all {numComments} {wordComment}</p>
                    :
                    <div></div>
                }
                {
                    commentBox.map((data)=>(
                        <p key={data.comment_id} className='fw-semibold mb-1 post-icon'>{data.username}
                            <span className='fw-normal'>&nbsp;{data.comment}</span>
                        </p>
                    ))
                }
                <div className='d-flex align-items-start post-icon'>
                    <textarea 
                        className={`border-0 comment-box col me-1 ${props.theme=="dark"?"darker":"lighter"}`}
                        rows={1} name='post' placeholder='Add a comment...' 
                        style={{resize: "none"}} onChange={(e)=>handleKeyDown(e)} 
                        value={comment} >
                    </textarea>
                    {
                        (comment!=="")?
                        <div className='d-flex align-self-stretch'>
                            <div className='d-flex align-items-center'>
                                <button 
                                className='border-0 bg-transparent text-primary-emphasis fw-semibold col-auto'
                                onClick={()=>commentHandle()}
                                disabled={isSending}>
                                    Post
                                </button>
                            </div>
                        </div>
                        :
                        <div></div>
                    }
                </div>
            </div>
            <div className="modal fade" id={`viewPostModalHome${props.post_id}`} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-fullscreen-lg-down">
                    <div className={`modal-content d-flex flex-row ${props.theme} post-modal`} >
                        <div id={`viewcarousel${props.post_id}`} className="carousel slide w-50 h-100 d-none d-sm-flex">
                            <div className="carousel-inner h-100 w-100 bg-black">
                                {
                                viewImage.map((data)=>(
                                    <div key={data.imgUrl} className={data.imgClass} style={{height: "100%"}}>
                                        <div className='w-100 h-100 d-flex justify-content-center align-items-center' style={{overflow: "hidden"}}>
                                            <img className={data.flow} src={data.imgUrl}/>
                                        </div>
                                    </div>
                                ))
                                }
                            </div>
                            {
                                (viewImage.length>1)?
                                <div>
                                    <button className="carousel-control-prev" type="button" data-bs-target={`#viewcarousel${props.post_id}`} data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target={`#viewcarousel${props.post_id}`} data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                                :
                                <div></div>
                            }
                        </div>
                        <div className='col-12 col-sm-6 h-100 d-flex flex-column'>
                            <div className="modal-header">
                                <Link to={`/user/profile?id=${props.user_id}`} className="nav-link fw-semibold d-flex">
                                    <img className="rounded-circle border me-3" src={props.pic} alt="" style={{width: 40, height: 40}}/>
                                    <p className='name-link pt-2 m-0'>{props.username}</p>
                                </Link>
                                <div className='d-flex align-items-start' data-bs-theme={`${props.theme}`}>
                                    <div>{editBtnModal}</div>
                                    <button type="button" className="btn-close m-0" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                            </div>
                            <div className="style-4 modal-body overflow-auto h-100">
                                <div className=''>
                                    {
                                    (caption!=="")?
                                    <div className='d-flex align-items-start mb-3'>
                                        <Link to={`/user/profile?id=${props.user_id}`} className="nav-link fw-semibold d-flex">
                                            <img className="rounded-circle border me-3" src={props.pic} alt="img" style={{width: 40, height: 40}}/>
                                        </Link>
                                        <div className=''>
                                            <div className='pt-2 m-0'>
                                                <Link to={`/user/profile?id=${props.user_id}`} className="nav-link fw-semibold name-link me-2 d-inline">
                                                {props.username}
                                                </Link>
                                                {caption}
                                            </div>
                                            <div style={{fontSize: 13, color: "gray"}}>{update}</div>
                                        </div>
                                    </div>
                                    :
                                    <div></div>
                                    }
                                    {(numComments>0) && (
                                        <Comment key={props.post_id} post_id={props.post_id} numComments={numComments}></Comment>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex flex-column border-top pt-1 pb-3 px-3">
                                <div className="d-flex justify-content-between mt-1">
                                    <div className='d-flex gap-3'>
                                        {
                                            (heart=="Liked")?
                                            <button 
                                            className={`name-link border-0 bg-transparent fs-4 p-0 ${props.theme=="dark" ? "dark" : "text-danger"}`} 
                                            onClick={()=>likeHandle(props.post_id, false)} 
                                            disabled={isLiking}>
                                                <FontAwesomeIcon icon="fa-solid fa-heart"/>
                                            </button>
                                            :
                                            <button 
                                            className={`name-link border-0 bg-transparent fs-4 p-0 ${props.theme}`} 
                                            onClick={()=>likeHandle(props.post_id, true)} 
                                            disabled={isLiking}>
                                                <FontAwesomeIcon icon="fa-regular fa-heart"/>
                                            </button>
                                        }
                                        <button className={`name-link border-0 bg-transparent fs-4 p-0 ${props.theme}`}>
                                            <FontAwesomeIcon icon="fa-regular fa-comment"/>
                                        </button>
                                        <button className={`name-link border-0 bg-transparent fs-4 p-0 ${props.theme}`}>
                                            <FontAwesomeIcon icon="fa-regular fa-paper-plane"/>
                                        </button>
                                    </div>
                                    <div>
                                        <button className={`name-link border-0 bg-transparent fs-4 p-0 ${props.theme}`}>
                                            <FontAwesomeIcon icon="fa-regular fa-bookmark"/>
                                        </button>
                                    </div>
                                </div>
                                {
                                    (numLikes>0)?
                                    <p className='fw-semibold my-1' data-bs-toggle="modal" data-bs-target={`#modalLike${props.post_id}`} style={{cursor: "pointer", fontSize: 14}}>{numLikes} {wordLike}</p>
                                    :
                                    <div></div>
                                }
                                <p style={{fontSize: 10, color: "gray"}}>{props.mdy}</p>
                                <div className='d-flex align-items-start'>
                                    <textarea
                                        className={`border-0 comment-box col me-1 ${props.theme=="dark"?"darker":"lighter"}`}
                                        rows={1} name='comment'
                                        placeholder='Add a comment...' 
                                        style={{resize: "none"}} 
                                        onChange={(e)=>handleKeyDown(e)} 
                                        value={comment} >
                                    </textarea>
                                    {
                                        (comment!=="")?
                                        <div className='d-flex align-items-center h-100'>
                                            <button 
                                            className='border-0 bg-transparent text-primary-emphasis fw-semibold col-auto' 
                                            onClick={()=>commentHandle()}
                                            disabled={isSending}>
                                                Post
                                            </button>
                                        </div>
                                        :
                                        <div></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id={`deletePostModal${props.post_id}`} tabIndex="-1" aria-labelledby={`deletePostModalLabel${props.post_id}`} aria-hidden="true" style={{color: "black"}}>
                <div className="modal-dialog">
                    <div className={`modal-content ${props.theme}`}>
                        <div className="modal-header" data-bs-theme={`${props.theme}`}>
                            <h1 className="modal-title fs-5" id={`deletePostModalLabel${props.post_id}`}>Delete Post</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        Are you sure you want to delete this post?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={()=>deletePostHandle(props.post_id)} data-bs-dismiss="modal">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalEditPost
            user_id={props.user_id}
            username={props.username} 
            pic={props.pic}
            post_id={props.post_id}
            caption={caption} 
            setCaption={setCaption}
            viewImage={viewImage}
            setUpdate={setUpdate}
            theme={props.theme}
            />

        </div>
    )
}

export default Post;