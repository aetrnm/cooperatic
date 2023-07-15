import { ChangeEvent, FormEvent, useState } from "react";
import { ScaleLoader } from "react-spinners";

function Login(props: {
  onFormSubmit: () => void;
  email: string;
  setEmail(value: React.SetStateAction<string>): void;
  password: string;
  setPassword(value: React.SetStateAction<string>): void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    props.onFormSubmit();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-md shadow-md p-8 w-96">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-lg font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500"
              value={props.email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-lg font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500"
              value={props.password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center">
              {isLoading ? (
                <ScaleLoader
                  color="#FFFFFF"
                  height={20}
                  width={2}
                  speedMultiplier={3}
                />
              ) : (
                "Login"
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
