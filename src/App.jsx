import {useEffect, useState} from 'react'
import authService from './appwrite/auth'
import {login, logout} from "./store/authSlice"
import { useDispatch } from 'react-redux'
import {Header, Footer} from "./components/index"
import { Outlet } from 'react-router-dom'


function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch();

  //on page loading checking user logged in or not
  useEffect(()=>{
    //using authservice finding user loggedin or not 
    authService.getCurrentUser()
    .then((userData) => {
      if(userData){
        //if logged in update the store
        dispatch(login({userData}))
      }else{
        //not logged in still update the store
        dispatch(logout())
      }
    })
    //finally set loading false
    .finally(()=> setLoading(false))
  }, [])

  //conditional rendering
  return loading ? null : (<div className='min-h-screen flex flex-col content-center box-border items-center justify-between'>
    <Header/>
    <main className='w-full min-h-[50vh] '>
      <Outlet/>
    </main>
    <Footer/>
  </div>)
}

export default App
