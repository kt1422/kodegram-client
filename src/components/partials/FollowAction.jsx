import React, { useState } from 'react';

const FollowAction = (props) => {
    const [followBtn, setFollowBtn] = useState(props.btnFollow=="Follow"?false:true);
    const [unfollowBnt, setUnfollowBtn] = useState(props.btnFollow=="Follow"?true:false);
    const handleAction = async (action) => {
        if(action){
            setFollowBtn(true);
            setUnfollowBtn(false);
        }else{
            setFollowBtn(false);
            setUnfollowBtn(true);
        }
        props.followHandle(props.user_id, action);
    }

    return (
        <div className='flex-fill'>
            {
            (props.btnFollow=="Follow")?
            <button
            className="btn btn-primary my-1 float-end"
            onClick={()=>handleAction(true)}
            disabled={followBtn} >&nbsp;Follow&nbsp;</button>
            :
            (props.btnFollow=="Following")?
            <button className="btn btn-info my-1 float-end"
            onClick={()=>handleAction(false)}
            disabled={unfollowBnt} >Following</button>
            :
            <div></div>
            }

            
        </div>
    )
}

export default FollowAction