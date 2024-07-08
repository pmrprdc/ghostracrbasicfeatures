import React, { useState } from 'react';

const TaskManager = ({ onTaskBatchAdd }) => {
  const [batchName, setBatchName] = useState('');
  const [newTasks, setNewTasks] = useState(['', '', '']);
  const [selectedColors, setSelectedColors] = useState(['', '', '']);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tasksToAdd = newTasks
      .map((task, index) => ({
        id: Date.now() + index,
        name: task.trim(),
        color: selectedColors[index],
      }))
      .filter((task) => task.name !== '');

    if (tasksToAdd.length > 0) {
      onTaskBatchAdd(batchName, tasksToAdd);
      setBatchName('');
      setNewTasks(['', '', '']);
      setSelectedColors(['', '', '']);
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter batch name"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
        />
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Enter task ${index + 1} name`}
              value={newTasks[index]}
              onChange={(e) => {
                const updatedTasks = [...newTasks];
                updatedTasks[index] = e.target.value;
                setNewTasks(updatedTasks);
              }}
            />
            <select
              value={selectedColors[index]}
              onChange={(e) => {
                const updatedColors = [...selectedColors];
                updatedColors[index] = e.target.value;
                setSelectedColors(updatedColors);
              }}
            >
              <option value="">Select color</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="blue">Blue</option>
            </select>
          </div>
        ))}
        <button type="submit">Add Batch</button>
      </form>
    </div>
  );
};

export default TaskManager;