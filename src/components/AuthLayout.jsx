import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

function AuthLayout({children, authentication = true}) {
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    const navigate = useNavigate();

    useEffect(()=>{
        // If the page needs the user to be logged in but they are not logged in, send them to the login page.
        if(authentication && authStatus !== authentication){
            navigate("/login")

            // If the page doesn’t need login (like the login or signup page), but the user is already logged in, send them to the home page.
        }else if(!authentication && authStatus !== authentication){
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, authentication, navigate])
  return loader ? <h1>Loading...</h1> : <>{children}</>
}

export default AuthLayout
