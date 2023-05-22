import {Route, Routes, Navigate, BrowserRouter} from "react-router-dom";
import CityList from "./Components/City/CityList";
import CityForm from "./Components/City/CityForm";
import ZoneList from "./Components/Zone/ZoneList";
import ZoneForm from "./Components/Zone/ZoneForm";
import ListPharmacies from "./Components/Pharmacy/ListPharmacies";
import 'bootstrap/dist/css/bootstrap.min.css';
import MapComponent from "./Components/Map/PharmaciesOnMap";
import React, {useEffect, useState} from "react";
import './App.css'
import Home from "./Components/Layout/Home";
import Notiflix from "notiflix";
import CreatePharmacy from "./Components/Pharmacy/CreatePharmacy";
import OndutyAvailable from "./Components/Pharmacy/OndutyAvailable";
import OndutyHistory from "./Components/Pharmacy/OndutyHistory";
import AboutPage from "./Components/Layout/Aboutpage";
import Layout from "./Components/Layout/Layout";
import {Container} from "react-bootstrap";
import RegistrationForm from "./Components/RegistrationForm";
import LoginForm from "./Components/LoginForm";
import AuthService from "./Services/auth.service";
import ProfilePage from "./Components/ProfilePage";
import AuthVerify from "./Services/AuthVerify";
import PharmacyForm from "./Components/Pharmacy/PharmacyForm";
import OndutyForm from "./Components/OndutyPharmacy/OndutyForm";
import ZoneByCity from "./Components/Zone/ZoneByCity";

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
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);

        }

    }, []);


    const logOut = () => {
        localStorage.removeItem("user");
        setCurrentUser(undefined); // Set the currentUser state to undefined after logging out
    };
    return (
        <BrowserRouter>
            <Layout currentUser={currentUser}>


                {/* Add AuthVerify component */}
                <AuthVerify logOut={logOut}/>
                <Container style={{
                    backgroundColor: "#00141e", minHeight: "100vh", display: "flex", flexDirection: "column"
                }}>

                    <div className="content-container">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/home" element={<Home/>}/>
                            <Route path='/about' element={<AboutPage/>}/>
                            <Route path="/profile" element={(!currentUser) ? <Navigate to="/"/> : <ProfilePage/>}/>
                            <Route path="/login" element={(currentUser) ? <Navigate to="/"/> : <LoginForm/>}/>
                            <Route path="/register"
                                   element={(currentUser) ? <Navigate to="/profile"/> : <RegistrationForm/>}/>

                            {currentUser && currentUser.role === "ADMIN" && (<>
                                    <Route path="/cities" element={<CityList/>}/>
                                    <Route path="/add-city" element={<CityForm/>}/>
                                    <Route path="/zones" element={<ZoneList/>}/>
                                    <Route path="/add-zone" element={<ZoneForm/>}/>
                                    <Route path="/zones/zone/:zoneId/pharmacies" element={<ListPharmacies/>}/>
                                    <Route path="/add-pharmacy" element={<CreatePharmacy/>}/>
                                    <Route path="/ondutypharmacies/history" element={<OndutyHistory/>}/>
                                    <Route path="/zonesbycity" element={<ZoneByCity/>}/>
                                </>

                            )}
                            {currentUser && currentUser.role === "OWNER" && <>
                                <Route path="/pharmacy" element={<PharmacyForm/>}/>
                                <Route path="/ondutypharmacy" element={<OndutyForm/>}/>
                            </>}
                            <Route path="/ondutypharmacies/available" element={<OndutyAvailable/>}/>
                            <Route path="/ondutypharmacies/available/now" element={<OndutyAvailable/>}/>
                            <Route path="/pharmacies" element={<ListPharmacies/>}/>
                            <Route path="/map" element={<MapComponent/>}/>
                        </Routes>
                    </div>
                </Container>

            </Layout>
        </BrowserRouter>
    );
}

export default App;
