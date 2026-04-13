import {createTheme} from '@mui/material/styles';


function useTheme() {
    return createTheme({
        palette: {
            color: {
                primary: " #ff3d00",
                secondary: " #2c2c2e",
                background: " #ff3d00",
                text: " #ffd600",
                accent: " #00bfae",
            }
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {background: " #ffd600", borderRadius: "0.375rem"},
                }
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {color: " #2c2c2e"},
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        color: " #ffd600",
                        borderColor: " #ffd600"
                    }
                }
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: " #2c2c2e",
                            color: " #2c2c2e",
                        },
                        "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: " #2c2c2e",
                                color: " #2c2c2e",
                            }
                        },
                    }
                }
            },
        }
    });
}

export default useTheme