import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom"

const PublicRoute = ({children}) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (isAuthenticated && !user.isAdmin) return (<Navigate to={'/'} />)
  if (isAuthenticated && user.isAdmin) return (<Navigate to={'/admin'} />)

  return (
    children
  )
}

export default PublicRoute
