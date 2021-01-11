import welcomePet from '../assets/character/welcome-pet.svg';
import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {accurateInterval} from '../utils/helpers.js';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
 root: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  paper: {
    padding: theme.spacing(2),
    margin: '2rem auto',
    maxWidth: 680,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  }));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        Tamagotchi Inspired Virtual Pet Game
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function App() {

const [name, setName] = useState('Pippin');
const [age, setAge] = useState(0);
const [health, setHealth] = useState(100);
const [hunger, setHunger] = useState(0);
const [happiness, setHappiness] = useState(100);
const [gameEnd, setGameEnd] = useState(false);
const [dialogOpen, setDialogOpen] = useState(false);
const timeoutRef = useRef();
const {petName} = useParams();
const classes = useStyles();


 const beginLife = () => {
    let timeOutInfo = accurateInterval(() => {
          petDay();
        }, 1000) //TODO: Updatable day time - defaults to 1 sec 
    timeoutRef.current = timeOutInfo;
 }

 const petDay = () => {
	setAge((prev) => prev + 1);
	setHealth((prev) => stayInRange(prev - 1));
	setHunger((prev) => stayInRange(prev + 1));
	setHappiness((prev) => stayInRange(prev - (Math.floor(Math.random() * 5) + 1)));
  }

  const cleanPet = () => {
  	if (!gameEnd) {
  		setHealth((prev) => stayInRange(prev + 1));
  	}
  }

  const feedPet = () => {
  	if (!gameEnd) {
  		setHunger((prev) => stayInRange(prev - 1));
  	}
  }

  const playPet = () => {
  	if (!gameEnd) {
  		setHappiness((prev) => stayInRange(prev + (Math.floor(Math.random() * 5) + 1))); // random reduction between 1 -> 5)
  	}
  }

  const resetGame = () => {
  	setAge(0);
	setHealth(100);
	setHunger(0);
	setHappiness(100);
	if (timeoutRef.current) {
      timeoutRef.current.cancel();
    }
    setGameEnd(false);
    beginLife();
  }

  //Helper functions
  const stayInRange = (stat) => {
  	if (stat >= 0 && stat <= 100)
	    return stat;
	 else if (stat > 100)
	    return 100;
	else
	    return 0;
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };


  //Effects

  useEffect(() => {
   if (health <= 0 ) {
   	 setGameEnd(true);
   	 setDialogOpen(true);
   	 //stop the life timer...
   	 if (timeoutRef.current) {
      timeoutRef.current.cancel();
    }
   }
  }, [health]);

  useEffect(() => {
	if (petName !== undefined) {
	 setName(petName)
	}
  }, [petName]);

  // Equivalent to componentDidMount(). Starts the Life timer. Runs only once.
  // eslint-disable-next-line
  useEffect(() => {beginLife()}, []);

  return (
  	<React.Fragment>
  	   <CssBaseline />
		<Grid container component="main" className={classes.root}>
	      <Paper className={classes.paper}>
	        <Grid container spacing={2}>
	          <Grid item xs={12} sm={12} md={6} container>
	            <Grid item xs container direction="column" spacing={2}>
	              <Grid item xs>
	                <Typography variant="h2">
	                  {name}
	                </Typography>
	                <Typography variant="h6">
	                  Age: {age}
	                </Typography>
	                 <Typography variant="body1">
	                  Health: 
	                </Typography>
	                <LinearProgressWithLabel value={health} />
	                <Typography variant="body1">
	                  Hunger: 
	                </Typography>
	                <LinearProgressWithLabel value={hunger} />
	                <Typography variant="body1">
	                  Happiness: 
	                </Typography>
	                <LinearProgressWithLabel value={happiness} />
	                <ButtonGroup color="primary" variant="contained" aria-label="outlined primary button group">
					  <Button disabled={gameEnd} onClick={cleanPet}>Clean</Button>
					  <Button disabled={gameEnd} onClick={feedPet}>Feed</Button>
					  <Button disabled={gameEnd} onClick={playPet}>Play</Button>
					</ButtonGroup>
			  		<Button disabled={gameEnd} onClick={resetGame}>Reset Game</Button>
	              </Grid>
	            </Grid>
	          </Grid>
	          <Grid item xs={12} sm={12} md={6}>
	              <img className={classes.img} alt={name} src={welcomePet} />
	          </Grid>    
	        </Grid>
	      </Paper>
		  <Copyright />
    	</Grid>
    	{gameEnd && 
    		 <Dialog
		        open={dialogOpen}
		        onClose={handleDialogClose}
		        aria-labelledby="alert-dialog-title"
		        aria-describedby="alert-dialog-description"
		      >
		        <DialogTitle id="alert-dialog-title">Game Over!</DialogTitle>
		        <DialogContent>
		          <DialogContentText id="alert-dialog-description">
		           Great job! Let's play again!
		          </DialogContentText>
		        </DialogContent>
		        <DialogActions>
		          <Button onClick={handleDialogClose} color="primary">
		            Close
		          </Button>
		          <Button onClick={resetGame} color="primary" autoFocus>
		            Start Over!
		          </Button>
		        </DialogActions>
      		</Dialog>
    	}
    </React.Fragment>
  )
}