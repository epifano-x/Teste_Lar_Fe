import { Route, Routes } from "react-router-dom";

import Home from "./views/Home.js";
import NotFound from "./views/NotFound";


const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<Home />}/>

            <Route path="*" element={<NotFound />}/>
        </Routes>
    );
}

export default AppRoutes;