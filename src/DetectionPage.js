import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import WebcamDetection from './WebcamDetection';

export function DetectionPage () {

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
                <Typography variant="h5" noWrap>Live Face Detection</Typography>
                <Divider className ={classes.topDivider}/>
                <WebcamDetection/>
            </Paper>
        </div>
        
    );
}