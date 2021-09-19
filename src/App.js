import './App.scss';
import { useState, useEffect, useRef } from 'react'


const audioSrc = "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [colors, setColors] = useState('#b2dfdb')

  function getRandomColor() {
    var letters = 'BCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return setColors(color);
}

  let player = useRef(null);
  
  const breakSound = () => {
    player.currentTime = 0;
    player.play();
  }

  useEffect(() => {
    if(displayTime <= 0){
      setOnBreak(true);
      breakSound();
    }else if(!timerOn && displayTime === breakTime){
      setOnBreak(false);
    }
  }, [breakTime, displayTime, timerOn, sessionTime, onBreak])

  const formatDisplayTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
  }
  const formatTime  = (time) => {
    return Math.floor(time / 60);
  }

  const changeTime = (amount, type) => {
    if(type === "break"){
      if((breakTime <= 60 && amount < 0 ) || (breakTime >= 60 * 60 && amount > 0)){
        return;
      }
      setBreakTime((prev) => prev + amount)
    } else {
      if((sessionTime <= 60  && amount < 0) || (sessionTime >= 60 * 60  && amount > 0)){
        return;
      }
      setSessionTime((prev) => prev + amount);
      if(!timerOn){
        setDisplayTime(sessionTime + amount)
      }
    }
  }

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak; 
    
  if(!timerOn){
    let interval = setInterval(() => {
      date = new Date().getTime();
      if(date > nextDate){
        setDisplayTime((prev) => {
          if(prev <= 0 && !onBreakVariable){
            onBreakVariable = true;
            return breakTime;
          }else if (prev  <= 0 && onBreakVariable){
            onBreakVariable = false;
            setOnBreak(false);
            return sessionTime;
          }
          return prev - 1;
        });
        nextDate += second;
        getRandomColor();
      }
    }, 30)
    localStorage.clear();
    localStorage.setItem('interval-id', interval)
  }
    if(timerOn){
      clearInterval(localStorage.getItem('interval-id'));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    clearInterval(localStorage.getItem('interval-id'));
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    player.pause();
    player.currentTime = 0;
    setTimerOn(false);
    setOnBreak(false);
  }


  return (
    <div className="App">
      <header className="App-header">
          <h1>Pomodoro Clock</h1>
          <div className="dual-container">
            <Length 
              title={"Break Length"} 
              changeTime={changeTime} 
              type={"break"} 
              time={breakTime} 
              formatTime={formatTime} 
            />
            <Length 
              title={"Session Length"} 
              changeTime={changeTime} 
              type={"session"} 
              time={sessionTime} 
              formatTime={formatTime}
            />
          </div>
          <div className="display">
            <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
            <h2 id="time-left" style={{color: colors}}>{formatDisplayTime(displayTime)}</h2>
          </div>
          <div className="display-buttons">
            <button id="start_stop" className="btn-large teal lighten-2" onClick={controlTime}>
              {timerOn ? (
                <i className="material-icons">pause_circle_filled</i>
              ) : (
                <i className="material-icons">play_circle_filled</i>
            ) }
            </button>
            <button id="reset" className="btn-large teal lighten-2" onClick={() => resetTime()}>
              <i className="material-icons">autorenew</i>
            </button>
          </div>          
        <audio ref={(t) => (player = t)} src={audioSrc} id="beep" />
      </header>
      <span id="da3ker" style={{color: colors}}>by da3ker</span>
    </div>
  );
}

function Length({title, changeTime, type, time, formatTime }) {
  return (
    <div id={type === "break" ? "break-container" : "session-container"}>
      <h3 id={type === "break" ? "break-label" : "session-label"}>{title}</h3>
      <div className="time-sets">
        <button className="btn-small teal lighten-2"
          onClick={() => {changeTime(-60, type)}}
          id={type === "break" ? "break-decrement" : "session-decrement"}
        >
          <i className="material-icons">keyboard_arrow_down</i>
        </button>
        <h3 id={type === "break" ? "break-length" : "session-length"}>{formatTime(time)}</h3>
        <button className="btn-small teal lighten-2"
          onClick={() => changeTime(60, type)}
          id={type === "break" ? "break-increment" : "session-increment"}
        >
          <i className="material-icons">keyboard_arrow_up</i>
        </button>
      </div>
    </div>
  );
}

export default App;
