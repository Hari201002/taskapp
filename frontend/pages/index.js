import { gql, useQuery, useMutation } from '@apollo/client';
import client from '../lib/apolloClient';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/TaskList.module.css';

// Explicitly name the query "GetTasks"
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      status
      dueDate
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_TASKS, { client });
  const [deleteTask] = useMutation(DELETE_TASK, {
    client,
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [filter, setFilter] = useState('All');

  if (loading) return <p className={styles.container}>Loading...</p>;
  if (error) return <p className={styles.container}>Error: {error.message}</p>;

  const filteredTasks =
    filter === 'All'
      ? data.tasks
      : data.tasks.filter((task) => task.status === filter);

  const statusOptions = ['All', 'Todo', 'In Progress', 'Done'];

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Task List</h1>

      <div className={styles.filterRow}>
        <label htmlFor="status">Filter by Status:</label>
        <select
          id="status"
          className={styles.select}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <Link href="/add" className={styles.addLink}>
        + Add Task
      </Link>

      <ul className={styles.taskList}>
        {filteredTasks.map((task) => (
          <li key={task.id} className={styles.taskCard}>
            <Link href={`/task/${task.id}`} className={styles.taskTitle}>
              {task.title}
            </Link>
            <p className={styles.taskMeta}>Status: {task.status}</p>
            <p className={styles.taskMeta}>
              Due:{' '}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : 'No due date'}
            </p>
            <button
              className={styles.deleteButton}
              onClick={() => {
                if (confirm('Are you sure you want to delete this task?')) {
                  deleteTask({ variables: { id: task.id } });
                }
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
