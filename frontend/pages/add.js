import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import client from '../lib/apolloClient';
import { useRouter } from 'next/router';
import styles from '../styles/AddTask.module.css';

// Same ADD_TASK mutation
const ADD_TASK = gql`
  mutation AddTask($title: String!, $description: String, $status: String!, $dueDate: String) {
    addTask(title: $title, description: $description, status: $status, dueDate: $dueDate) {
      id
    }
  }
`;

// Import the GET_TASKS query from index.js for refetchQueries
import { GET_TASKS } from './index';

export default function AddTask() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Todo',
    dueDate: '',
  });
  const router = useRouter();

  const [addTask, { loading, error }] = useMutation(ADD_TASK, {
    client,
    refetchQueries: [{ query: GET_TASKS }],  // Refetch the task list query after mutation
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addTask({ variables: form });
      router.push('/'); // Redirect to the task list page after adding task
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Add New Task</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className={styles.textarea}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className={styles.input}
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <select
          className={styles.select}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
      {error && <p className={styles.error}>Error adding task: {error.message}</p>}
    </div>
  );
}

