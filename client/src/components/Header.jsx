import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';


function Header() {

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ backgroundColor: "#222222" }}>
                    <Toolbar>
                        <Button color="inherit" >
                            <Link to="/addHero"  >
                                <UploadIcon htmlColor='white' fontSize='large' sx={{ marginTop: "5px" }} />
                            </Link>
                        </Button>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/" >Superheroes</Link>
                        </Typography>

                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}

export default Header;
