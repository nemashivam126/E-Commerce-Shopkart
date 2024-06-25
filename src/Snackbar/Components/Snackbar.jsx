import { Snackbar, Alert, Slide } from "@mui/material";
import { useDispatch, useSelector } from "react-redux"
import { addSnackbarState } from "../../Redux/Snackbar/SnackbarSlice";

function SnackBar() {
    const dispatch = useDispatch();
    const { snackbarOpen, snackbarMessage, snackbarSeverity } = useSelector((state) => state.snackbar)
    const handleCloseSnackbar = () => {
        dispatch(addSnackbarState({snackbarOpen: false}))
    }
    if(!snackbarOpen) {
        return null;
    }
    
  return (
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
    >
        <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity}
        >
            {snackbarMessage}
        </Alert>
    </Snackbar>
  )
}

export default SnackBar
