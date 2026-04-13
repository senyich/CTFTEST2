import { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Grid2 as Grid, TextField} from '@mui/material';
import { postLogin } from '../../requests';
import Cookies from 'js-cookie';


function AuthPage (props) {
    const {setAuthorized, REGISTER} = props;

    const [userInput, setUserInput] = useState({
        login: '',
        password: '',
        error: ''
    });
    
    const navigate = useNavigate();
    const gotoPage = (value) => () => {
        navigate(value);
    };

    const changeUserInput = (data, value) => 
        setUserInput({...userInput, [data]: value});

    const login = () => {
        changeUserInput('error', '');
        postLogin({
            data: {username: userInput.login, password: userInput.password},
            handler: () => {
                setAuthorized(true);
            },
            excHandler: (err) => {
                Cookies.remove('jwt');
                changeUserInput('error', err.response.data);
            }
        });
    };

    return (
        <Grid
            container
            spacing="12px"
            className="AuthPageGrid"
            direction="column"
            sx={{bgcolor: "color.secondary"}}
        >
            <Grid item>
                <img src={"/logo.png"} alt="Logo" width={120}/>
            </Grid>
            <Grid className="AuthLabel" item sx={{color: "color.text"}}>
                SIGN IN TO CYBERBANK
            </Grid>
            <Grid
                className="AuthTextGrid"
                item
                sx={{
                    position: "relative",
                    bgcolor: "color.background",
                    border: 1,
                    borderColor: "color.text"
                }}
            >
                <Grid 
                    container 
                    direction="column"
                    alignItems="flex-end"
                >
                    <Grid item className="AuthGridField">
                        <TextField
                            onChange={
                                (event) => {changeUserInput('login', event.target.value)}
                            }
                            label={"Name"}
                            value={userInput.login}
                            size="small"
                            slotProps={{htmlInput: {
                                maxLength: 32
                            }}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item className="AuthGridField" sx={{marginBottom: "0"}}>
                        <TextField
                            onChange={
                                (event) => {changeUserInput('password', event.target.value)}
                            }
                            label={"Password"}
                            value={userInput.password}
                            type="password"
                            size="small"
                            slotProps={{htmlInput: {
                                maxLength: 32
                            }}}
                            fullWidth
                        />
                    </Grid>
                    <Grid item className="AuthErrorLabel">
                        {userInput.error}
                    </Grid>
                    <Grid item className="AuthGridField">
                        <Button
                            variant="outlined"
                            onClick={login}
                            fullWidth
                        >
                            Sign in
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            className="SignUpButton"
                            variant="outlined"
                            onClick={gotoPage(REGISTER)}
                        >
                            Sign up
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AuthPage;