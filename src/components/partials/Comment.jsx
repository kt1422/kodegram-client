import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getComment } from '../../axios/api';

const Comment = (props) => {
    let redirect = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const postId = props.post_id;

    const [allComments, setAllComments] = useState([]);
    const getAllComment = async (getToken, getPostId) =>{
        const response = await getComment({token: getToken, post_id: getPostId});
        if(response.data.status == "success") {
            setAllComments(response.data.comments);
        } else {
            redirect('/user/login');
        }
    }

    useEffect( () =>{
        getAllComment(token, postId);
        
    }, [props.numComments]);

    return (
        
        allComments.map((data)=>(
            <div key={data.comment_id} className='d-flex align-items-start mb-3'>
                <Link to={`/user/profile?id=${data.comment_user}`} className="nav-link fw-semibold d-flex" reloadDocument>
                    <img className="rounded-circle border me-3" src={data.pic} alt="img" style={{width: 40, height: 40}}/>
                </Link>
                <div className=''>
                    <div className='pt-2 m-0'>
                        <Link to={`/user/profile?id=${data.comment_user}`} className="nav-link fw-semibold name-link me-2 d-inline" reloadDocument>
                        {data.username}
                        </Link>
                        {data.comment}
                    </div>
                    <div style={{fontSize: 13, color: "gray"}}>{data.date}</div>
                </div>
            </div>
        ))
    )
}

export default Comment;