import { RouterProvider } from 'react-router-dom'
import './App.css'
import { AppRoutes } from './Routes/AppRoutes/AppRoute'
import SnackBar from './Snackbar/Components/Snackbar'
import CustomTheme from './Theme/CustomTheme/CustomTheme';
import { useSelector } from 'react-redux';

function App() {
  const AppTheme = useSelector((state) => state.theme.theme);

  return (
    <div style={{backgroundColor: AppTheme === 'Dark' ? CustomTheme.CustomColor[AppTheme].dark : 'transparent', height: '100vh'}}>
      <RouterProvider router={AppRoutes} />
      <SnackBar />
    </div>
  )
}

export default App
