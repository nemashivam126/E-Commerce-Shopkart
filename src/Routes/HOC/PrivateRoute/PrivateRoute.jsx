import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({children}) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (isAuthenticated === false || isAuthenticated === undefined) return (<Navigate to={'/login'} />)
  if (user && user.isAdmin) return <Navigate to="/admin" />;
    
  return (
    children
  );
}

export default PrivateRoute
