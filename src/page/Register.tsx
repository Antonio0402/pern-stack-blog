import { atom, useAtom } from "jotai";
import { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { inputAtom, registerAtom } from "../store";
import { queryClientAtom } from "jotai-tanstack-query";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../components/ErrorCallback";
import { AxiosError } from "axios";

const errorAtom = atom(false);

const Register = () => {
  const [input, setInput] = useAtom(inputAtom);
  const [queryClient] = useAtom(queryClientAtom);
  const [error, setError] = useAtom(errorAtom);
  const [, register] = useAtom(registerAtom);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newInput = { ...input, [name]: value };
    setInput(newInput);
  };

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      register([
        {
          username: input.username,
          password: input.password,
        },
        {
          onSuccess: (data) => {
            if (data) {
              return queryClient.setQueryData(["user"], input.username);
            }
          },
        },
      ]);
      navigate("/login");
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data);
        setError(true);
      }
    }
  };
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setError(false)}
      resetKeys={[error]}
    >
      <div className="auth">
        <h1 className="auth__title">Register</h1>
        <form className="auth__form">
          <input
            required
            type="text"
            placeholder="username"
            name="username"
            onChange={handleChange}
          />
          <input
            required
            type="password"
            placeholder="password"
            name="password"
            onChange={handleChange}
          />
          <button className="btn" data-style="auth" onClick={handleSubmit}>
            Regiser
          </button>
          <span>
            Do you have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default Register;
