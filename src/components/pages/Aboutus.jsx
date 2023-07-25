import React, { useState, useEffect} from 'react';
import { setTitle } from '../../assets/js/script';
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from '../../axios/api';
import Cookies from 'universal-cookie';
import Sidenav from '../partials/Sidenav';
import ModalCreatePost from '../partials/ModalCreatePost';
import ModalLoading from '../partials/ModalLoading';
import ModalComplete from '../partials/ModalComplete';
import iconlogo from '../../assets/img/circle-logo.png';

const Aboutus = (props) => {
    setTitle('About Us');
    let navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('userToken');
    const [likeModal, setLikeModal] = useState(0);

    const [user, setUser] = useState({});
    const {user_id, username, pic} = user;
    const authentication = async (token) =>{
        const response = await getUserFromToken({token: token});
        if(response.data.status == "success") {
            setUser(response.data.user);
        } else {
            navigate('/user/login');
        }
    }

    useEffect( () =>{
        authentication(token);
    }, []);

    return (
        <div>
            <Sidenav
                user_id={user_id}
                username={username}
                pic={pic}
                likeModal={likeModal}
                setLikeModal={setLikeModal} 
                theme={props.theme}
                setTheme={props.setTheme}
            />

            <div className={`home container-fuild justify-content-center ${props.theme}`} style={{minHeight: "100vh"}}>
                <ModalCreatePost
                    user_id={user_id}
                    username={username}
                    pic={pic}
                    page={"aboutus"}
                    theme={props.theme}
                />
                <button id="modalLoadingBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalLoading" hidden></button>
                <ModalComplete theme={props.theme}></ModalComplete>
                <button id="modalCompleteBtn" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalComplete" hidden></button>
                <ModalLoading theme={props.theme}></ModalLoading>

                <div className='container-fluid d-flex flex-column p-5'>
                    <div className='d-flex align-items-center mb-3'>
                        <img className="my-1 me-3" src={iconlogo} style={{height: "50px"}} alt="Instagram" />
                        <h1 className='p-0 m-0'>Kodegram</h1>
                    </div>
                    <p>This is our final Capstone Project for our Codecamp in KodeGo and we named the project Kodegram</p>
                    <p>Kodegram is a fullstack web application developed by a team of four using the MERN stack, Firebase, and Sass for customized CSS. The purpose of Kodegram is to provide a social media platform that is similar to Instagram in terms of its features and functionalities.</p>
                    <p>The name Kodegram is derived from the name of the code camp attended by the development team, KodeGo, and the popular social media platform Instagram. This name reflects the inspiration behind the project and the team's goal to create a unique and innovative social media platform.</p>
                    <p>Using the MERN stack, Kodegram leverages the power of MongoDB, Express, React, and Node.js to provide a seamless user experience. Firebase is used for authentication, database management, while SASS is used to create personalized CSS styles that are unique to Kodegram.</p>
                    <p>The development team has worked tirelessly to create a user-friendly interface that includes a range of features such as photo sharing, user profiles, a news feed, likes, comments, and direct messaging. The team has also implemented advanced search functionality to help users discover new content and connect with other users.</p>
                    <p>Overall, Kodegram is an exciting project that showcases the power of modern web development tools and technologies. The development team has put in a tremendous amount of effort to create a platform that is both user-friendly and innovative, and they are excited to share their creation with the world.</p>
                    <p className='fs-4 mt-2'>Problem and Solution</p>
                    <p><span className='fw-bold'>Problem:</span> Many social media platforms have become overly commercialized, making it difficult for users to connect with each other authentically and share their interests and passions.</p>
                    <p><span className='fw-bold'>Solution:</span> Kodegram provides a social media platform that focuses on creating a community of like-minded individuals who are passionate about sharing their experiences and interests with each other. By providing advanced search functionality, Kodegram allows users to easily find and connect with others who share their hobbies and interests, creating a space where authentic connections can flourish. Additionally, by prioritizing user-generated content and personalized feeds, Kodegram ensures that users are seeing content that is meaningful and relevant to them, rather than being bombarded with ads and promotional content. Overall, Kodegram's solution helps to create a more authentic and engaging social media experience for users.</p>
                </div>
            </div>
        </div>
    )
}

export default Aboutus