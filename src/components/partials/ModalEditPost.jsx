import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import { editPost } from '../../axios/api';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const ModalEditPost = (props) => {
    let redirect = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const viewImage= props.viewImage;
    const post_id = props.post_id;
    const [editCaption, setEditCaption] = useState(props.caption);

    const handleUpdate = async () =>{
        const response = await editPost({token: token, post_id: post_id, editCaption: editCaption});
        if(response.data.status == "success") {
            props.setCaption(editCaption);
            props.setUpdate("just now");
            toast.success("Your post has been updated.");
        } else {
            redirect('/user/login');
        }
    }
    
    return (
        <div className="modal fade" id={`editPostModal${post_id}`} tabIndex="-1" aria-labelledby="editPostModalLabel" aria-hidden="true" style={{color: "black"}}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className={`modal-content ${props.theme}`}>
                    <div className="modal-header d-flex" data-bs-theme={`${props.theme}`}>
                        <h1 className="modal-title fs-5 flex-fill text-center">Edit caption</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-0 w-100 d-flex justify-content-center align-items-center" style={{height: 350}}>
                        <div id={`editCarousel${props.post_id}`} className="carousel slide w-50 h-100">
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
                            <button className="carousel-control-prev" type="button" data-bs-target={`#editCarousel${props.post_id}`} data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target={`#editCarousel${props.post_id}`} data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                            </div>
                            :
                            <div></div>
                            }
                        </div>
                        <div className='modal-body w-50 h-100 d-flex flex-column border-start'>
                            <Link className="nav-link fw-semibold d-flex">
                                <img className="rounded-circle border me-3" src={props.pic} alt="" style={{width: 40, height: 40}}/>
                                <p className='name-link pt-2 m-0'>{props.username}</p>
                            </Link>
                            <div className='d-flex align-items-start flex-fill mt-2'>
                                <textarea 
                                className={`border-0 comment-box col ${props.theme}`} 
                                rows={11} name='caption' placeholder='Write a caption...' 
                                style={{resize: "none"}} 
                                onChange={(e)=>setEditCaption(e.target.value)} 
                                value={editCaption}>
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={()=>handleUpdate()} data-bs-dismiss="modal">Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalEditPost;