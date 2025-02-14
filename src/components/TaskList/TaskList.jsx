import styles from "./TaskList.module.css";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export default function TaskList({ sessionsCompleted }) {
  // State Management
  // tasks: Array to store all tasks with their properties
  const [tasks, setTasks] = useState([]);
  // isAddingTask: Boolean to control whether the task form is visible
  const [isAddingTask, setIsAddingTask] = useState(false);
  // editingTask: Integer to store the index of the task being edited
  const [editingTask, setEditingTask] = useState(null);
  // newTask: Object to store the current task being created
  const [newTask, setNewTask] = useState({
    title: "",
    estimatedPomodoros: 1
  });

  // Event Handlers
  
  // Shows the task form when "Add Task" is clicked
  const handleAddTask = () => {
    setIsAddingTask(true);
    setEditingTask(null);
  };

  // Handles saving a new task or updating an existing task
  const handleSave = () => {
    // Only save if the task has a title (not empty or just spaces)
    if (newTask.title.trim()) {
      if (editingTask) {
        // Update existing task
        setTasks(tasks.map((task) =>
          task.id === editingTask
            ? { ...task, title: newTask.title, estimatedPomodoros: newTask.estimatedPomodoros }
            : task
        ));
      } else {
        // Add new task
        const id = crypto.randomUUID();
        setTasks([...tasks, { ...newTask, completedPomodoros: 0, checked: false, id }]);
      }
      
      // Reset form state
      setIsAddingTask(false);
      setEditingTask(null);
      setNewTask({ title: "", estimatedPomodoros: 1 });
    }
  };

  // Handles canceling task creation
  const handleCancel = () => {
    // Hide the form and reset the newTask state
    setIsAddingTask(false);
    setEditingTask(null);
    setNewTask({ title: "", estimatedPomodoros: 1 });
  };

  const handleCheck = (id) => {
    setTasks(tasks.map((task) => 
      task.id === id ? { ...task, checked: !task.checked } : task
    ));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setEditingTask(null);
    setIsAddingTask(false);
    setNewTask({ title: "", estimatedPomodoros: 1 });
  };

  const handleEdit = (id) => {
    // If we're already editing this task, close the form
    if (editingTask === id) {
      setEditingTask(null);
      setIsAddingTask(false);
      setNewTask({ title: "", estimatedPomodoros: 1 });
    } else {
      // Otherwise, open the form with this task's data
      setEditingTask(id);
      setIsAddingTask(true);
      const taskToEdit = tasks.find((task) => task.id === id);
      setNewTask({
        title: taskToEdit.title,
        estimatedPomodoros: taskToEdit.estimatedPomodoros
      });
    }
  };

  return (
    <div>
      {/* Task Info Section: Shows current task or default message */}
      <div className={styles.taskInfoContainer}>
        <p className={styles.taskNumber}>#{sessionsCompleted + 1}</p>
        {/* If there are tasks, show first task's title, otherwise show default message */}
        <p>{tasks.length > 0 ? tasks[0].title : "Time to focus!"}</p>
      </div>

      {/* Header Section: Shows "Tasks" title and menu button */}
      <div className={styles.taskListHeader}>
        <h2>Tasks</h2>
        <button className={styles.button}>MENU</button>
      </div>

      {/* Main Task List Container */}
      <div className={styles.taskListContainer}>
        {/* Map through tasks array to render each task */}
        {tasks.map((task) => (
          <div key={task.id}>
            {editingTask === task.id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}>
                <div className={styles.taskForm}>
                  {/* Reuse the same form elements from the Add Task form */}
                  <input
                    type="text"
                    placeholder="What are you working on?"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className={styles.taskInput}
                  />
                  {/* Pomodoro Estimate Section */}
                  <div className={styles.pomodoroEstimate}>
                    <span>Est Pomodoros</span>
                    <div className={styles.pomodoroControls}>
                      {/* Number Input for Pomodoros */}
                      <input
                        type="number"
                        value={newTask.estimatedPomodoros}
                        // Parse the string value to integer and update state
                        onChange={(e) => setNewTask({ ...newTask, estimatedPomodoros: parseInt(e.target.value) })}
                        min="1"
                        className={styles.pomodoroInput}
                      />
                      {/* Up/Down Buttons for Pomodoros */}
                      <div className={styles.pomodoroButtons}>
                        {/* Increment button */}
                        <button type="button" onClick={() => setNewTask({ ...newTask, estimatedPomodoros: newTask.estimatedPomodoros + 1 })}>▲</button>
                        {/* Decrement button (won't go below 1) */}
                        <button type="button" onClick={() => setNewTask({ ...newTask, estimatedPomodoros: Math.max(1, newTask.estimatedPomodoros - 1) })}>▼</button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Actions */}
                  <div className={styles.additionalActions}>
                    <button type="button" className={styles.actionButton}>+ Add Note</button>
                    <button type="button" className={styles.actionButton}>+ Add Project</button>
                  </div>

                  {/* Form Buttons in a separate container */}
                  <div className={styles.formButtonsContainer}>
                    <div>
                      <button type="button" onClick={() => handleDelete(task.id)} className={styles.deleteButton}>Delete</button>
                    </div>
                    <div>
                      <button type="button" onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
                      <button type="submit" className={styles.saveButton}>Save</button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className={styles.taskItem}>
                <div 
                  className={`${styles.taskCheckbox} ${task.checked ? styles.checked : ''}`}
                  onClick={() => handleCheck(task.id)}
                />
                <span className={styles.taskTitle}>{task.title}</span>
                <span className={styles.taskCount}>{task.completedPomodoros}/{task.estimatedPomodoros}</span>
                <button 
                  className={styles.taskMenuButton}
                  onClick={() => handleEdit(task.id)}
                >
                  ⋮
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Show Add Task form or button */}
        {isAddingTask && !editingTask ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}>
            <div className={styles.taskForm}>
              {/* Task Title Input */}
              <input
                type="text"
                placeholder="What are you working on?"
                value={newTask.title}
                // Update only the title in the newTask state, keeping other properties unchanged
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className={styles.taskInput}
              />

              {/* Pomodoro Estimate Section */}
              <div className={styles.pomodoroEstimate}>
                <span>Est Pomodoros</span>
                <div className={styles.pomodoroControls}>
                  {/* Number Input for Pomodoros */}
                  <input
                    type="number"
                    value={newTask.estimatedPomodoros}
                    // Parse the string value to integer and update state
                    onChange={(e) => setNewTask({ ...newTask, estimatedPomodoros: parseInt(e.target.value) })}
                    min="1"
                    className={styles.pomodoroInput}
                  />
                  {/* Up/Down Buttons for Pomodoros */}
                  <div className={styles.pomodoroButtons}>
                    {/* Increment button */}
                    <button type="button" onClick={() => setNewTask({ ...newTask, estimatedPomodoros: newTask.estimatedPomodoros + 1 })}>▲</button>
                    {/* Decrement button (won't go below 1) */}
                    <button type="button" onClick={() => setNewTask({ ...newTask, estimatedPomodoros: Math.max(1, newTask.estimatedPomodoros - 1) })}>▼</button>
                  </div>
                </div>
              </div>

              {/* Additional Actions */}
              <div className={styles.additionalActions}>
                <button type="button" className={styles.actionButton}>+ Add Note</button>
                <button type="button" className={styles.actionButton}>+ Add Project</button>
              </div>

              {/* Form Buttons in a separate container */}
              <div className={`${styles.formButtonsContainer} ${styles.flexEnd}`}>
                <button type="button" onClick={handleCancel} className={styles.cancelButton}>Cancel</button>
                <button type="submit" className={styles.saveButton}>Save</button>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.addTaskButton} onClick={handleAddTask}>
            <p>Add Task</p>
          </div>
        )}
      </div>
    </div>
  );
}
