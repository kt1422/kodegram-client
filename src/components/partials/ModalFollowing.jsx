import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { followingsDetail, followUser } from '../../axios/api';
import Cookies from 'universal-cookie';

const ModalFollowing = (props) => {
    let navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const profile_id = props.profile_id;

    const [followings, setFollowings] = useState([]);
    const handleFollowing = async (getToken, getProfileId) =>{
        const response = await followingsDetail({token: getToken, id: getProfileId});
        if(response.data.status == "success") {
            setFollowings(response.data.followings);
        } else {
            navigate('/user/login');
        }
    }

    useEffect( () =>{
        handleFollowing(token, profile_id);
    }, [props.follow, props.likeModal]);

    const followHandle = async (userId, isFollowing) =>{
        const response = await followUser({token: token, id: userId, isFollowing: isFollowing});
        if(response.data.status == "success") {
            // handleFollowing(token, profile_id);
            props.loadNumbers(token, profile_id);
            props.setLikeModal(props.likeModal+1);
        } else {
            navigate('/user/login');
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
            <div className="modal fade" id="modalFollowing" tabIndex="-1" aria-labelledby="modalFollowingLabel" aria-hidden="true" style={{color: "black"}}>
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className={`modal-content ${props.theme}`}>
                        <div className="modal-header d-flex" data-bs-theme={`${props.theme}`}>
                            <h1 className="modal-title fs-5 flex-fill text-center">Following</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={{height: 500}}>
                            {
                            (followings.length>0)?
                                followings.map((data)=>(
                                    <div key={data.user_id} className='d-flex align-items-start mb-3'>
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
                                            <button className="btn btn-info my-1 float-end" onClick={()=>setUnfollowModal(data.user_id, data.username)} data-bs-toggle="modal" data-bs-target="#unfollowingModal">Following</button>
                                            :
                                            <div></div>
                                            }
                                        </div>
                                    </div>
                            ))
                            :
                            <div className='text-center'>No following yet</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="unfollowingModal" tabIndex="-1" aria-labelledby="unfollowingModalLabel4" aria-hidden="true">
                <div className="modal-dialog">
                    <div className={`modal-content ${props.theme}`}>
                        <div className="modal-header" data-bs-theme={`${props.theme}`}>
                            <h1 className="modal-title fs-5" id="unfollowingModalLabel4">Unfollow</h1>
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

export default ModalFollowing;