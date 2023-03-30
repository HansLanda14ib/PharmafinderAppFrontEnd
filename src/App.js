import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./Components/Layout";
import CityList from "./Components/CityList";
import CityForm from "./Components/CityForm";
import ZoneList from "./Components/ZoneList";
import ZoneForm from "./Components/ZoneForm";
import ZoneByCity from "./Components/ZoneByCity";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Header />
            <div className="main-wrapper">
                <Routes>
                    <Route path="/" element={<CityList />} />
                    <Route path="/create-city" element={<CityForm />} />
                    <Route path="/zone" element={<ZoneList/>} />
                    <Route path="/create-zone" element={<ZoneForm />} />
                    <Route path="/zoneByCity" element={<ZoneByCity />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
