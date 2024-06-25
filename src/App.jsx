import { RouterProvider } from 'react-router-dom'
import './App.css'
import { AppRoutes } from './Routes/AppRoutes/AppRoute'
import SnackBar from './Snackbar/Components/Snackbar'

function App() {

  return (
    <>
      <RouterProvider router={AppRoutes} />
      <SnackBar />
    </>
  )
}

export default App
