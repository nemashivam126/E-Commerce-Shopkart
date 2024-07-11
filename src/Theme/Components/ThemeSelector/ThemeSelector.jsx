import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Stars } from '@mui/icons-material';
import { setApplicationTheme } from '../../../Redux/ThemeSlice/Theme';
import { useEffect, useState } from 'react';
import CustomTheme from '../../CustomTheme/CustomTheme';

export default function ThemeSelector({menuOpen, handleClose}) {
  const AppTheme = useSelector((state) => state.theme.theme);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(setApplicationTheme(e.target.value));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  useEffect(() => {
    setOpen(menuOpen)
  }, [menuOpen])

  // Extract the keys from CustomTheme.CustomColor
  const themeKeys = Object.keys(CustomTheme.CustomColor);

  // Filter themes with main, light, and dark properties
  const filteredThemes = themeKeys.filter((themeKey) => {
    const theme = CustomTheme.CustomColor[themeKey];
    return theme.main && theme.light && theme.dark;
  }).sort();

  return (
    <div>
      {/* <Button onClick={handleClickOpen}>Open select dialog</Button> */}
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle display={'flex'} justifyContent={'center'}>Select Theme</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center' }}>
            <FormControl sx={{ m: 0.7, minWidth: 150 }} size='small'>
            <InputLabel sx={{color: CustomTheme.CustomColor[AppTheme].dark, fontWeight:'500'}} id="demo-dialog-select-label">Theme</InputLabel>
            <Select
              labelId="demo-dialog-select-label"
              id="demo-dialog-select"
              value={AppTheme}
              onChange={handleChange}
              input={<OutlinedInput label="Theme" />}
              sx={{ color: CustomTheme.CustomColor[AppTheme].main, fontWeight:'bold' }}
              variant='outlined'
              autoFocus
              margin="dense"
            >
              {filteredThemes.map((themeKey) => (
                    <MenuItem key={themeKey} value={themeKey}>{themeKey === 'Green1' ? 'LightGreen' : themeKey === 'Error' ? 'Red' : themeKey}</MenuItem>
              ))}
            </Select>
        </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{justifyContent:'center'}}>
          {/* <Button variant='outlined' onClick={handleClose}>Cancel</Button> */}
          <Button startIcon={<Stars />} variant='outlined' onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}