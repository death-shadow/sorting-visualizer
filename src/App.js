import React, { useState, useEffect } from 'react';
import './App.css';
let cancelSort=false;
function App() {
  const [soundOn, setSoundOn] = useState(true);
  const [array, setArray] = useState([]);

  useEffect(() => {
    generateNewArray();
  }, []);

  const generateNewArray = () => {
    cancelSort=true;
    const newArray = [];
    for (let i = 0; i < 50; i++) {
      newArray.push(Math.floor(Math.random() * 500) + 10); // Random heights between 10 and 510
    }
    setArray(newArray);
    // Reset all bar colors to blue (default)
    const bars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.backgroundColor = 'blue';
    }
    setTimeout(() => {
      cancelSort = false;
    }, 0);
    //setArray(newArray);
  };
  const stopbutton = () => {
    cancelSort=true;
    const bars = document.getElementsByClassName('array-bar');
    for(let i=0;i<bars.length;i++)
    {
      bars[i].style.backgroundColor = 'blue';
    }
  };
  /*const playSound = (frequency = 400, duration = 50) => {
    if (!soundOn) return;
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'square'; // sound wave type: square/sine/sawtooth/triangle
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration / 1000); // convert ms to sec
  };*/
  

  const bubbleSort = async () => {
    const bars = document.getElementsByClassName('array-bar');
    let tempArray = [...array];

    for (let i = 0; i < tempArray.length; i++) {
      for (let j = 0; j < tempArray.length - i - 1; j++) {
        // Highlight the two bars being compared
        if (cancelSort) return;
        bars[j].style.backgroundColor = 'red';
        bars[j + 1].style.backgroundColor = 'red';

        await new Promise(resolve => setTimeout(resolve, 50)); // wait 50ms
        if (cancelSort) return;
        if (tempArray[j] > tempArray[j + 1]) {
          // Swap in tempArray
          //playSound(300);
          let temp = tempArray[j];
          tempArray[j] = tempArray[j + 1];
          tempArray[j + 1] = temp;

          // Swap heights in DOM
          bars[j].style.height = `${tempArray[j]}px`;
          bars[j + 1].style.height = `${tempArray[j + 1]}px`;
        }

        // Reset bar colors after comparison
        bars[j].style.backgroundColor = 'blue';
        bars[j + 1].style.backgroundColor = 'blue';
      }

      // Mark the last sorted bar
      bars[tempArray.length - i - 1].style.backgroundColor = 'green';
    }

    setArray(tempArray); // Update the state
  };
  const selectionSort = async () => {
  const bars = document.getElementsByClassName('array-bar');
  const tempArray = [...array];
  const n = tempArray.length;

  for (let i = 0; i < n; i++) {
    if (cancelSort) return;
    let minIdx = i;

    // highlight the current anchor bar
    bars[i].style.backgroundColor = 'orange';

    for (let j = i + 1; j < n; j++) {
      if (cancelSort) return;
      bars[j].style.backgroundColor = 'red';          // bar under comparison
      //playSound(200 + j * 5);
      await new Promise(res => setTimeout(res, 50));

      if (tempArray[j] < tempArray[minIdx]) {
        // un‑highlight previous min (unless it’s the anchor bar)
        if (minIdx !== i) bars[minIdx].style.backgroundColor = 'blue';
        minIdx = j;
      } else {
        // restore colour if it’s not new minimum
        bars[j].style.backgroundColor = 'blue';
      }
    }

    // swap values & heights if a new minimum was found
    if (minIdx !== i) {
      [tempArray[i], tempArray[minIdx]] = [tempArray[minIdx], tempArray[i]];
      bars[i].style.height       = `${tempArray[i]}px`;
      bars[minIdx].style.height  = `${tempArray[minIdx]}px`;
      bars[minIdx].style.backgroundColor = 'blue';    // reset swapped‑out bar
    }

    bars[i].style.backgroundColor = 'green';          // mark as sorted
  }

  setArray(tempArray);
};
  const mergeSort = async () => {
    const bars = document.getElementsByClassName('array-bar');
    const tempArray = [...array];            // make a local working copy
    await mergeSortHelper(tempArray, 0, tempArray.length - 1, bars);
    setArray(tempArray);                      // final state update
  };

  const mergeSortHelper = async (arr, start, end, bars) => {
    if (start >= end || cancelSort) return;
    const mid = Math.floor((start + end) / 2);

    await mergeSortHelper(arr, start,   mid,     bars);
    await mergeSortHelper(arr, mid + 1, end,     bars);
    await merge(arr,           start,   mid, end, bars);

    /* optional: colour whole segment green when this level is fully sorted */
    if (end - start === arr.length - 1) {
      for (let i = start; i <= end; i++) bars[i].style.backgroundColor = 'green';
    }
};

const merge = async (arr, start, mid, end, bars) => {
  const left  = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    if (cancelSort) return;

    /* highlight bar k where the next value will be placed */
    bars[k].style.backgroundColor = 'red';
    await new Promise(res => setTimeout(res, 50));

    if (left[i] <= right[j]) {
      arr[k] = left[i];
      bars[k].style.height = `${left[i]}px`;
      i++;
    } else {
      arr[k] = right[j];
      bars[k].style.height = `${right[j]}px`;
      j++;
    }
    bars[k].style.backgroundColor = 'blue';
    k++;
  }

  /* copy any leftover items */
  while (i < left.length) {
    if (cancelSort) return;
    bars[k].style.backgroundColor = 'red';
    await new Promise(res => setTimeout(res, 50));
    arr[k] = left[i];
    bars[k].style.height = `${left[i]}px`;
    bars[k].style.backgroundColor = 'blue';
    i++; k++;
  }
  while (j < right.length) {
    if (cancelSort) return;
    bars[k].style.backgroundColor = 'red';
    await new Promise(res => setTimeout(res, 50));
    arr[k] = right[j];
    bars[k].style.height = `${right[j]}px`;
    bars[k].style.backgroundColor = 'blue';
    j++; k++;
  }
};
  return (
    <div className="App">
      <h1 className="main-heading">Sorting Visualizer</h1>
      <div className="array-container">
        {array.map((value, index) => (
          <div
            className="array-bar"
            key={index}
            style={{
              height: `${value}px`,
              backgroundColor: 'blue',
              width: '10px',
              margin: '0 2px',
            }}
          ></div>
        ))}
      </div>
      <div className="button-container">
        <button onClick={generateNewArray}>Generate New Array</button>
        <button onClick={bubbleSort}>Bubble Sort</button>
        <button onClick={selectionSort}>Selection Sort</button>
        <button onClick={stopbutton}>Stop</button>
      </div>
    </div>
  );
}

export default App;
