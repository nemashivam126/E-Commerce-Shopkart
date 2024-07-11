import Box from "@mui/material/Box";
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import CustomTheme from "../../Theme/CustomTheme/CustomTheme";
import { setApplicationTheme } from "../../Redux/ThemeSlice/Theme";
import { DarkMode, LightMode } from "@mui/icons-material";

const DarkModeToggleButton = () => {
    const dispatch = useDispatch();
    const AppTheme = useSelector((state) => state.theme.theme);
    const [rotation, setrotation] = useState(0)
    const handleModeChange = () => {
        setrotation(rotate => rotate === 0 ? 360 : 0)
        setTimeout(() => {
            if(AppTheme === "Dark") {
                dispatch(setApplicationTheme("Blue"));
            } else {
                dispatch(setApplicationTheme("Dark"));
            }
        }, 100);
    }
  return (
    <Box sx={{background: CustomTheme.CustomColor[AppTheme].dark, borderRadius: "50px", mr: 1}}>
        <IconButton 
            title={AppTheme === "Dark" ? "Turn On Light Mode" : "Turn On Dark Mode"} 
            color="inherit" 
            onClick={handleModeChange} 
            sx={{ transform: `rotate(${rotation}deg)` , transition: 'transform 0.5s' }}
        >
            {AppTheme === "Dark" ? <DarkMode sx={{color:CustomTheme.CustomColor.Common.dullWhite}} /> : <LightMode />}
        </IconButton>
    </Box>
  )
}

export default DarkModeToggleButton;
