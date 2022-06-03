import Layout from '../components/Layout';
import Link from 'next/link';
import { getAllTasksData } from '../lib/tasks';
import Task from '../components/Task';
import useSWR from 'swr';
import { useEffect } from 'react';
import StateContextProvider from '../context/StateContext';
import TaskForm from '../components/TaskForm';

const fetcher = (url) => fetch(url).then((res) => res.json());
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task`;

export default function TaskPage({ staticFilteredTasks }) {
  const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
    fallbackData: staticFilteredTasks,
  });

  const filteredTasks = tasks?.sort(
    (a, b) => new Date(b.create_at) - new Date(a.create_at)
  );

  useEffect(() => {
    mutate();
  }, []);

  return (
    <StateContextProvider>
      <Layout title='Task page'>
        <TaskForm taskCreated={mutate} />
        <ul>
          {filteredTasks &&
            filteredTasks.map((task) => (
              <Task key={task.id} task={task} taskDeleted={mutate} />
            ))}
        </ul>
        <Link href='/main-page'>
          <div className='flex cursor-pointer mt-12'>
            <svg
              className='w-6 h-6 mr-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
              ></path>
            </svg>
            <span>Back to main page</span>
          </div>
        </Link>
      </Layout>
    </StateContextProvider>
  );
}

// build時に呼び出される処理
export async function getStaticProps() {
  const staticFilteredTasks = await getAllTasksData();
  return {
    props: { staticFilteredTasks },
    revalidate: 3, // ISRの指定
  };
}
