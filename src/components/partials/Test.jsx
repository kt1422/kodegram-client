import React, { useState, useEffect, useRef } from 'react';
import { getUserFromToken, getConvo, url } from '../../axios/api';
import Cookies from 'universal-cookie';

const Test = (props) => {
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const [chater, setchater] = useState({});

    const authentication = async (token) =>{
        const response = await getUserFromToken({token: token});
        if(response.data.status == "success") {
            setchater(response.data.user);
        } else {
            navigate('/user/login');
        }
    }
    useEffect(() => {
        authentication(token);
    }, []);

    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        
        if (props.socket.current) {
            props.socket.current.on("msg-recieve", (data) => {
                if(props.socket.current){console.log("good");}
                setArrivalMessage("yehey");
            });
        }
    }, [props.currentUser]);

    useEffect(() => {
        if(arrivalMessage !== null){
            console.log("yehey");
        }
    }, [arrivalMessage]);

    return (
        <div>test</div>
    )
}

export default Test