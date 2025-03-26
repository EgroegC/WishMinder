import useAxiosPrivate from "../hooks/useAxiosPrivate";

function HomePage() {
  const axiosPrivate = useAxiosPrivate();

  return (
    <>
      <div>
        <button
          onClick={() => {
            axiosPrivate.get("/api/users/me").then((res) => {
              console.log(res.data);
            });
          }}
        >
          Show Token
        </button>
      </div>
    </>
  );
}

export default HomePage;
