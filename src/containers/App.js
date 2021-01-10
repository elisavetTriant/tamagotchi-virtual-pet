import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {accurateInterval} from '../utils/helpers.js';

export default function App() {
  const [name, setName] = useState('Pippin');
  const [age, setAge] = useState(0);
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(0);
  const [happiness, setHappiness] = useState(100);
  const [gameEnd, setGameEnd] = useState(false);
  const timeoutRef = useRef();
  const {petName} = useParams();


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

  //Effects

  useEffect(() => {
   if (health <= 0 ) {
   	 setGameEnd(true);
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
  	<div>
	  	<h2>Name: {name}</h2>
	  	<p>Age: {age}</p>
	  	<p>Health: {health}</p>
	  	<p>Hunger: {hunger}</p>
	  	<p>Happiness: {happiness}</p>
	  	<p>
			<button disabled={gameEnd} onClick={cleanPet}>Clean</button>
		  	<button disabled={gameEnd} onClick={feedPet}>Feed</button>
		  	<button disabled={gameEnd} onClick={playPet}>Play</button>
	  	</p>
	  	<p>
	  		<button disabled={gameEnd} onClick={resetGame}>Reset Game</button>
	  	</p>
	  	{gameEnd && 
	  		<div>
		  		<h3>Game Over!</h3>
		  		<button disabled={!gameEnd} onClick={resetGame}>Start Over!</button>
	  		</div>
	  	}
	</div>
  )
}