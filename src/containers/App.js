import {useLocation } from 'react-router';

export default function App() {
  const location = useLocation()
  console.log(location)
  return location.state!==undefined? <h2>I got the name {location.state.data}!</h2> : <h2>I'm still unnamed!</h2>
}