import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router";
import { selectCurrentTokenr } from "./authSlice";


const RequireAuth = () => {
    const token = useSelector(selectCurrentTokenr)
    const location = useLocation()

    return (
        token
            ? <Outlet />
            : <Navigate to='/login' state={{from: location}} replace />
    )
}

export default RequireAuth