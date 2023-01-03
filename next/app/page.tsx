async function getSmth() {
  const res = await fetch("http://127.0.0.1:5000/api/notices");
  console.log("тута", res);
  const data = await res.json();
  return data;
}

export default async function HomePage() {
  const data = await getSmth();
  return (
    <div>
      <h1>Home page</h1>
      <p>some content sdfdf</p>
      <p>{JSON.stringify(data, null, 2)}</p>
    </div>
  );
}
