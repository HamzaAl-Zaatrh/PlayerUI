"use strict";

const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");

const rewindButton = document.getElementById("rewind");
const forwardButton = document.getElementById("forward");

const timeCurrent = document.getElementById("time-current");
const timeDuration = document.getElementById("time-duration");

const progressBar = document.getElementById("progress-bar");

const highButton = document.getElementById("sound-high");
const muteButton = document.getElementById("sound-mute");
const soundButtons = document.querySelectorAll(".sound");

// Change the status of the sound
const changeSound = () => {
  highButton.classList.toggle("active");
  muteButton.classList.toggle("active");
};

for (let i = 0; i < soundButtons.length; i++) {
  soundButtons[i].addEventListener("click", changeSound);
}

// To display the time in form 0:00 [mm:ss]
const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

// Audio Information
const audioDuration = 130; // 2:10

let audioCurrent = 0;
let intervalId;

// play-pause functionality ______________________

const changeStatus = () => {
  // Change the shape of the icon
  playButton.classList.toggle("active");
  pauseButton.classList.toggle("active");
};

// show progress bar range for chrome browsers
const showRangeProgress = (rangeInput) => {
  document.documentElement.style.setProperty(
    "--progress-bar-before-width",
    (rangeInput.value / rangeInput.max) * 100 + "%"
  );
};

progressBar.addEventListener("input", (e) => {
  const progressValue = e.target.value;
  audioCurrent = progressValue;
  showRangeProgress(e.target);
  timeCurrent.textContent = calculateTime(progressValue);
});

const play = () => {
  // To restart playback from the beginning if it is at the end
  // and press the Play button again
  if (audioCurrent === audioDuration) audioCurrent = 0;

  changeStatus();

  // Clear any existing interval
  clearInterval(intervalId);

  // Start the interval to update the progress bar and time
  intervalId = setInterval(() => {
    if (audioCurrent >= audioDuration) {
      // Stop the progress when it reaches the end
      pause();
    } else {
      audioCurrent++;
      progressBar.value = audioCurrent;
    }

    // Update the current time display
    timeCurrent.textContent = calculateTime(progressBar.value);

    // Update the progress bar range
    showRangeProgress(progressBar);
  }, 1000); // Update every second
};

const pause = () => {
  changeStatus();

  // Clear the interval
  clearInterval(intervalId);
};

playButton.addEventListener("click", play);
pauseButton.addEventListener("click", pause);

// rewind-forward functionality _______________
const rewind = () => {
  const newTime = Math.max(audioCurrent - 5, 0); // Subtract 5 seconds, ensuring it doesn't go below 0
  updateProgressBar(newTime);
};

const forward = () => {
  const newTime = Math.min(audioCurrent + 5, audioDuration); // Add 5 seconds, ensuring it doesn't exceed audioDuration
  updateProgressBar(newTime);
};

rewindButton.addEventListener("click", rewind);
forwardButton.addEventListener("click", forward);

const updateProgressBar = (newTime) => {
  audioCurrent = newTime;
  progressBar.value = audioCurrent;
  timeCurrent.textContent = calculateTime(progressBar.value);
  showRangeProgress(progressBar);
};
