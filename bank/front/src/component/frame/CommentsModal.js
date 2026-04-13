import { useState } from "react";
import {Grid2 as Grid, TextField, Button} from "@mui/material";
import { postComment } from "../../requests";
import CommentLine from "../field/CommentLine";


function CommentsModal(props) {
    const {pid, comments, closeComments} = props;
    const [content, setContent] = useState('');
    
    const sendComment = () => {
        postComment({
            pid: pid,
            data: {'content': content},
            handler: setContent('')
        });
    };

    var commentContent = comments.length > 0 ? 
        (
            <Grid 
                container 
                direction="column" 
                sx={{width: "100%", paddingRight: "6px"}}
            >
                {comments.sort((a,b) => a.id - b.id).map(comment => 
                    <CommentLine
                        key={comment.id}
                        comment={comment}
                    />
                )}
            </Grid>
        ) : (
            <Grid 
                container
                justifyContent="center"
                alignItems="center"
                sx={{height: "100%"}}
            >
                <Grid item sx={{color: "color.text"}}>
                    No comments
                </Grid>
            </Grid>
            
        );
        
    return(
        <Grid
            container
            direction="column"
            sx={{height: "100%", padding: "24px"}}
        >
            <Grid item className="CommentModal">
                {commentContent}
            </Grid>
            <Grid item sx={{height: "15%"}}>
                <Grid 
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item sx={{width: "80%", maxWidth: "80%"}}>
                        <Grid container>
                            <Grid item sx={{width: "80%", maxWidth: "80%"}}>
                                <TextField
                                    label="Comment"
                                    slotProps={{htmlInput: {maxLength: 100}}}
                                    sx={{bgcolor: "color.background", color: "color.text"}}
                                    value={content}
                                    onChange={(event) => setContent(event.target.value)}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item sx={{width: "5%", maxWidth: "5%"}}>
                                <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            marginLeft: "12px",
                                            borderColor: "color.background",
                                            bgcolor: "color.background",
                                        }}
                                        onClick={sendComment}
                                    >
                                        send
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                marginRight: "14px",
                                borderColor: "color.background",
                                bgcolor: "color.background",
                                width: "120px",
                                maxWidth: "120px"
                            }}
                            onClick={closeComments}
                        >
                            close
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default CommentsModal;