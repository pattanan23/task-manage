<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <h1 class="text-3xl font-bold text-blue-700 mb-4">Task Management</h1>
  </div>
    <!-- 🔍 ค้นหา Task ตาม ID -->
    <div class="flex space-x-2 mb-6">
      <input v-model="searchId" class="border p-2 rounded w-48" placeholder="Enter Task ID..." />
      <button @click="searchTaskById" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Search</button>
    </div>

    <div v-if="searchResult" class="bg-white p-4 shadow rounded mb-4">
      <h3 class="text-lg font-semibold">Task Found:</h3>
      <p><strong>ID:</strong> {{ searchResult.id }}</p>
      <p><strong>Title:</strong> {{ searchResult.title }}</p>
    </div>
    <div v-else-if="searchError" class="text-red-500">{{ searchError }}</div>
   
 
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
      newTask: '',
      searchId: '',
      searchResult: null,
      searchError: null
    };
  },
  methods: {
    async fetchTasks() {
      try {
        const res = await axios.get('http://localhost:5000/tasks');
        this.tasks = res.data;
      } catch (error) {
        console.error('❌ Error fetching tasks:', error);
      }
    },
    async addTask() {
      if (!this.newTask) return;
      try {
        const res = await axios.post('http://localhost:5000/tasks', { title: this.newTask });
        this.tasks.push(res.data);
        this.newTask = '';
      } catch (error) {
        console.error('❌ Error adding task:', error);
      }
    },
    async deleteTask(id) {
      try {
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        this.tasks = this.tasks.filter(task => task.id !== id);
      } catch (error) {
        console.error('❌ Error deleting task:', error);
      }
    },
    async searchTaskById() {
      if (!this.searchId) return;
      try {
        const res = await axios.get(`http://localhost:5000/tasks/${this.searchId}`);
        this.searchResult = res.data;
        this.searchError = null;
      } catch (error) {
        this.searchResult = null;
        this.searchError = '❌ Task not found';
      }
    }
  },
  mounted() {
    this.fetchTasks();
  }
};
</script>

<style>
/* ✅ ใช้ CSS ปกติแทน Tailwind */
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 600px;
  margin: 20px auto;
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #333;
}

.search-box,
.task-input {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

input {
  width: 75%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}

.task-item {
  background: #fff;
  padding: 10px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.task-card {
  background: #e0ffe0;
  padding: 10px;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  margin-bottom: 10px;
}

.error-text {
  color: red;
  text-align: center;
}
</style>