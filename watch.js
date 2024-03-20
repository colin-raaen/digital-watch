//Let forms load first before executing
document.addEventListener('DOMContentLoaded', function(){
    const page = document.getElementById("body");
    const digitalClockBtn = document.getElementById("digitial-clock-btn");
    const timerBtn = document.getElementById("timer-btn");
    const stopwatchBtn = document.getElementById("stop-watch-btn");
    const digitalClockWrapper = document.getElementById("clock-wrapper");
    const timerWrapper = document.getElementById("timer-wrapper");
    const stopWatchWrapper = document.getElementById("stop-watch-wrapper");

    const timer = document.getElementById("timer");
    const timerStart = document.getElementById("start-timer");
    const timerStop = document.getElementById("stop-timer");
    const timerReset = document.getElementById("reset-timer");
    const stopAlarmBtn = document.getElementById("stop-alarm");
    const alarmSound = document.getElementById("alarm-audio");
    let countTimerBool = false; // boolean store whether to count timer
    let timerComplete = false; // boolean to store whether timer is complete or not
    let timerIntervalId; // variable to store Interval ID to call clearInverval function to stop timer counting
    const timerInput = document.getElementById("timer-input"); // user input field for timer

    const stopWatch = document.getElementById("stopwatch"); 
    const startBtn = document.getElementById("start-stop-watch");
    const stopBtn = document.getElementById("stop-stop-watch");
    const resetBtn = document.getElementById("reset-stop-watch");
    let countStopWatchBool = false; // boolean store whether to count stop watch
    let stopWatchIntervalId; // variable to store Interval ID to call clearInverval function to stop watch counting

    // Toggle to digital clock initially on page load
    handleToggle(digitalClockWrapper, timerWrapper, stopWatchWrapper); // call function to toggle to digital clock
    handleColorToggle(digitalClockBtn, timerBtn, stopwatchBtn); // call function to toggle button color

    // delegated event listener, listen for clicks to entire page
    page.addEventListener('click', function(event){
        // HANDLE TOGGLE
        // if Digital clock button is toggled
        if (event.target === digitalClockBtn){
            handleToggle(digitalClockWrapper, timerWrapper, stopWatchWrapper); // call function to toggle to digital clock
            handleColorToggle(digitalClockBtn, timerBtn, stopwatchBtn); // call function to toggle button color
        }

        // if timer button is toggled
        if (event.target === timerBtn){
            handleToggle(timerWrapper, digitalClockWrapper, stopWatchWrapper); // call function to toggle to timer
            handleColorToggle(timerBtn, digitalClockBtn, stopwatchBtn); // call function to toggle button color
        }

        // if stop watch button is toggled
        if (event.target === stopwatchBtn){
            handleToggle(stopWatchWrapper, digitalClockWrapper, timerWrapper); // call function to toggle to stop watch
            handleColorToggle(stopwatchBtn, timerBtn, digitalClockBtn); // call function to toggle button color
        }

        // HANDLE TIMER
        // if TIMER START button is clicked
        if (event.target === timerStart){
            countTimerBool = true; // set countTimerBool to true to start calling function to update timer
        }

        // If TIMER STOP button is clicked
        if (event.target === timerStop){
            countTimerBool = false; // set bool to false
            clearInterval(timerIntervalId); // kill timer counting function call
            timerIntervalId = null; // set interval ID to null to allow restart of timer
        }

        // if TIMER RESET button is clicked
        if (event.target === timerReset){
            handleResetTimer(); // call function to handle stop watch reset
        }

        // if TIMER is clicked for user input/edit
        if (event.target === timer){
            handleEditTimer(); // call function to handle editing timer
        }

        // if Stop Alarm button is pressed, called alarm toggle function
        if (event.target === stopAlarmBtn){
            stopAlarm();
        }

        // continously call timer function to count stop watch as long as watch hasn't been shut off
        if (countTimerBool){
            // Check if timerIntervalId is not already set, used to prevent double time counting
            if (!timerIntervalId) {  
                timerIntervalId = setInterval(countTimer, 1000); // update stop watch every second
            }
        }

        // if STOP WATCH START is clicked and not already counting
        if (event.target === startBtn && countStopWatchBool === false){
            countStopWatchBool = true; // set countStop to true to start calling function to update stopwatch
        }

        // if STOP WATCH STOP button was clicked and stop watch is currently counting
        if (event.target === stopBtn && countStopWatchBool === true){
            countStopWatchBool = false; // set bool to false
            clearInterval(stopWatchIntervalId); // kill stop watching counting function call
            stopWatchIntervalId = null; // Set interval ID to null to allow restart of stopwatch
        }

        // if STOP WATCH RESET button is clicked
        if (event.target === resetBtn){
            handleResetStopWatch(); // call function to handle stop watch reset
        }

        // continously call stopwatch function to count stop watch as long as watch hasn't been shut off
        if (countStopWatchBool){
             // Check if stopWatchIntervalId is not already set, used to prevent double time counting
            if (!stopWatchIntervalId) { 
                stopWatchIntervalId = setInterval(countStopWatch, 10); // update stop watch every 100 milliseconds
            }
        }
    });

    // HANDLE STOPWATCH
    // Calling showTime function at every second
    setInterval(updateDigitalClock, 1000);

    function handleToggle(showElement, hideElementOne, hideElementTwo){
        showElement.style.display = "block"; // unhide appropriate div of button clicked
        hideElementOne.style.display = "none";
        hideElementTwo.style.display = "none";
    }

    // function to toggle button colors of current function
    function handleColorToggle (showButton, hideButtonOne, hideButtonTwo){
        showButton.style.backgroundColor = "red"; // highlight button clicked red
        hideButtonOne.style.backgroundColor = ""; // unhighlight other button
        hideButtonTwo.style.backgroundColor = "";
    }
    
    // Function to calculate showTime and update HTML
    function updateDigitalClock() {
        // Getting current time and date
        let time = new Date(); // create a date object
        let hour = time.getHours(); // get current hour
        let min = time.getMinutes(); // get current Minutes
        let sec = time.getSeconds(); // get current second using method
        let am_pm = "AM"; // am/pm initally to AM
    
        // Setting time for 12 Hrs format
        // if current hour is in PM
        if (hour >= 12) {
            if (hour > 12) {
                hour -= 12; // decrement by 12
                am_pm = "PM"; // swith to PM
            }
        } else if (hour == 0) { // is hour is in midnight hour
            hr = 12; // set hour to 12
            am_pm = "AM"; // swith to AM
        }
    
        // ternary statement for time formatting, if hour/min/secon is less than 10, add 0 to left of current integer
        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
    
        // concatenate hours, mins, seconds and am/pm
        let currentTime = hour + ":" + min + ":" + sec + am_pm;
    
        // Update HTML element with calculated time
        document.getElementById("clock").innerHTML = currentTime;
    }

    // function to handle timer reset click
    function countTimer(){
        // Get current timer time
        const getCurrentTime = timer.textContent;
        
        // split and store time string at :
        const timeSplits = getCurrentTime.split(":")
        // store hour, min, sec, centisec in indivual array of variables using map function
        let [hour, min, sec] = timeSplits.map(Number);

        // validate input of user into timer, if any condition evaluates to true, throw alert and kill timer
        if (!Number.isInteger(hour) || hour < 0 || !Number.isInteger(min) || min < 0 || !Number.isInteger(sec) || sec < 0){
            alert("Please enter a valid time in the form HH:MM:00"); // alert user
            handleResetTimer(); // Call handle reset function to kill time
            return; // don't execute rest of function
        }

        // if 0 seconds and still minutes to count off, decrement minute and set second
        if (sec === 0 && min > 0){
            sec = 59; // reset millisec
            min -= 1; // decrement minute
        } // else if still seconds to count off
        else if (sec > 0){
            sec -= 1; // decrement second by one
        }

        // if 0 minute and still hours on the board, decrement hour, reset min
        if (min === 0 && hour > 0){
            min = 59; // reset second
            hour -= 1; // decrement hour
        }

        // if base case for timer occurs, count down is finished
        if (sec === 0 && min === 0 && hour === 0){
            countTimerBool = false; // set bool to stop timer from executing
            timerComplete = true; // set timer complete to true to prevent timer decrement
        }
       
        // ternary statement for time formatting, if hour/min/second is less than 10, add 0 to left of current integer
        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;

        // concatenate hours, mins, seconds with template literal
        let newTimerTime = `${hour}:${min}:${sec}`;
        // update HTML element
        timer.innerHTML = newTimerTime;
        
        // after HTML has been updated, if timer is at end, kill setInterval and sound timer
        if (!countTimerBool && timerComplete){
            clearInterval(timerIntervalId); // kill timer counting function call
            playAlarm(); // call function to sound alarm
        }
    }

    // Function to handle user editing Timer
    function handleEditTimer(){
        // kill countdown if timer is currently counting 
        if (countTimerBool){
            countTimerBool = false; // reset to false
            clearInterval(timerIntervalId); // kill stop watching counting function call
            timerIntervalId = null; // set interval ID to null to allow restart of timer
        }

        timer.style.display = "none"; // Hide timer
        timerInput.style.display = "block"; // unhide user input field for timer

        // update user input field with whatever value is currently in the timer field
        timerInput.value = timer.textContent; // Update the content with the input value

        // Add an event listener to the input field to save changes on blur
        timerInput.addEventListener('blur', function () {
            timer.textContent = timerInput.value; // Update the timer with the input value
            timer.style.display = "block"; // Reshow timer
            timerInput.style.display = "none"; // rehide the input field
            // saveIcon.style.display = "none"; // Hide the input field
        });
    }

    // function to handle timer reset click
    function handleResetTimer(){
        // if timer is currently counting down when reset button is clicked
        if (countTimerBool && !timerComplete){
            timerComplete = false; // reset to false to allow new timer
            countTimerBool = false; // reset to false
            clearInterval(timerIntervalId); // kill stop watching counting function call
            timerIntervalId = null; // set interval ID to null to allow restart of timer
        }
        let resetTime = "00:05:00"; // string to reset stop watch to
        // update HTML element
        timer.innerHTML = resetTime;
    }

    // function to handle toggling alarm on and off
    function playAlarm(){
        stopAlarmBtn.style.display = "inline-block"; // show Stop Alarm Button
        // Stop the muted attribute to allow the alarm sound
        alarmSound.muted = false;
        alarmSound.play(); // play the alarm sound
    }

    // function to stop alarm
    function stopAlarm(){
        alarmSound.pause(); // Stop the alarm sound
        timerComplete = false; // reset to allow a new alarm
        alarmSound.muted = true; // Mute the alarm audio again
        countTimerBool = false; // reset countTimerBool alarm new timer to start
        timerIntervalId = null; // set interval ID to null to allow restart of timer
        stopAlarmBtn.style.display = "none"; // rehide Stop Alarm Button
    }

    // function to count stop watch
    function countStopWatch(){
        // Get current stopwatch time
        const getCurrentTime = stopWatch.textContent;
        
        // split and store time string at :
        const timeSplits = getCurrentTime.split(":")
        // store hour, min, sec, centisec in indivual array of variables using map function
        let [hour, min, sec, centiSec] = timeSplits.map(Number);

        centiSec += 1; // increment centiSecond by one

        // if 1000 milleseconds, increment second
        if (centiSec === 100){
            centiSec = 0; // reset millisec
            sec += 1;
        }

        // if 60 seconds, increment minute
        if (sec === 60){
            sec = 0; // reset second
            min += 1;
        }

        // if 60 minutes, increment hour
        if (min === 60){
            min = 0; // reset minute
            hour += 1;
        }

        // ternary statement for time formatting, if hour/min/secon is less than 10, add 0 to left of current integer
        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        centiSec = centiSec < 10 ? "0" + centiSec : centiSec;

        // concatenate hours, mins, seconds and centiseconds with template literal
        let newStopWatchTime = `${hour}:${min}:${sec}:${centiSec}`;
        // update HTML element
        stopWatch.innerHTML = newStopWatchTime;
    }

    // function to handle stop watch reset click
    function handleResetStopWatch(){
        // if stop watching is currently counting when reset button is clicked
        if(countStopWatchBool){
            countStopWatchBool = false; // reset to false
            clearInterval(stopWatchIntervalId); // kill stop watching counting function call
            stopWatchIntervalId = null; // set to null to allow for timer to start again
        }
        let resetTime = "00:00:00:00"; // string to reset stop watch to
        // update HTML element
        stopWatch.innerHTML = resetTime;
    }
});
