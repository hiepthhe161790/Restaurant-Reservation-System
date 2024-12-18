import { Outlet } from 'react-router-dom';
import GuestHeader from '../components/headers/guestHeader';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
const GuestLayout = () => {
    return (
        <>
            <Box sx={{ backgroundColor: "black", color: "white" }}>
                <Grid container >
                    <Grid size={12}>
                        <GuestHeader></GuestHeader>
                    </Grid>
                    <Grid size={12} >
                        <Outlet />
                    </Grid>
                </Grid >
            </Box>
        </>
    )
}
export default GuestLayout;