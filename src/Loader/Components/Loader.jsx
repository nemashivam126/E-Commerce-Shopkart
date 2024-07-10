import React from 'react';
import { Backdrop, Box, CircularProgress, Fade, Typography } from '@mui/material';

const Loader = ({ loading, text }) => {
  if (!loading) {
    return null; // Return null if loading is false
  }

  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      open={loading}
    >
      <Fade in={loading}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: 'transparent',
            borderRadius: 2,
            p: 3,
          }}
        >
          <CircularProgress size={70} />
          {text && <Typography mt={2}>{text}</Typography>} {/* Display custom text if provided */}
        </Box>
      </Fade>
    </Backdrop>
  );
};

export default Loader;
