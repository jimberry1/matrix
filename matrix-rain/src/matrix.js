import { useEffect, useState, useCallback, useRef } from 'react';
import './matrix.css';
import produce from 'immer';

const ALLOWED_VALUES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789*/<>{£';
const MUTATION_PROBABILITY = 0.1;
const TIP_DEATH_PROBABILITY = 0.05;
const TIP_SPAWN_PROBABILITY = 0.2;

const ROW_NUM = 20;
const COL_NUM = 30;

const randomlyGenerateKey = () => {
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += ALLOWED_VALUES.charAt(
      Math.floor(Math.random() * ALLOWED_VALUES.length)
    );
  }
  return result;
};

const Matrix = () => {
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const [objectMatrix, setObjectMatrix] = useState(() => {
    const initialisedState = [];

    for (let i = 0; i < COL_NUM; i++) {
      initialisedState[i] = {
        active: false,
        tipPosition: 0,
        intensityMultiplier: 1,
        rainArray: Array(ROW_NUM).fill(''),
        key2: randomlyGenerateKey(),
      };
    }

    return initialisedState;
  });

  const runSimulationForObject = useCallback(() => {
    setObjectMatrix((oldMatrixArray) => {
      const newMatrix = [];
      for (
        let maxtrixColIndex = 0;
        maxtrixColIndex < oldMatrixArray.length;
        maxtrixColIndex++
      ) {
        // Rain has a random chance of dying, it can't die multiple times, and dies if it reaches the end of the screen.
        const randomNum = Math.random();

        let isActive;
        if (oldMatrixArray[maxtrixColIndex].active) {
          // If the rain is active then give it a small chance of dying and check it hasn't filled the entire length
          isActive =
            randomNum > TIP_DEATH_PROBABILITY &&
            oldMatrixArray[maxtrixColIndex].rainArray[
              oldMatrixArray[maxtrixColIndex].rainArray.length - 1
            ] === '';
        } else {
          // If the rain was dead then give it a chance to spawn only if the entire column is empty
          isActive =
            Math.random() < TIP_SPAWN_PROBABILITY &&
            oldMatrixArray[maxtrixColIndex].rainArray.filter(
              (value) => value !== ''
            ).length === 0;
        }

        let tipPositionIndex;
        const newRainStream = produce(
          oldMatrixArray[maxtrixColIndex].rainArray,
          (gridCopy) => {
            if (oldMatrixArray[maxtrixColIndex].active) {
              for (
                let i = 0;
                i < oldMatrixArray[maxtrixColIndex].rainArray.length;
                i++
              ) {
                if (oldMatrixArray[maxtrixColIndex].rainArray[i] !== '') {
                  gridCopy[i] = persistOldValueAndRandomlyMutate(
                    oldMatrixArray[maxtrixColIndex].rainArray[i]
                  );
                } else {
                  gridCopy[i] = pickRandomCharacter();

                  // Set the rain stream to inactive if it reaches the end
                  if (
                    i ===
                    oldMatrixArray[maxtrixColIndex].rainArray.length - 1
                  ) {
                    isActive = false;
                  }
                  tipPositionIndex = i;
                  break;
                }
              }
            } else {
              // Add code for inactive removal of rain
              for (
                let i = 0;
                i < oldMatrixArray[maxtrixColIndex].rainArray.length;
                i++
              ) {
                if (oldMatrixArray[maxtrixColIndex].rainArray[i] !== '') {
                  gridCopy[i] = '';
                  break;
                }
              }
            }
          }
        );

        console.log('IsActive: ' + isActive);

        newMatrix[maxtrixColIndex] = {
          ...oldMatrixArray[maxtrixColIndex],
          active: isActive,
          tipPosition: isActive ? tipPositionIndex : -1,
          rainArray: newRainStream,
        };
      }
      return newMatrix;
    });

    setTimeout(runSimulationForObject, 50);
  }, []);

  const persistOldValueAndRandomlyMutate = (oldValue) => {
    const randomNumber = Math.random();
    console.log(randomNumber);
    if (randomNumber < MUTATION_PROBABILITY) {
      return pickRandomCharacter();
    }
    return oldValue;
  };

  const pickRandomCharacter = () => {
    const characterArray = Array.from(ALLOWED_VALUES);
    const arrLength = characterArray.length;
    const randomIndex = Math.floor(Math.random() * arrLength);
    return characterArray[randomIndex];
  };

  return (
    <>
      <div className="matrix__grid">
        {/* <div className="matrix__grid"> */}
        {objectMatrix.map((matrixRenderableCol) => {
          return (
            <div className="matrix__column">
              {matrixRenderableCol.rainArray.map((matrixVal, index) => {
                return (
                  <div
                    key={`${matrixRenderableCol.key2}_${index}_${matrixVal}`}
                    className="matrix__value"
                    style={{
                      color:
                        index === matrixRenderableCol.tipPosition
                          ? 'white'
                          : '',
                      textShadow: '0px 0px 8px rgba(32, 194, 14, 0.8)',
                    }}
                  >
                    {matrixVal}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {/* </div> */}
      <button onClick={() => runSimulationForObject()}>Trigger</button>
    </>
  );
};

export default Matrix;

/**
 * Every tick the array has a chance of starting rain at the top
 *
 * Once the array starts the tip moves down, leaving a trail of characters
 *
 * The tip is trakced and remains the only white characters.
 *
 * The characters behind the tip fall off in intensity.
 *
 *
 */

/**
 * Data structure could just be a string of characters, or it could be an object for every column
 *
 * The object would store the following properties:
 *
 * Active: boolean
 * Tip position index: int
 * intensity multiplier: int
 * rain index: int
 * rainArray: String[]
 *
 * This runs into the problem of depth copying however, and when I'm reproducing the values what should I use?
 *
 *
 */
