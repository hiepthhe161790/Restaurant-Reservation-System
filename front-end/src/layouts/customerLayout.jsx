import { Outlet } from 'react-router-dom';
import CustomerHeader from '../components/headers/customerHeader';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';

const CustomerLayout = () => {
    return (
        <>
            <Box sx={{ backgroundColor: "black", color: "white" }}>
                <Grid container>
                    <Grid size={12}>
                        <CustomerHeader></CustomerHeader>
                    </Grid>
                    <Grid size={12}>
                        <Outlet />
                    </Grid>
                </Grid >
            </Box>
        </>
    )
}
export default CustomerLayout;