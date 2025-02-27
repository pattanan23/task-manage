<template>
  <div>
    <h1>Task Management</h1>

    <input v-model="newTask" placeholder="Enter a task..." />
    <button @click="addTask">Add Task</button>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }}
        <button @click="deleteTask(task.id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],  // เก็บรายการ Task
      newTask: '' // เก็บข้อความจาก input
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
        this.tasks.push(res.data); // อัปเดต UI
        this.newTask = ''; // ล้างช่อง input
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
    }
  },
  mounted() {
    this.fetchTasks();
  }
};
</script>

<style>
h1 { color: #2c3e50; }
button { margin-left: 10px; cursor: pointer; }
</style>
