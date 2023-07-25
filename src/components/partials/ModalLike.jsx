import React, { useState, useEffect} from 'react';
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getPostLikers, followUser } from '../../axios/api';

const ModalLike = (props) => {
    let redirect = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const post_id = props.post_id;

    const [users, setUsers] = useState([]);
    const loadLikers = async (getToken, getPostId) =>{
        const response = await getPostLikers({token: getToken, post_id: getPostId});
        if(response.data.status == "success") {
            setUsers(response.data.allUsers);
        } else {
            redirect('/user/login');
        }
    }

    useEffect( () =>{
        loadLikers(token, post_id);
    }, [props.heart, props.likeModal]);

    const followHandle = async (userId, isFollowing) =>{
        const response = await followUser({token: token, id: userId, isFollowing: isFollowing});
        if(response.data.status == "success") {
            props.setLikeModal(props.likeModal+1);
            try {
                props.loadNumbers(token, props.paramId);
                props.loadProfile(token, props.paramId);
            } catch (error) {
                // console.log(error);
            }
        } else {
            redirect('/user/login');
        }
    }

    const [unfollowId, setUnfollowId] = useState("");
    const [unfollowName, setUnfollowName] = useState("");
    const setUnfollowModal = (userId, username) =>{
        setUnfollowId(userId);
        setUnfollowName(username);
    }

    return (
        <div>
            <div className="modal fade" id={`modalLike${props.post_id}`} tabIndex="-1" aria-labelledby="modalLikeLabel" aria-hidden="true" style={{color: "black"}}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className={`modal-content ${props.theme}`}>
                        <div className="modal-header d-flex" data-bs-theme={`${props.theme}`}>
                            <h1 className="modal-title fs-5 flex-fill text-center">Likes</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={{height: 500}}>
                            {
                            (users.length>0)?
                                users.map((data, index)=>(
                                    <div key={`${post_id+data.username+index}`} className='d-flex align-items-start mb-3'>
                                        <Link to={`/user/profile?id=${data.user_id}`} className="nav-link fw-semibold d-flex" reloadDocument>
                                            <img className="rounded-circle border me-3" src={data.pic} alt="img" style={{width: 50, height: 50}}/>
                                        </Link>
                                        <div className='m-0'>
                                            <Link to={`/user/profile?id=${data.user_id}`} className="nav-link fw-semibold name-link me-2" reloadDocument>
                                            {data.username}
                                            </Link>
                                            <span className='fw-light'>{data.fname}</span>
                                        </div>
                                        <div className='flex-fill'>
                                            {
                                            (data.btnFollow=="Follow")?
                                            <button className="btn btn-primary my-1 float-end" onClick={()=>followHandle(data.user_id, true)} >&nbsp;Follow&nbsp;</button>
                                            :
                                            (data.btnFollow=="Following")?
                                            <button className="btn btn-info my-1 float-end" onClick={()=>setUnfollowModal(data.user_id, data.username)} data-bs-toggle="modal" data-bs-target={`#unfollowModal${props.post_id}`}>Following</button>
                                            :
                                            <div></div>
                                            }
                                        </div>
                                    </div>
                            ))
                            :
                            <div>No following yet</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id={`unfollowModal${props.post_id}`} tabIndex="-1" aria-labelledby="unfollowModalLabel4" aria-hidden="true">
                <div className="modal-dialog">
                    <div className={`modal-content ${props.theme}`}>
                        <div className="modal-header" data-bs-theme={`${props.theme}`}>
                            <h1 className="modal-title fs-5">Unfollow</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        Do you want to unfollow {unfollowName}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={()=>followHandle(unfollowId, false)} data-bs-dismiss="modal">Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalLike;