import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Error from "./pages/error";

export const router = createBrowserRouter([

    {
        path: "/",
        element: <Home/>,
        errorElement: <Error/>,
    }

])