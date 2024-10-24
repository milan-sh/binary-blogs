
import authService from '../../appwrite/auth'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'

function LogoutBtn({className=""}) {
    const dispatch = useDispatch()
    const logoutHandler = ()=>{
        //on clicking use logout service from logout
        authService.logout()
        //once logout update the store
        .then(dispatch(logout()))
    }
  return (
    <div>
      <button className={`bg-gray-800 text-white py-1 px-6 rounded-full hover:bg-inherit hover:text-black hover:border hover:border-[#383838] ${className}`} onClick={logoutHandler}>Logout</button>
    </div>
  )
}

export default LogoutBtn
