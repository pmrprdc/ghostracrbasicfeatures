import React, { useState } from 'react';
import TaskManager from './components/TaskManager';
import TimerMode from './components/TimerMode';
import RaceMode from './components/RaceMode';

const App = () => {
  const [taskBatches, setTaskBatches] = useState([]);
  const [savedTimedTasks, setSavedTimedTasks] = useState([]);

  const handleTaskBatchAdd = (batchName, newTasks) => {
    const timestamp = new Date().toLocaleString();
    const batchWithTimestamp = {
      name: batchName,
      tasks: newTasks,
      timestamp,
    };
    setTaskBatches([...taskBatches, batchWithTimestamp]);
  };

  const handleTaskBatchDelete = (batchIndex) => {
    const updatedBatches = taskBatches.filter((_, index) => index !== batchIndex);
    setTaskBatches(updatedBatches);
  };

  const handleSavedTimedTask = (timedTask) => {
    setSavedTimedTasks([...savedTimedTasks, timedTask]);
  };

  const handleTaskBatchSave = (updatedBatch) => {
    const updatedBatches = taskBatches.map((batch) => {
      if (batch.name === updatedBatch.name) {
        return updatedBatch;
      }
      return batch;
    });
    setTaskBatches(updatedBatches);
    const updatedTimedTasks = updatedBatch.tasks.map((task) => ({
      batch: updatedBatch.name,
      taskName: task.name,
      taskColor: task.color,
      duration: task.duration,
    }));
    setSavedTimedTasks([...savedTimedTasks, ...updatedTimedTasks]);
  };

  return (
    <div>
      <h1>Task Timer App</h1>
      <TaskManager onTaskBatchAdd={handleTaskBatchAdd} />
      <TimerMode
        taskBatches={taskBatches}
        onTaskBatchDelete={handleTaskBatchDelete}
        onSavedTimedTask={handleSavedTimedTask}
      />
      <RaceMode
        taskBatches={taskBatches}
        savedTimedTasks={savedTimedTasks}
        onTaskBatchSave={handleTaskBatchSave}
      />
    </div>
  );
};

export default App;