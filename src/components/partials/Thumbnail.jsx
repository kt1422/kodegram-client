import React, { useState } from 'react';

const Thumbnail = (props) => {
    const img = new Image();
    img.src = props.attachment[0];
    const [flow, setFlow] = useState(''); 
    img.onload = () => {
        if(img.height>img.width){
            setFlow("w-100");
        } else {
            setFlow("h-100");
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center position-relative border border-1 thumbnail" style={{overflow: "hidden"}}>
                <img src={img.src} className={flow} style={{position: "absolute"}} alt="..."/>
                {
                (props.isMobile)?
                <button className="stretched-link border-0 bg-transparent p-0"
                onClick={()=>{
                    props.handleCollapse("post"+props.post_id);
                }}
                aria-expanded={props.visible2} aria-controls="collapseChat">
                </button>
                :
                <button className="stretched-link border-0 bg-transparent p-0" data-bs-toggle="modal" data-bs-target={`#viewPostModal${props.post_id}`}></button>
                }
            </div>
        </div>
    )
}

export default Thumbnail;