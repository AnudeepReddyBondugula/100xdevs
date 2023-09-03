/* eslint-disable react/prop-types */

import { useEffect } from 'react'
import './App.css'
import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  useEffect(()=>{
    const intervalId = setInterval(() => {
      fetch("http://127.0.0.1:3000/todos")
      .then((data) => data.json())
      .then(data => setTodos(data))
      .catch(() => console.log("Failed to fetch"))
    }, 1000)

    return ()=> clearInterval(intervalId);
  }, []);
  return (
    <>
      <center><h1>TODO LIST</h1></center>
      <div className='main-div'>
        <RenderTodos todos={todos}></RenderTodos>
        <AddTodo></AddTodo>
      </div>
      <DeleteTodo></DeleteTodo>
      
    </>
  )
}

const RenderTodos = function(props){
  return (
    <div className='todos'>
      {props.todos.map(todo => {
        return (
          <div key={todo.ID} className='todo'>
            ID : {todo.ID}
            <br></br>
            TITLE: {todo.title}
            <br></br>
            DESC: {todo.description}
          </div>
        )
      })}
    </div>
  )
}

const AddTodo = function(){
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("");
  const [completed, setCompleted] = useState(0);
  

  function addTodo(){
    fetch('http://localhost:3000/todos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        'title': title,
        'description': desc,
        'completed': completed == 1 ? true : false
    })
});

  }

  return (
    <div>
      <label>TITLE: </label>
      <input type='text' onChange={(e)=>setTitle(e.target.value)}></input>
      <br></br>
      <label>DESCRIPTION: </label>
      <input type='text' onChange={(e) => setDesc(e.target.value)}></input>
      <br></br>
      <label>COMPLETED?: </label>
      <input type='checkbox' onChange={()=>setCompleted(completed^true)}></input>
      <br></br>
      <button onClick={addTodo}>ADD</button>

    </div>
  )
}

const DeleteTodo = function(){
  const [id, setId] = useState(undefined);
  function deleteTodo(){
    if (id){
      fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE'
      });
    }
    else alert("Provide ID")
  }
  return (
    <div>
      <button onClick={deleteTodo}>DELETE</button>
      <input type="text"  onChange={e=> setId(e.target.value)}></input>
    </div>
  )
}

export default App
