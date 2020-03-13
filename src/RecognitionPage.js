import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import axios from 'axios';

export function RecognitionPage () {

    const useStyles = makeStyles(theme => ({
        holder: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        paperTest: {
            padding: theme.spacing(2.5, 2.5, 2.5, 2.5),
            margin: theme.spacing(0, 2, 2, 0),
            overflow: 'auto',
            minWidth: '20%',
            float: 'left',
        },
        topDivider: {
            margin: theme.spacing(1, 0, 2, 0),
        },
      }));

    const classes = useStyles();

    return (
        
        <div className="holder">   
            <Paper className={classes.paperTest}>
                <Typography variant="h5" noWrap>Recognition Page</Typography>
                <Divider className ={classes.topDivider}/>
                <GetResponses/>
            </Paper>
        </div>
        
    );

}

function GetResponses() {
    axios({
        method: 'get',
        url: 'http://localhost:5000/recognitions', //https://acecle-facerec-test-server.herokuapp.com/recognitions
    }).then((response) => {
        console.log(response.data)
    }).catch((response) => {
        console.log(response);
    });
    return null
}