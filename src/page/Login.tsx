import { atom, useAtom } from "jotai";
import { ChangeEvent, FormEvent, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, loginAtom } from "../store";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components/ErrorCallback";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

const inputAtom = atom<{
  username: string;
  password: string;
}>({
  username: "",
  password: "",
});

const errorAtom = atom("");

const Login = ({
  error,
  setError,
}: {
  error: string;
  setError: (value: string) => void;
}) => {
  const [input, setInput] = useAtom(inputAtom);
  const queryClient = useQueryClient();

  const [, login] = useAtom(loginAtom);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newInput = { ...input, [name]: value };
    setInput(newInput);
  };

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await login([
        {
          username: input.username,
          password: input.password,
        },
        {
          onSuccess: (data: User | undefined) => {
            if (data) {
              return queryClient.invalidateQueries(["user"]);
            }
          },
        },
      ]);
      navigate("/");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        console.log(error?.message);
        setError(error?.response?.data);
        throw error;
      }
    }
  };

  return (
    <div className="auth">
      <h1 className="auth__title">Login</h1>
      <form className="auth__form">
        <input
          required
          type="text"
          placeholder="username"
          name="username"
          value={input.username}
          onChange={handleChange}
        />
        <input
          required
          type="password"
          placeholder="password"
          name="password"
          value={input.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="btn"
          data-style="auth"
          onClick={handleSubmit}
        >
          Login
        </button>
        <em color="red">{error}</em>
        <span>
          Don't you have an account? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
};

function LoginPage() {
  const [error, setError] = useAtom(errorAtom);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setError("")}
        resetKeys={[error]}
      >
        <Login setError={setError} error={error} />
      </ErrorBoundary>
    </Suspense>
  );
}

export default LoginPage;
