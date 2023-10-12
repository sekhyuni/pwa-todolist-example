'use client';

import { FormEvent, useEffect, useState } from 'react';
import styles from './page.module.css';
import { Todo } from '@/entities/api/todo';

const baseURL = 'http://localhost:8081';

export default function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [title, setTitle] = useState<Todo['title']>('');
  const [description, setDescription] = useState<Todo['description']>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/todos`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const { todos } = await response.json();

        setTodoList(todos);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmitCreateTodo = async (e: FormEvent) => {
    e.preventDefault();

    const bodyObj: Omit<Todo, 'id'> = {
      title,
      description,
      completed: false,
    };

    try {
      const response = await fetch(`${baseURL}/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyObj),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className={styles.main}>
      <h1>TODO LIST</h1>
      <form className={styles.form} onSubmit={handleSubmitCreateTodo}>
        <div className={styles['container-input']}>
          <label htmlFor='title'>title: </label>
          <input
            id='title'
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className={styles['container-input']}>
          <label htmlFor='description'>description: </label>
          <input
            id='description'
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <button className={styles.submit} type='submit'>
          추가
        </button>
      </form>
      <div className={styles['container-contents']}>
        <div className={styles.contents}>
          <p className={styles.todo}>
            <strong>Todo</strong>
          </p>
          <ol>
            {todoList
              .filter((todo) => !todo.completed)
              .map((todo) => {
                return (
                  <li key={todo.id}>
                    <h3 className={styles.title}>{todo.title}</h3>
                    <p className={styles.description}>{todo.description}</p>
                  </li>
                );
              })}
          </ol>
        </div>
        <div className={styles.contents}>
          <p className={styles.completed}>
            <strong>Completed</strong>
          </p>
          <ol>
            {todoList
              .filter((todo) => todo.completed)
              .map((todo) => {
                return (
                  <li key={todo.id}>
                    <h4 className={styles.title}>{todo.title}</h4>
                    <p className={styles.description}>{todo.description}</p>
                  </li>
                );
              })}
          </ol>
        </div>
      </div>
    </main>
  );
}
