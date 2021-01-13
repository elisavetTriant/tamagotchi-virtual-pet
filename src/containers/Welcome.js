import welcomePet from '../assets/character/welcome-pet.svg';
import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import Copyright from '../components/Copyright';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${welcomePet})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Welcome() {
  const history = useHistory();
  const classes = useStyles();
  const [nameValue, setNameValue] = useState('');

  
 const handleChange = (event) => {
    setNameValue(event.target.value);
 }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (nameValue !== '') {
      history.push('/play/' + nameValue.toString());
    }
  }  

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Start your game by giving your pet a name!
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} method="post">
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="pet-name"
              label="Your Pet Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={nameValue} onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Start Game!
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}