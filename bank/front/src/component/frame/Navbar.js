import {useNavigate} from "react-router-dom";
import {Grid2 as Grid, Button} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

import NavButton from "../field/NavButton";
import { getLogout } from "../../requests";


function Navbar(props) {
    const {HOME, PROFILE, PRODUCT, balance} = props;

    const navigate = useNavigate();
    const gotoPage = (value) => () => {
        navigate(value);
    };

    const logout = () => {
        getLogout({
            handler: () => window.location.reload(),
            excHandler: (err) => console.log(err.response.data)
        })
    };

    return (
        <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                width: "100%",
                height: "10vh",
                padding: "2px 32px 2px 16px",
                borderBottom: "1px solid",
                borderColor: "color.text",
                bgcolor: "color.primary",
                overflow: "hidden",
            }}
        >
            <Grid item sx={{maxHeight: "10vh"}}>
                <Grid container alignItems="center" spacing="32px">
                    <Grid item>
                        <img src={"/logo.png"} alt="Logo" width={70} onClick={gotoPage(HOME)}/>
                    </Grid>
                    <Grid item sx={{color: "color.text"}}>
                            {`BALANCE: ${balance}$`}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    spacing="12px"
                    wrap="nowrap"
                >
                    <Grid item>
                        <NavButton text="home" handler={gotoPage(HOME)}/>
                    </Grid>
                    <Grid item>
                        <NavButton text="create product" handler={gotoPage(PRODUCT)}/>
                    </Grid>
                    <Grid item>
                        <NavButton text="profile" handler={gotoPage(PROFILE)} disableDivider/>
                    </Grid>
                    <Grid item sx={{marginLeft: "48px"}}>
                        <Button 
                            sx={{color: "color.text"}}
                            endIcon={<LogoutIcon sx={{color:"color.text"}}/>}
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Navbar;
