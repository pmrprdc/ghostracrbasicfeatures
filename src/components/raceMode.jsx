import React, { useState, useEffect } from 'react';

const RaceMode = ({ taskBatches, savedTimedTasks, onTaskBatchSave }) => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRacing, setIsRacing] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRacing && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRacing && remainingTime === 0) {
      setIsRacing(false);
      setGameOver(true);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRacing, remainingTime]);

  const getTaskDuration = (taskName) => {
    const savedTask = savedTimedTasks.find(
      (task) => task.batch === selectedBatch.name && task.taskName === taskName
    );
    return savedTask ? savedTask.duration : 0;
  };

  const startRace = () => {
    if (selectedBatch) {
      setCurrentTaskIndex(0);
      setRemainingTime(getTaskDuration(selectedBatch.tasks[0].name));
      setIsRacing(true);
      setGameOver(false);
      setShowSavePrompt(false);
    }
  };

  const finishTask = () => {
    if (currentTaskIndex === selectedBatch.tasks.length - 1) {
      setIsRacing(false);
      setShowSavePrompt(true);
    } else {
      setCurrentTaskIndex((prevIndex) => prevIndex + 1);
      setRemainingTime(getTaskDuration(selectedBatch.tasks[currentTaskIndex + 1].name));
    }
  };

  const saveRecord = () => {
    const updatedBatch = {
      ...selectedBatch,
      tasks: selectedBatch.tasks.map((task, index) => ({
        ...task,
        duration: index <= currentTaskIndex ? getTaskDuration(task.name) - remainingTime : getTaskDuration(task.name),
      })),
    };
    onTaskBatchSave(updatedBatch);
    setShowSavePrompt(false);
    setSelectedBatch(null);
    setCurrentTaskIndex(0);
    setRemainingTime(0);
  };

  const discardRecord = () => {
    setShowSavePrompt(false);
    setSelectedBatch(null);
    setCurrentTaskIndex(0);
    setRemainingTime(0);
  };

  return (
    <div>
      <h2>Race Mode</h2>
      <select
        value={selectedBatch ? selectedBatch.name : ''}
        onChange={(e) => {
          const selectedBatchName = e.target.value;
          const batch = taskBatches.find((batch) => batch.name === selectedBatchName);
          setSelectedBatch(batch);
        }}
      >
        <option value="">Select a batch</option>
        {taskBatches.map((batch, index) => (
          <option key={index} value={batch.name}>
            {batch.name}
          </option>
        ))}
      </select>
      {selectedBatch && !isRacing && !showSavePrompt && !gameOver && (
        <div>
          <button onClick={startRace}>Start Race</button>
        </div>
      )}
      {selectedBatch && isRacing && (
        <div>
          <h3>Current Task: {selectedBatch.tasks[currentTaskIndex].name}</h3>
          <p>Remaining Time: {remainingTime} seconds</p>
          <button onClick={finishTask}>Finish Task</button>
        </div>
      )}
      {gameOver && (
        <div>
          <p>Game Over! You did not beat the previous record for this task.</p>
        </div>
      )}
      {showSavePrompt && (
        <div>
          <p>Congratulations! You beat the previous record for all tasks.</p>
          <button onClick={saveRecord}>Save New Record</button>
          <button onClick={discardRecord}>Discard</button>
        </div>
      )}
    </div>
  );
};

export default RaceMode;