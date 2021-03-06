import React from 'react';
import './App.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from "@material-ui/icons/Menu"
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { DetectionPage } from './DetectionPage';
import { UploadPage } from './UploadPage';
import { RecognitionPage } from './RecognitionPage';

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth, 
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
}));

function App() {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
      setOpen(true);
  };

  const handleDrawerClose = () => {
      setOpen(false);
  };

  return (
    <div className="root">
      <Router basename={process.env.PUBLIC_URL}>
        <AppBar position="fixed" className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
        })}>
            <Toolbar>
            <IconButton edge="start" className={clsx(classes.menuButton, open && classes.hide)} onClick={handleDrawerOpen} color="inherit" aria-label="menu">
                <MenuIcon/>
            </IconButton>
            <Typography id="pageTitle" variant="h6" noWrap>
                Project
            </Typography>
            </Toolbar>
        </AppBar>

        <Drawer className={classes.drawer} variant="persistent" anchor="left" open={open} classes={{paper: classes.drawerPaper,}}>
            <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
            </IconButton>
            </div>
            <Divider />
            <List>
            <ListItem button component={Link} to="/">
                <ListItemIcon><InboxIcon/></ListItemIcon>
                <ListItemText primary="Face Recognition"/>
              </ListItem>
              <ListItem button component={Link} to="/page2">
                <ListItemIcon><InboxIcon/></ListItemIcon>
                <ListItemText primary="Add User"/>
              </ListItem>
              <ListItem button component={Link} to="/page3">
                <ListItemIcon><InboxIcon/></ListItemIcon>
                <ListItemText primary="Recognitions"/>
              </ListItem>
            </List>
        </Drawer>

        <main className={clsx(classes.content, {
            [classes.contentShift]: open,
        })}>
            <div className={classes.drawerHeader}/>
            <div> {/* CONTENT PAGES HERE */}
              <Switch>
                <Route exact path="/">
                  <DetectionPage/>
                </Route>
                <Route path="/page2">
                  <UploadPage/>
                </Route>
                <Route path="/page3">
                  <RecognitionPage/>
                </Route>
              </Switch>
            </div>
            
        </main>
      </Router>
    </div>
  );
}

export default App;
