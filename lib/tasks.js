// build時に呼び出され、サーバーサイドからapiにアクセスする処理
export async function getAllTasksData() {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`)
  );
  const tasks = await res.json();
  // 新しい順にソート
  const filteredTasks = tasks.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  return filteredTasks;
}

// 記事のIDを取得する
export async function getAllTasksIds() {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`)
  );
  const tasks = await res.json();
  // idの一覧を作成してreturnする
  return tasks.map((task) => {
    return {
      params: {
        id: String(task.id),
      },
    };
  });
}

// 単一の記事を取得する
export async function getTaskData(id) {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}/`)
  );
  const task = await res.json();
  return {
    task,
  };
}
