import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Login from '../components/pages/Login';
import Register from '../components/pages/Register';
import Home from '../components/pages/Home';
import Profile from '../components/pages/Profile';
import Aboutus from '../components/pages/Aboutus';
import Settings from '../components/pages/Settings';
import Chat from '../components/pages/Chat';
import Startchat from '../components/partials/StartChat';

const Router = () => {
    const cookies = new Cookies();
    let getTheme = cookies.get('theme');
    const [theme, setTheme] = useState(getTheme);

    return (
        <Routes>
            <Route index element={<Navigate to='/user/login'/>} />
            <Route path='/home' element={<Home theme={theme} setTheme={setTheme}/>} />
            <Route path='/user/login' element={<Login theme={theme} setTheme={setTheme} />} />
            <Route path='/user/register' element={<Register />} />
            <Route path='/user/profile' element={<Profile theme={theme} setTheme={setTheme}/>} />
            <Route path='/user/chat' element={<Chat theme={theme} setTheme={setTheme}/>} />
            <Route path='/user/aboutus' element={<Aboutus theme={theme} setTheme={setTheme}/>} />
            <Route path='/user/settings' element={<Settings theme={theme} setTheme={setTheme}/>} />
            <Route path='/user/test' element={<Startchat theme={theme} setTheme={setTheme}/>} />
        </Routes> 
    )
}

export default Router