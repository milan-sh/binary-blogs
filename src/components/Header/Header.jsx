import React, { useRef } from "react";
import { Logo, LogoutBtn } from "../index";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Header() {
  //storing the status of user in a variable
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  // It is one the finest way to show the navItems according to user's status
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Create Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  const container = useRef();

  const {contextSafe} = useGSAP({scope: container});

  const openNav = contextSafe(()=>{
    gsap.to(container.current, {
      x:"100%",
      duration: 0.5,
      ease: 'power2.out'
    })
  })

  const closeNav = contextSafe(()=>{
    gsap.to(container.current, {
      x:"-100%",
      duration: 0.5,
      ease: "power2.in"
    })
  })




  return (
    <>
      <nav className="flex items-center justify-between p-4 w-full bg-[#D9D9D9]  md:sticky top-0 md:h-[10vh] h-[8vh] z-10">
        <Link to="/">
          <Logo />
        </Link>
        <ul className="hidden md:flex justify-center items-center gap-5 list-none text-black  font-semibold">
          {navItems.map((item) =>
            //if item is active then only show the item
            item.active ? (
              <li
                key={item.name}
              >
                {/* onclicking the button programmatically navigating to that page */}
                <button className="bg-gray-800 text-white py-1 px-6 rounded-full hover:bg-inherit hover:text-black hover:border hover:border-[#383838]" onClick={() => navigate(item.slug)}>{item.name}</button>
              </li>
            ) : null
          )}

          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </ul>
        <button onClick={openNav} className="md:hidden">
          <FontAwesomeIcon size="xl" icon={faBars} style={{ color: "black" }} />
        </button>
      </nav>

      <nav ref={container} className="hamNav absolute top-0 -ml-[200%] md:hidden min-h-screen min-w-full bg-[#C9C9C9] p-5 flex flex-col items-center justify-start gap-y-10 z-20">
        <div className="flex justify-end w-full">
          <button onClick={closeNav}><FontAwesomeIcon size="2xl" icon={faXmark} /></button>
        </div>
        <div>
          <ul className=" w-full gap-5">
            {navItems.map((item)=> (
              item.active? (
                <li key={item.name} className="m-5 text-2xl">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-full min-w-full" onClick={()=> (navigate(item.slug), closeNav())} >{item.name}</button>
                </li>
              ) : null
            ))}
            {authStatus && <li className="list-none text-center"><LogoutBtn className="bg-gray-600 px-10 rounded-full text-2xl py-2"/></li>}
          </ul>

          
        </div>
      </nav>
    </>
  );
}

export default Header;
