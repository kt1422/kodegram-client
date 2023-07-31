import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from '../../axios/api';
import Cookies from 'universal-cookie';
import loading from '../../assets/img/Kodegram.gif';

const Loading = () => {
    let navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');

    const authentication = async (token) =>{
        const response = await getUserFromToken({token: token});
        if(response.data.status == "success") {
            setTimeout(() => {
                navigate("/home");
            }, 5000);
        } else {
            setTimeout(() => {
                navigate("/user/login");
            }, 5000);
        }
    }

    useEffect(() =>{
        authentication();
    }, []);

    return (
        <div
        className='d-flex justify-content-center align-items-center'
        style={{width:"100vw", height:"100vh"}} >
            <img className='img-fluid' src={loading} alt="" />
        </div>
    )
}

export default Loading