import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const [count, setCount] = useState(5);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (count === 0) {
      setRedirect(true);
      return;
    }

    const int = setInterval(() => {
      setCount((cnt) => cnt - 1);
    }, 1000);

    return () => clearInterval(int);
  }, [count]);

  if (redirect) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <h1>404 Not Found — Please check the path</h1>
      <p>
        Automatically redirecting to Home Page in {count} second
        {count !== 1 ? "s" : ""}...
      </p>
    </>
  );
};

export default NotFound;
