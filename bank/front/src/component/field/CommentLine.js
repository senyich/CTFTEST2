import { Component } from "react";
import {Grid2 as Grid} from "@mui/material";


class CommentLine extends Component {
    render() {
        const {comment} = this.props;
        const commentDate = new Date(comment.created);
        const formattedDate = `${commentDate.toLocaleTimeString()} ${commentDate.toLocaleDateString()}`;

        return (
            <Grid item >
                <Grid 
                    container
                    direction="column"
                    className="CommentLine"
                    sx={{borderColor: "color.text", bgcolor: "color.background"}}
                >
                    <Grid item sx>
                        {comment.content}
                    </Grid>
                    <Grid item sx={{width: "100%"}}>
                        <Grid 
                            container
                            justifyContent="space-between"
                        >
                            <Grid 
                                item 
                                className="CommentDetails"
                                sx={{color: "color.text"}}
                            >
                                {comment.userName}
                            </Grid>
                            <Grid 
                                item 
                                className="CommentDetails"
                                sx={{color: "color.text"}}
                            >
                                {formattedDate}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default CommentLine;