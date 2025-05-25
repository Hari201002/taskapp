import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import client from '../../lib/apolloClient';
import styles from '../../styles/TaskDetail.module.css';

const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      dueDate
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error, refetch } = useQuery(GET_TASK, {
    variables: { id },
    client,
    skip: !id,
  });

  const [updateStatus, { loading: updating }] = useMutation(UPDATE_STATUS, {
    client,
    onCompleted: () => {
      refetch(); // refetch task after update
    },
    onError: (err) => {
      alert(`Error updating status: ${err.message}`);
    },
  });

  const handleChange = async (e) => {
    await updateStatus({ variables: { id, status: e.target.value } });
  };

  if (loading) return <p className={styles.container}>Loading...</p>;
  if (error) return <p className={styles.container}>Error: {error.message}</p>;

  const task = data.task;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Task Details</h2>
      {/* Back Button */}
      <button
        className={styles.backButton}
        onClick={() => router.push('/')}
      >
        &larr; Back to Task List
      </button>

      <h1 className={styles.title}>{task.title}</h1>

      <div>
        <label className={styles.label}>Description:</label>
        <p className={styles.text}>{task.description || 'No description'}</p>
      </div>

      <div>
        <label className={styles.label}>Due Date:</label>
        <p className={styles.text}>
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
        </p>
      </div>

      <div>
        <label className={styles.label}>Status:</label>
        <select
          className={styles.select}
          value={task.status}
          onChange={handleChange}
          disabled={updating}
        >
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </div>
    </div>
  );
}
