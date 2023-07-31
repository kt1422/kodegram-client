import React from 'react'
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";

const ModalLogout = (props) => {
    const cookies = new Cookies();
    let navigate = useNavigate();
    
    const logout =()=>{
        cookies.set('userToken', '', { path: '/' });
        const delete1 = cookies.get('userToken');
        if(delete1){
            cookies.remove('userToken');
        }

        const delete2 = cookies.get('userToken');
        if(delete2){
            cookies.set('userToken', {maxAge: -1});
        }

        const delete3 = cookies.get('userToken');
        if(delete3){
            cookies.set('userToken', {expires: Date.now()});
        }

        setTimeout(() => {
            navigate('/user/login');
        }, 1000);
    }

    return (
        <div className="modal fade" id="exampleModal4" tabIndex="-1" aria-labelledby="exampleModalLabel4" aria-hidden="true" style={{color: "black"}}>
            <div className="modal-dialog">
                <div className={`modal-content ${props.theme}`}>
                    <div className="modal-header" data-bs-theme={`${props.theme}`}>
                        <h1 className="modal-title fs-5" id="exampleModalLabel4">Log out</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    Are you sure you want to logout?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={()=>logout()} data-bs-dismiss="modal">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalLogout;