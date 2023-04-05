import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import CityList from "./Components/CityList";
import CityForm from "./Components/CityForm";
import ZoneList from "./Components/ZoneList";
import ZoneForm from "./Components/ZoneForm";
import PharmacyList from "./Components/PharmacyList";
import 'bootstrap/dist/css/bootstrap.min.css';
import PharmacyForm from "./Components/PharmacyForm";
import MapComponent from "./Components/MapComponent2";

import React from "react";
import Menu from "./Components/Menu";
import './App.css'
import Home from "./Components/Home";

import Notiflix from "notiflix";
import ErrorPage from "./Components/error-page";

Notiflix.Notify.init({
    position: 'center-top', // Notification position
    distance: '10px', // Distance between notifications
    opacity: 1, // Notification opacity
    borderRadius: '12px', // Border radius
    fontFamily: 'inherit', // Font family
    fontSize: '16px', // Font size
    timeout: 3000,
});

function App() {
    return (
        <Router>
            <div className="app-container">
                <Menu/>
                <div className="content-container">
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route exact path="/home" element={<Home/>}/>
                        <Route path="/pharmacies" element={<PharmacyList/>}/>
                        <Route path="/add-pharmacy" element={<PharmacyForm/>}/>
                        <Route path="/cities" element={<CityList/>}/>
                        <Route path="/add-city" element={<CityForm/>}/>
                        <Route path="/zones" element={<ZoneList/>}/>
                        <Route path="/add-zone" element={<ZoneForm/>}/>
                        <Route path="/map" element={<MapComponent/>}/>
                        <Route path='*' element={<ErrorPage/>} />
                    </Routes>
                </div>
            </div>
            {/*<ToastContainer
                position="top-center"
                autoClose={1400}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            /> */}
        </Router>
    );
}

export default App;
