import React, { useState, useEffect, useRef } from 'react';
import { CCollapse } from '@coreui/react';

const Startchat = (props) => {
    const handleChange = () =>{
        setVisible(!visible);
        setVisible2(!visible2)
    }
    const [visible, setVisible] = useState(true)
    const [visible2, setVisible2] = useState(false)
    return (
        <div className='d-flex justify-content-start align-items-start' style={{ height: '100vh'}}>
            <div className='bg-warning h-100' style={{width:250}}>testtest</div>
            <div className='bg-danger m-0 p-0 d-flex try2' style={{ height: '100vh'}}>
                <CCollapse className={`bg-success`} id="collapse1" horizontal visible={visible}>
                    <div className='try2 d-flex flex-column'>
                        <div>
                            <button className="mb-3" onClick={() => handleChange()} aria-expanded={visible} aria-controls="collapse1">Button</button>
                            <p>This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.</p>
                        </div>
                        <div style={{width:300, height:300}}>
                            <div className='container-fluid bg-info h-100'>test</div>
                        </div>
                    </div>
                </CCollapse>
                <CCollapse className={`bg-danger`} id="collapse2" horizontal visible={visible2}>
                    <div className='try2 d-flex'>
                        <div>
                            <button className="mb-3" onClick={() => handleChange()} aria-expanded={visible2} aria-controls="collapse2">Button</button>
                            This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.
                        </div>
                    </div>
                </CCollapse>
                
            </div>
        </div>
    )
}

export default Startchat