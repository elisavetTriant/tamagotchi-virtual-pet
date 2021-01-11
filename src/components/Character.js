import React, {useState, useEffect} from 'react';
import bornPet from '../assets/character/born-pet.svg';
import deadPet from '../assets/character/dead-pet.svg';
import disasterPet from '../assets/character/disaster-pet.svg';
import exercisePet from '../assets/character/exercise-pet.svg';
import foodPet from '../assets/character/food-pet.svg';
import happyPet from '../assets/character/happy-pet.svg';
import mischiefPet from '../assets/character/mischief-pet.svg';
import sadPet from '../assets/character/sad-pet.svg';
import sickPet from '../assets/character/sick-pet.svg';
import tricksPet from '../assets/character/tricks-pet.svg';
import welcomePet from '../assets/character/welcome-pet.svg';
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';



const useStyles = makeStyles((theme) => ({
  image: {
    width: 130,
    height: 130,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  }));

export default function Character(props) {
  const classes = useStyles();
  const [src, setSrc] = useState(bornPet);

  useEffect(() => {
    //Preloading character assets
    const imageList = [bornPet, deadPet, disasterPet, exercisePet, foodPet, happyPet, mischiefPet, sadPet, sickPet, tricksPet, welcomePet]
    imageList.forEach((image) => {
        new Image().src = image
    });
  }, []);

  useEffect(() => {
    if (props.age === 0) {
       setSrc(bornPet)
    }else if (props.age > 3) {
      if (props.happiness >= 70) {   
        setSrc(happyPet)
      }else if (props.happiness <= 30){
        setSrc(sadPet)
      }else {
        setSrc(welcomePet)
      }
    }

    if (props.health === 0) {
        setSrc(deadPet)
     }

  }, [props.age, props.happiness, props.health]);


  return (
    <Zoom in={true} style={{ transitionDelay: '500ms' }}>
      <img className={classes.img} alt={props.name} src={src} />
    </Zoom>
  );
}