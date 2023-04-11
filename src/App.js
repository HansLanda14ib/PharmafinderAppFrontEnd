import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import CityList from "./Components/City/CityList";
import CityForm from "./Components/City/CityForm";
import ZoneList from "./Components/Zone/ZoneList";
import ZoneForm from "./Components/Zone/ZoneForm";
import ListPharmacies from "./Components/Pharmacy/ListPharmacies";
import 'bootstrap/dist/css/bootstrap.min.css';
import MapComponent from "./Components/Map/PharmaciesOnMap";
import React from "react";
import './App.css'
import Home from "./Components/Layout/Home";
import Notiflix from "notiflix";
import ErrorPage from "./Components/error-page";
import CreatePharmacy from "./Components/Pharmacy/CreatePharmacy";
import OndutyAvailable from "./Components/Pharmacy/OndutyAvailable";
import OndutyHistory from "./Components/Pharmacy/OndutyHistory";
import AboutPage from "./Components/Layout/Aboutpage";
import Layout from "./Components/Layout/Layout";


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
        <Layout>
        <Router>
            <div className="app-container">

                <div className="content-container">
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route exact path="/home" element={<Home/>}/>

                        <Route path="/cities" element={<CityList/>}/>
                        <Route path="/add-city" element={<CityForm/>}/>

                        <Route path="/zones" element={<ZoneList/>}/>
                        <Route path="/add-zone" element={<ZoneForm/>}/>
                        <Route path="/zones/zone/:zoneId/pharmacies" element={<ListPharmacies />}/>

                        <Route path="/pharmacies" element={<ListPharmacies/>}/>
                        <Route path="/add-pharmacy" element={<CreatePharmacy/>}/>

                        <Route path="/ondutypharmacies/history" element={<OndutyHistory/>}/>
                        <Route path="/ondutypharmacies/available" element={<OndutyAvailable/>}/>
                        <Route path="/ondutypharmacies/available/now" element={<OndutyAvailable/>}/>
                        <Route path="/map" element={<MapComponent/>}/>
                        <Route path='*' element={<ErrorPage/>} />
                        <Route path='/about' element={<AboutPage/>} />

                    </Routes>
                </div>
            </div>

        </Router>
            </Layout>
    );
}

export default App;
