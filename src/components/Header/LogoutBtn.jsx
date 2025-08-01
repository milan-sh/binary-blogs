
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
      <button className={`bg-red-500 text-white py-1 px-6 rounded-full hover:bg-inherit hover:text-red-600 hover:border-2 hover:border-red-500 ${className}`} onClick={logoutHandler}>Logout</button>
    </div>
  )
}

export default LogoutBtn
