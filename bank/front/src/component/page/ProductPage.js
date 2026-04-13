import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Grid2 as Grid, TextField} from '@mui/material';
import { postCreate } from "../../requests";


function renderText(label, multiline, handler, type = "string") {
    const slotProps = multiline ? 
    { htmlInput: {
        maxLength: 200,
    }} : 
    { htmlInput: {
        maxLength: 30,
    }};

    return (
        <TextField
            label={label}
            type={type}
            fullWidth
            multiline={multiline}
            slotProps={{...slotProps}}
            onChange={handler}
        />
    );
}

function ProductPage() {
    const [userInput, setUserInput] = useState({
        description: '',
        content: '',
        price: '',
        error: ''
    });

    const navigate = useNavigate();

    const changeUserInput = (data, value) => 
        setUserInput({...userInput, [data]: value});

    const createHandler = () => {
        const {error, ...productData} = userInput;
        changeUserInput('error', '');
        
        postCreate({
            data: productData,
            handler: () => navigate('/profile/'),
            excHandler: (err) => {
                changeUserInput('error', err.response.data)
            }
        });
    }

    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignContent="center"
            className="PageFrame"
            sx={{bgcolor: "color.secondary"}}
        >   
            <Grid item sx={{width: "50%"}}>
                <Grid 
                    container 
                    direction="column"
                    spacing="12px" 
                    sx={{
                        marginBottom:"10vh",
                        padding: "12px",
                        border: "1px solid",
                        borderColor: "color.text",
                        bgcolor: "color.background",
                        borderRadius: "0.375rem"
                    }}
                >
                    <Grid item sx={{color: "color.text"}}>Creating Product</Grid>
                    <Grid item>
                        {renderText("Description", true, 
                            (event)=>{changeUserInput('description', event.target.value)})}
                    </Grid>
                    <Grid item>
                        {renderText("Content", true, 
                            (event)=>{changeUserInput('content', event.target.value)})}
                    </Grid>
                    <Grid item>
                        {renderText("Price", false, 
                            (event)=>{changeUserInput('price', event.target.value)}, "number")}
                    </Grid>
                    <Grid item className="ProductErrorLabel">
                        {userInput.error}
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            sx={{
                                borderColor: "color.text",
                                color: "color.text",
                                maxWidth: "120px", 
                                minWidth: "120px"
                            }}
                            onClick={createHandler}
                        >
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ProductPage;