import {useState} from 'react'
import { useForm } from 'react-hook-form'
import authService from '../appwrite/auth'
import { useDispatch } from 'react-redux'
import {  useNavigate, Link } from 'react-router-dom'
import { login } from '../store/authSlice'
import {Input, Button} from "./index"

function Signup() {

    const [error, setError] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {handleSubmit, register, formState:{errors}} = useForm()


    const onsubmit = async(data)=>{
        setError("")
        try {
            const session = await authService.createAccount(data)
            if(session){
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(login(userData))
                    navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className='text-black m-auto  md:w-1/3 bg-[#E3E3E3] rounded-lg p-6 '>
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Sign Up</h2>
        
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
      </div>
      <div>
        <form onSubmit={handleSubmit(onsubmit)} >
            <Input
            label="Name"
            type="text"
            placeholder="Name"
            {...register("name", {required: true})}
            />
            {errors.name && <span className="text-red-600">name is required</span>}

            <Input
            label="Email"
            type="email"
            placeholder="Email"
            {...register("email", {required: true, pattern: /^\S+@\S+$/i})}
            />
            {errors.email && <span className="text-red-600">email is required</span>}

            <Input
            label="Password"
            type="password"
            placeholder="Password"
            {...register("password", {required:true})}
            />
            {errors.password && <span className="text-red-600">password is required</span>}

            <Button type='submit'  textColor="black" bgColor="bg-[#9DA1F1] " className="rounded-full font-bold px-6 py-3 mt-5 mb-5 hover:bg-inherit hover:border-2 hover:border-[#9DA1F1]">Signup</Button>

            <p className='text-center font-bold'>Already have an account ? 
            <Link to="/login"><span className="text-[#0029FF]"> Log in</span></Link>
        </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
