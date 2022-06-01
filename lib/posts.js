// build時にサーバーサイドからapiにアクセスする処理

export async function getAllPostData() {
  const res = await fetch(
    new URL(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-post/`)
  );
  const posts = await res.json();
  // 新しい順にソート
  const filteredPosts = posts.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  return filteredPosts;
}
