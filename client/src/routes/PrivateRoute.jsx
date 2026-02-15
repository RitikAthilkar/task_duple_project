import { Navigate } from "react-router-dom";
import { useAuth } from "../global/AuthContex";
import Workspace from "../pages/Workspace";
import UserDashboard from "../pages/UserDashboard";    
import {isAuth, loading} from '../global/AuthContex'
export const PrivateRoute = ({ children }) => {
    const { isAuth, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return isAuth ? children : <Navigate to="/login" />;
};

export const Authorization = ({ children }) => {
    
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return user.role=='admin' ? children : <Navigate to="/" />;
};

export const RoleBasedAccess = () => {

    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return user.role == 'admin' ? <Workspace /> : <UserDashboard />;
};


