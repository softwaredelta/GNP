// (c) Delta Software 2023, rights reserved.

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => {
          fetch(apiUrl)
            .then((res) => res.text())
            .then((text) => alert(`Api says ${text}`));
        }}
      >
        click me!
      </button>
      <button
        onClick={() => {
          fetch(`${apiUrl}/time`)
            .then((res) => res.json())
            .then(({ now }) => alert(now));
        }}
      >
        get the time!
      </button>
      <button
        onClick={() => {
          fetch(`${apiUrl}/objects`)
            .then((res) => res.json())
            .then((json) => alert(JSON.stringify(json)));
        }}
      >
        get bucket object list!
      </button>
    </div>
  );
}

export default App;
