import { Outlet } from "react-router-dom"
import ResponsiveAppBar from "../../AppBar/Components/Appbar"

const Dashboard = () => {
  return (
    <div>
      <div className="mb-20"><ResponsiveAppBar /></div>
      <Outlet />
    </div>
  )
}

export default Dashboard
