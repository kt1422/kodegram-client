import './assets/css/app.css';
import './assets/css/sidenav.css';
import React from "react";
import {BrowserRouter} from "react-router-dom"; 
import Router from "./router/Router";
import ScrollToTop from './components/partials/ScrollToTop';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart as faHeartRegular, faComment, faPaperPlane,
    faBookmark, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid, faEllipsis, faMagnifyingGlass, faPhotoFilm, faSearch, faPlusSquare,
    faUserCircle, faMessage, faQuestionCircle, faHome, faSun, faMoon, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
library.add(faHeartRegular, faHeartSolid, faComment, faPaperPlane, faBookmark, faEllipsis, faPenToSquare,
    faMagnifyingGlass, faPhotoFilm, faSearch, faPlusSquare, faUserCircle, faMessage,
    faQuestionCircle, faHome, faSun, faMoon, faAngleLeft);

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Router/>
        </BrowserRouter>
    )
}

export default App
