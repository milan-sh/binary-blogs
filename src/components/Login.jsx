import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button } from "./index";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import authService from "../appwrite/auth";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData));
        navigate("/");
      }
    } catch (error) {
      // console.log("error message", error)
      setError(error.message);
    }
  };

  return (
    <div className="w-full md:p-8 py-6 flex justify-center box-border">
      <div className="text-black  h-full md:w-1/3 bg-[#E3E3E3] rounded-lg p-6 ">
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Log in</h2>
          
        </div>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-600">email is required</span>
          )}

          <Input
            label="Password"
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span className="text-red-600">password is required</span>
          )}

          <Button type="submit" textColor="black" bgColor="bg-[#9DA1F1] " className="font-bold px-6 py-3 mt-5 hover:bg-inherit hover:border-2 hover:border-[#9DA1F1] rounded-full">
            Login
          </Button>

          <p className="text-center font-bold mt-5">
            Don&#8217;t have a acconunt ? <Link to="/signup"><span className="text-[#0029FF]">Sign up</span></Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
