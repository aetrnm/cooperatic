import { ChangeEvent, FormEvent, useState } from "react";
import Modal from "react-modal";
import { ScaleLoader } from "react-spinners";

function RegisterForm(props: {
  onFormSubmit: () => void;
  email: string;
  setEmail(value: React.SetStateAction<string>): void;
  password: string;
  setPassword(value: React.SetStateAction<string>): void;
  confirmedPassword: string;
  setConfirmedPassword(value: React.SetStateAction<string>): void;
  onToggleLoginForm(): void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.setPassword(e.target.value);
  };

  const handleConfirmedPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.setConfirmedPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.password !== props.confirmedPassword) {
      setShowPasswordError(true);
      return;
    }
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    props.onFormSubmit();
  };

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="bg-white rounded-md shadow-md p-8 h-screen w-full">
          <h2 className="text-2xl font-semibold mb-6">Register</h2>
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
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-lg font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500"
                value={props.confirmedPassword}
                onChange={handleConfirmedPasswordChange}
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
                  "Register"
                )}
              </div>
            </button>
            <p className="mt-4 text-gray-800">
              Already have an account?{" "}
              <a
                href="#"
                onClick={props.onToggleLoginForm}
                className="text-purple-500 hover:text-purple-600"
              >
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showPasswordError}
        onRequestClose={() => setShowPasswordError(false)}
        contentLabel="Password Mismatch Error"
        className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black"
        overlayClassName="fixed inset-0"
      >
        <div className="bg-white p-8 rounded-md max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">
            Passwords Don't Match
          </h2>
          <p className="mb-4 text-center text-gray-600">
            Password and confirmed password do not match. Please try again.
          </p>
          <button
            onClick={() => setShowPasswordError(false)}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

export default RegisterForm;
