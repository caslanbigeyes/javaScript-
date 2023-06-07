<script setup>
// #1: 引入ref和computed
import { ref, computed } from "vue";

// #2: 定义props
defineProps({
  name: String,
});

// #3: 声明响应式变量
const todo = ref("");
const todoList = ref([]);

// #4: 实现函数 (相当于Vue2里methods里的函数)
function addTodo() {
  todoList.value.unshift({
    title: todo.value,
    complete: false,
  });
  todo.value = "";
}

// #5 也可以使用箭头函数
const completeTodo = (index) => {
  todoList.value[index].complete = true;
};

// #6: 实现清空函数
function restart() {
  todo.value = "";
  todoList.value = [];
}

// #7: 定义一个computed函数（相当于Vue2里computed里的函数）
const completeTotal = computed(() => {
  return todoList.value.filter((todo) => todo.complete).length;
});
</script>

<template>
  <h1>{{ name }}的TODO-LIST</h1>
  <input type="text" v-model="todo" />
  <button @click="addTodo()">提交</button>
  <div>任务总数: {{ todoList.length }}</div>
  <div>完成数量: {{ completeTotal }}</div>
  <button @click="restart()">清空</button>
  <ul>
    <li v-for="(todo, index) in todoList" :key="index">
      ({{ todo.complete ? "已完成" : "待完成" }})
      {{ todo.title }}
      <button @click="completeTodo(index)">完成</button>
    </li>
  </ul>
</template>
