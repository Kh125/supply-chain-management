import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormButton from "../../common/formButton";
import Input from "../../common/input";
import Loader from "../../common/loader";
import Select from "../../common/select";
import authService from "../../services/authService";

function Login() {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [org, setOrg] = useState("manufacturer");
  const [privateKey, setPrivateKey] = useState(""); // New state for file content

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoader(true);
    setError("");

    try {
      const res = await authService.login({
        username,
        orgName: org,
        secret,
        privateKey,
      });
      setLoader(false);
      // console.log(res);
      if (res.data.success) {
        navigate("/dashboard");
      } else {
        setError(res.data.error.message);
      }
    } catch (error) {
      setLoader(false);
      setError("Something went wrong!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      console.log("text", text);
      setPrivateKey(text);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-[93vh]">
        <div className="flex flex-col items-center justify-center px-6 py-8 my-auto">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign In
            </h2>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={(e) => handleSubmit(e)}
            >
              <Input
                label="Username"
                type="text"
                id="username"
                required
                value={username}
                onChange={setUsername}
              />

              {/* <Input
                label="Secret"
                type="password"
                id="secret"
                required
                value={secret}
                onChange={setSecret}
              /> */}

              <input type="file" onChange={handleFileChange} />

              <Select
                label="Login As"
                value={org}
                onChange={setOrg}
                options={["manufacturer", "distributor", "consumer"]}
              />

              {error && (
                <>
                  <div className="text-center text-red-500">{error}</div>
                </>
              )}

              <FormButton name="Sign In" loader={loader} />

              <Link
                to="/register"
                className="flex bg-white flex-wrap mt-3 justify-center cursor-pointer text-gray-900 border border-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
              >
                <div>
                  <small>Create new account</small>
                </div>
              </Link>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
export default Login;
