<template>
  <div class="container">
    <!-- Title -->
    <h1 class="title">Task Manager</h1>

    <!-- Search Form -->
    <div class="search-form">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search tasks..."
        class="search-input"
      />
    </div>

    <!-- Form to create task -->
    <div class="task-form">
      <input
        v-model="newTask.title"
        type="text"
        placeholder="Enter new task..."
        class="task-input"
      />
      <textarea
        v-model="newTask.description"
        placeholder="Enter task description..."
        class="task-textarea"
      ></textarea>
      <input
        v-model="newTask.due_date"
        type="date"
        class="task-input"
      />
      <button @click="createTask" class="add-task-button">Add Task</button>
    </div>

    <!-- Task List -->
    <div v-if="tasks.length === 0" class="no-tasks">
      No tasks available. Add a new task!
    </div>

    <ul class="task-list">
      <li v-for="task in filteredTasks" :key="task.id" class="task-item">
        <div class="task-info">
          <input v-if="isEditing[task.id]" 
                 v-model="editingTitle[task.id]" 
                 class="edit-input" 
                 @blur="updateTaskTitle(task.id)" />
          <span v-else class="task-title">{{ task.title }}</span>
          <span v-if="task.status === 'Pending'" class="status pending">Pending</span>
          <span v-if="task.status === 'In Progress'" class="status in-progress">In Progress</span>
          <span v-if="task.status === 'Completed'" class="status completed">Completed</span>
          
          <!-- Due Date -->
          <div class="due-date">
            <strong>Due Date:</strong> {{ formatDueDate(task.due_date) }}
          </div>

          <!-- Description -->
          <div class="task-description">
            <strong>Description:</strong> {{ task.description }}
          </div>
        </div>
        <div class="task-actions">
          <!-- Start button only available if the task is not completed -->
          <button @click="updateTaskStatus(task, 'In Progress')" 
                  class="action-button in-progress-btn" 
                  :disabled="task.status === 'Completed'">
            Start
          </button>
          <button @click="updateTaskStatus(task, 'Completed')" 
                  class="action-button complete-btn">
            Complete
          </button>
          <button @click="deleteTask(task.id)" class="action-button delete-btn">Delete</button>
          <button @click="toggleEditTitle(task.id)" class="action-button edit-btn">Edit Title</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newTask: { title: '', description: '', status: 'Pending', due_date: '' },
      tasks: [],
      searchQuery: '',
      isEditing: {},
      editingTitle: {}
    };
  },
  created() {
    this.fetchTasks();  // Fetch tasks when component is created
  },
  computed: {
    // Filter tasks based on search query
    filteredTasks() {
      return this.tasks.filter(task => {
        const query = this.searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
        );
      });
    }
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get('http://localhost:4000/tasks');
        this.tasks = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    async createTask() {
      if (this.newTask.title.trim() === '' || !this.newTask.due_date || this.newTask.description.trim() === '') return;

      const task = { ...this.newTask };
      try {
        const response = await axios.post('http://localhost:4000/tasks', task);
        this.tasks.push(response.data);  // Add the new task to the list
      } catch (error) {
        console.error('Error creating task:', error);
      }

      this.newTask.title = '';  // Reset input field
      this.newTask.due_date = '';  // Reset date field
      this.newTask.description = '';  // Reset description field
    },
    async updateTaskStatus(task, status) {
      try {
        const response = await axios.put(`http://localhost:4000/tasks/${task.id}`, { status });
        task.status = response.data.status;
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    },
    async deleteTask(taskId) {
      try {
        await axios.delete(`http://localhost:4000/tasks/${taskId}`);
        this.tasks = this.tasks.filter(task => task.id !== taskId);  // Remove task from the list
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    toggleEditTitle(taskId) {
      this.isEditing[taskId] = !this.isEditing[taskId];
      this.editingTitle[taskId] = this.tasks.find(task => task.id === taskId).title;
    },
    async updateTaskTitle(taskId) {
      const newTitle = this.editingTitle[taskId];
      try {
        const response = await axios.put(`http://localhost:4000/tasks/title/${taskId}`, { title: newTitle });
        const updatedTask = this.tasks.find(task => task.id === taskId);
        updatedTask.title = response.data.title;
        this.isEditing[taskId] = false;
      } catch (error) {
        console.error('Error updating task title:', error);
      }
    },
    formatDueDate(dueDate) {
      // Format the due date to a more readable format
      const date = new Date(dueDate);
      return date.toLocaleDateString();  // Formats the date as "MM/DD/YYYY"
    }
  }
};
</script>

<style scoped>
/* Global Styles */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f7fa;
  margin: 0;
  padding: 0;
}

.container {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 36px;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  width: 50%;
  max-width: 500px;
  border: 2px solid #ccc;
  border-radius: 5px;
}

/* Form Styles */
.task-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.task-input,
.task-textarea {
  width: 100%;
  max-width: 500px;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
}

.task-textarea {
  min-height: 100px;
}

.add-task-button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-task-button:hover {
  background-color: #2980b9;
}

/* Task List Styles */
.no-tasks {
  text-align: center;
  color: #7f8c8d;
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.task-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.task-info {
  display: flex;
  flex-direction: column;
}

.task-title {
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
}

.due-date {
  font-size: 14px;
  margin-top: 5px;
  color: #7f8c8d;
}

.status {
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;
}

.pending {
  color: #f39c12;
}

.in-progress {
  color: #2980b9;
}

.completed {
  color: #27ae60;
}

.task-description {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.in-progress-btn {
  background-color: #f39c12;
}

.complete-btn {
  background-color: #27ae60;
}

.delete-btn {
  background-color: #e74c3c;
}

.in-progress-btn:hover {
  background-color: #e67e22;
}

.complete-btn:hover {
  background-color: #2ecc71;
}

.delete-btn:hover {
  background-color: #c0392b;
}

/* Edit Task Title Styles */
.edit-input {
  padding: 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}
</style>
