// タスク詳細ページ
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import { getAllTasksIds, getTaskData } from '../../lib/tasks';
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Task({ staticTask, id }) {
  const router = useRouter;
  const { data: task, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}/`,
    fetcher,
    { fallbackData: staticTask }
  );

  useEffect(() => {
    mutate();
  }, []);

  if (router.isFallback || !task) {
    return <div>Loading</div>;
  }
  return (
    <Layout title={task.title}>
      <p className='m-4'>
        {'ID: '}
        {task.id}
      </p>
      <p className='mb-4 text-xl font-bold'>{task.title}</p>
      <p className='mb-12'>{task.created_at}</p>
      <Link href='/blog-page'>
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
          <span>Back to task-page</span>
        </div>
      </Link>
    </Layout>
  );
}

// ビルド時に呼ばれる 1
export async function getStaticPaths() {
  const paths = await getAllTasksIds();

  return {
    paths, // {params: id}の配列
    fallback: true,
  };
}

// ビルド時に呼ばれる 2
export async function getStaticProps({ params }) {
  // 単一記事データ取得
  const { task: staticTask } = await getTaskData(params.id);
  // 上のPostコンポーネントに渡る
  return {
    props: {
      id: staticTask.id,
      staticTask,
    },
    revalidate: 3, // ISRの指定
  };
}
