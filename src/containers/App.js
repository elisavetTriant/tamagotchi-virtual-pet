import React, {useState, useEffect, useRef, useCallback} from 'react';
import disasterPet from '../assets/character/disaster-pet.svg';
import exercisePet from '../assets/character/exercise-pet.svg';
import foodPet from '../assets/character/food-pet.svg';
import mischiefPet from '../assets/character/mischief-pet.svg';
import sickPet from '../assets/character/sick-pet.svg';
import tricksPet from '../assets/character/tricks-pet.svg';
import welcomePet from '../assets/character/welcome-pet.svg';
import {useParams} from 'react-router-dom';
import {accurateInterval} from '../utils/helpers.js';
import Copyright from '../components/Copyright';
import Character from '../components/Character';
import LinearProgressWithLabel from '../components/LinearProgressWithLabel';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { StaticBanner } from 'material-ui-banner';
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
  avatarLarge: {
  	width: 72,
    height: 72,
  }
  }));

//Helper functions
 
 function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else if (response.status === 429){
    return Promise.resolve(response)
  }else {
    return Promise.reject(new Error(response.statusText))
  }
 }

 function json(response) {
  return response.json()
 }

 const stayInRange = (stat) => {
  	if (stat >= 0 && stat <= 100)
	    return stat;
	 else if (stat > 100)
	    return 100;
	else
	    return 0;
  }

const getCharacter = (eventType) => {
  
  let eventGraphic;

  switch(eventType) {
	case 'Natural Disaster':
		eventGraphic = disasterPet;
		break;
	case 'Food':
		eventGraphic = foodPet;
		break;
	case 'Mischief':
		eventGraphic = mischiefPet;
		break;
	case 'Disease':
		eventGraphic = sickPet;
		break;
	case 'Tricks':
		eventGraphic = tricksPet;
		break;
	case 'Exercise':
		eventGraphic = exercisePet;
		break;
	default:
		eventGraphic = welcomePet;
	}

	return eventGraphic;
}


export default function App() {

const [name, setName] = useState('Pippin');
const [dayDuration, setDayDuration] = useState(1000); //in miliseconds
const [age, setAge] = useState(0);
const [health, setHealth] = useState(100);
const [hunger, setHunger] = useState(0);
const [happiness, setHappiness] = useState(100);
const [gameEnd, setGameEnd] = useState(false);
const [dialogOpen, setDialogOpen] = useState(false);
const timeoutRef = useRef();
const eventTimeoutRef = useRef();
const classes = useStyles();
const {petName, dayDurationInSeconds} = useParams();



 const beginLife = () => {
    let timeOutInfo = accurateInterval(() => {
          petDay();
        }, dayDuration) 
    timeoutRef.current = timeOutInfo;
    //console.log(timeoutRef.current)
 }

  const handleNextEvent = (nextEvent) => {
  	/*timeoutRef.current is null when starting a new game. 
  	This condition also keeps the app from fetching when the game has ended
  	*/
  	if (timeoutRef.current !== null) {
	  	let nextEventInfo = accurateInterval(() => {
	          getNextEvent();
	        }, nextEvent)
	    eventTimeoutRef.current = nextEventInfo;
    	//console.log(eventTimeoutRef.current);
    }
  }

  const getNextEvent = () => {
  	
		fetch('https://www.virtual-pet.uk/v1/event')
			.then(status)
			.then(json)
			.then(function(data) {
			    if(data.type === 'Error'){
			    	 console.log('Request failed', data);
			    	 if (eventTimeoutRef.current) {
						    eventTimeoutRef.current.cancel();
						    eventTimeoutRef.current = null;
						 }
			    	 handleNextEvent(data.nextEvent * dayDuration);
			    } else {
			    	console.log('Request succeeded with JSON response', data);
				    setHealth((prev) => stayInRange(prev + data.impact.health));
					setHunger((prev) => stayInRange(prev + data.impact.hunger));
					setHappiness((prev) => stayInRange(prev + data.impact.happiness));
					handleOpenBanner(data.type.toUpperCase() + "! " + data.title + ": " + data.description + " Impact, health: " + data.impact.health + " hunger: " + data.impact.hunger + " happiness: " + data.impact.happiness, getCharacter(data.type));
					if (eventTimeoutRef.current) {
						    eventTimeoutRef.current.cancel();
						    eventTimeoutRef.current = null;
						 }
					handleNextEvent(data.nextEvent * dayDuration); 
				}			    	

			 }).catch(function(error) {
			    console.log('Request failed', error);
			 });
		  	
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
	setGameEnd(false);
  }

  //helper functions
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleOpenBanner = useCallback((text, eventTypeGraphic) => StaticBanner.show({
  		icon: <div />,
  		iconProps : {
  			src: eventTypeGraphic,
  			className:  classes.avatarLarge
  		},
	    open:  true,
	    label: text,
   }), [classes.avatarLarge]);

  const cleanup = () => {
     //Cancel timers
		if (timeoutRef.current) {
	      timeoutRef.current.cancel();
	      
	    }
	    if (eventTimeoutRef.current) {
		  eventTimeoutRef.current.cancel();
		}

		timeoutRef.current = null;
		eventTimeoutRef.current = null;
   }
  
  //Effects

  useEffect(() => {
   if (health <= 0 ) {   	 
   	 setDialogOpen(true);
	 setGameEnd(true);
   }
  }, [health]);

  useEffect(() => {
  	if (!gameEnd) { 		
  		
  		if (petName !== undefined) {
			 setName(decodeURIComponent(petName))
		}

		if (dayDurationInSeconds !== undefined && !Number.isNaN(parseInt(dayDurationInSeconds)) ) {
		   let inputedDuration = parseInt(dayDurationInSeconds)
		   if (inputedDuration<=0){
		  	 setDayDuration(1000);
		   } else if (inputedDuration > 60) {
		  	 setDayDuration(60*1000);
		   } else {
		  	 setDayDuration(inputedDuration*1000);
		   }  
		} else {
			setDayDuration(1000);
		}

	  	beginLife(); 

	  	handleNextEvent(5 * dayDuration);

  	} else {
  		cleanup();
  	}

  	return cleanup;

  }, [gameEnd, petName, dayDurationInSeconds, dayDuration]);

  return (
  	<React.Fragment>
  	   <CssBaseline />
  	   <StaticBanner />
		<Grid container component="main" className={classes.root}>
	      <Paper className={classes.paper}>
	        <Grid container spacing={2}>
	          <Grid item xs={8} sm={8} md={6} container>
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
			  		<Button onClick={resetGame}>{gameEnd? "Play again!" : "Reset Game"}</Button>
	              </Grid>
	            </Grid>
	          </Grid>
	          <Grid item xs={4} sm={4} md={6}>
	              <Character name={name} happiness={happiness} age={age} health={health} />
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
		        <DialogTitle id="alert-dialog-title">Game Over.</DialogTitle>
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