import React, { useState, useEffect } from 'react';
import { setTitle } from '../../assets/js/script';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { forgotPass } from '../../axios/api';
import logo from '../../assets/img/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';

const Forgot = () => {
    setTitle("Reset Password");
    let navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const [account, setAccount] = useState("");

    useEffect( () =>{
        if(token){
            navigate('/home');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await forgotPass({account: account});
        if(response.data.status == "success"){
            toast.success("Password has been successfully reset! Please check your email.");
        }else{
            toast.error("Invalid email or username! No account found.");
        }
    }

    return (
        <div style={{height: "100vh"}} className="container-fluid d-flex flex-column flex-sm-row align-items-center justify-content-center">
            <div className='mx-4 d-none d-sm-block'>
                <img className='img-fluid float-end start-logo' src={logo} alt="" />
            </div>
            <div className="login border rounded rounded-4 d-flex flex-column justify-content-center pt-4 pb-3 mx-4">
                <div className="align-self-center mb-3 billabong title">Kodegram</div>
                <form action="" onSubmit={(e)=> handleSubmit(e)}>
                    <div className='px-4'>
                        <p className='text-secondary' style={{fontSize: 14}}>Enter your email or username and we'll send you an email to get back into your account.</p>
                    </div>
                    <div className="mb-4 px-4">
                        <input type="account" className="form-control" name="email" onChange={(e)=>{setAccount(e.target.value)}} placeholder='Enter Email or Username' required/>
                    </div>
                    <div className="d-flex justify-content-center mb-4 px-4">
                        <button type="submit" className="btn btn-primary rounded-pill" style={{width: 150}}>Reset Password</button>
                    </div>
                    <div className="mb-4 px-4">
                        <p className="form-label">Dont have an account yet?&nbsp;
                            <Link to={"/user/register"}>
                            Sign Up 
                            </Link>
                        </p>
                    </div>
                    <div className='border-top d-flex justify-content-center'>
                        <Link to={"/user/login"} className='nav-link fw-semibold mt-2 black-icon'>Back to Login</Link>
                    </div>
                </form>
            </div>
            <ToastContainer draggable={false} autoClose={4000} />
        </div>
    )
}

export default Forgot