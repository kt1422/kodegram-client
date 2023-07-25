import React, { useState } from 'react';
import { setTitle, showPassword  } from '../../assets/js/script';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from '../../axios/api';
import Cookies from 'universal-cookie';
import logo from '../../assets/img/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = (props) => {
    setTitle("Login");
    let navigate = useNavigate();

    const defaultUserInput = {
        email: "",
        password: ""
    }
    const [userInput, setUserInput] = useState(defaultUserInput);
    const {email, password} = userInput;

    const onValueChange =(e)=>{
        setUserInput({...userInput, [e.target.name]: e.target.value});
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await loginUser(userInput);
        if(response.data.status == "success") {
            const cookies = new Cookies();
            cookies.set('userToken', response.data.token, { path: '/', SameSite : "None; secure" });
            if(props.theme === undefined){
                cookies.set('theme', "light", { path: '/' });
                props.setTheme("light");
            }else{
                props.setTheme(props.theme);
            }
            navigate('/home');
        } else {
            toast.error(response.data.message);
        }
    }
    
    return (
        <div style={{height: "100vh"}} className="container-fluid d-flex flex-column flex-sm-row align-items-center justify-content-center gap-5">
            <div className=''>
                <img className='img-fluid float-end start-logo' src={logo} alt="" />
            </div> 
            <div className="login border rounded rounded-4 d-flex flex-column justify-content-center p-4">
                <div className="align-self-center mb-3 billabong title">Kodegram</div>
                <form action="" onSubmit={(e)=> handleSubmit(e)}>
                    <div className="mb-4">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" name="email" id="email" autoComplete="on" onChange={(e)=> onValueChange(e)} value={email} required/>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" name="password" id="password" onChange={(e)=> onValueChange(e)} value={password} required/>
                    </div>
                    <div className="mb-5 form-check">
                        <input type="checkbox" className="form-check-input" id="checkBoxPass" onClick={()=> showPassword()}/>
                        <label className="form-check-label" htmlFor="checkBoxPass">Show Password</label>
                    </div>
                    <div className="mb-3">
                        <p className="form-label">Dont have an account yet?&nbsp;
                            <Link to={"/user/register"}>
                            Sign Up 
                            </Link>
                        </p>
                    </div>
                    <div className="d-flex justify-content-center mb-1">
                        <button type="submit" className="btn btn-primary rounded-pill" style={{width: 150}}>Login</button>
                    </div>
                </form>
            </div>
            <ToastContainer draggable={false}/>
        </div>
    )
}

export default Login