import React, { useState, useEffect } from 'react';
import { setTitle } from '../../assets/js/script';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createNewUser } from '../../axios/api';
import logo from '../../assets/img/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';

const Register = () => {
    setTitle('Register');
    let navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');

    useEffect( () =>{
        if(token){
            navigate('/home');
        }
    }, []);

    const defaultUserInput = {
        fname: "",
        username: "",
        email: "",
        password: "",
        confirm_password: ""
    }
    const [userInput, setUserInput] = useState(defaultUserInput);
    const {fname, username, email, password, confirm_password} = userInput;

    const onValueChange =(e)=>{
        setUserInput({...userInput, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fnamRegex = /^[a-z0-9 ,.'-_]+$/i;
        const isFnameValid = fname.match(fnamRegex);
        if(!isFnameValid){
            return toast.error("Invalid! Name contains invalid character. Allowed characters are a-z 0-9 , . ' - _");
        }
        const fnameLength = fname.length;
        if(fnameLength>30){
            return toast.error("Invalid length! Username must be between 1 to 30 characters in length");
        }

        const usernameRegex = /^[a-z0-9._]+$/i;
        const isUsernameValid = username.match(usernameRegex);
        if(!isUsernameValid){
            return toast.error("Invalid Username! Must be made of letters, numbers, periods, or underscores only");
        }
        const usernameLength = username.length;
        if(usernameLength>30){
            return toast.error("valid length");
        }

        if(password!=confirm_password){
            return toast.error("Invalid Password! Please make sure both passwords match.");
        }
        const passwordLength = password.length;
        if(passwordLength<8){
            return toast.error("Invalid length! Password must be at least 8 characters");
        }

        const response = await createNewUser(userInput);
        if(response.data.status == "success") {
            toast.success("Please take a moment and validate your email to confirm your account.");
            setTimeout(() => {
                navigate('/user/login');
            }, 5000);
        } else {
            toast.error(response.data.message);
        }
    }
    
    return (
        <div>
            <div style={{height: "100vh"}} className="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-center">
                <div className='mx-4 d-none d-md-block'>
                    <img className='img-fluid float-end start-logo' src={logo} alt="" />
                </div>
                <div className="border login rounded rounded-4 d-flex justify-content-center flex-column px-3 py-3 mx-4">
                    <div className="align-self-center mb-2 billabong title">Kodegram</div>
                    <form action="" onSubmit={(e)=> handleSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="fname" className="form-label">Name</label>
                            <input type="text" className="form-control" name="fname" id="fname" maxLength={35} onChange={(e)=> onValueChange(e)} value={fname} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" name="username" id="username" onChange={(e)=> onValueChange(e)} value={username} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input type="email" className="form-control" name="email" id="email" onChange={(e)=> onValueChange(e)} value={email} required/>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" id="password" maxLength={30} onChange={(e)=> onValueChange(e)} value={password} required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" name="confirm_password" id="confirm_password" maxLength={30} onChange={(e)=> onValueChange(e)} value={confirm_password} required/>
                        </div>
                        <div className="mb-3">
                            <p className="form-label">Already have an account?&nbsp;
                                <Link to={"/user/login"}>
                                Sign In  
                                </Link>
                            </p>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary rounded-pill" style={{width: 150}}>Register</button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer draggable={false} autoClose={4000} />
        </div>
    )
}

export default Register