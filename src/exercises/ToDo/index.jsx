import { useState } from 'react';
import './styles.css';

const ToDo = () => {
  const [itemToAdd, setItemToAdd] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [doneList, setDoneList] = useState([]);

  return (
    <>
      <div id="itemForm">
        <input
          id="itemInput"
          placeholder="Add your todo item here"
          value={itemToAdd}
          onChange={(e) => setItemToAdd(e.target.value)}
        />
        <button onClick={() => setTodoList([...todoList, { name: itemToAdd }])}>
          Add to Todo list
        </button>
      </div>

      <h5>Todo List</h5>
      {todoList.map((item, index) => {
        return (
          <div>
            {index + 1}.{' '}
            <input
              type="checkbox"
              checked={false}
              onChange={() => {
                setTodoList((todoList) =>
                  todoList.filter(
                    (currentItem) => currentItem.name !== item.name
                  )
                );
                setDoneList((doneList) => [...doneList, { name: item.name }]);
              }}
            />{' '}
            {item.name}
          </div>
        );
      })}

      <h5>Done List</h5>
      {doneList.map((item, index) => {
        return (
          <div>
            {index + 1}.{' '}
            <input
              type="checkbox"
              checked
              onChange={() => {
                setDoneList((doneList) =>
                  doneList.filter(
                    (currentItem) => currentItem.name !== item.name
                  )
                );
                setTodoList((todoList) => [...todoList, { name: item.name }]);
              }}
            />{' '}
            {item.name}
          </div>
        );
      })}
    </>
  );
};

export default ToDo;
