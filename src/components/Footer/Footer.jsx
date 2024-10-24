import React from "react";
import { Logo } from "../index";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";

function Footer() {
  return (
    <div className="w-full bg-[#D9D9D9] min-h-[30vh] text-black py-16">
      <div className="grid md:grid-cols-4 grid-cols-2 gap-8 md:w-3/4 w-[90%] m-auto">
        <div className="col-span-2 md:col-span-1 justify-items-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div>
          <h2 className="font-bold text-lg pb-4">Trending Posts</h2>
          <div className="text-base font-semibold flex flex-col gap-y-2">
            <p>JavaScript</p>
            <p>Java</p>
            <p>SQL</p>
            <p>Python</p>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-lg pb-4">Community</h2>
          <div className="text-base font-semibold flex flex-col gap-y-2">
            <p>Code of Contduct</p>
            <p>Acknowledgements</p>
            <p>Meet the Top Writers</p>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-lg pb-4">More</h2>
          <div className="text-base font-semibold flex flex-col gap-y-2">
            <p>Privacy</p>
            <p>Terms</p>
          </div>
          <div className="mt-4 flex justify-start gap-2">
            <div>
              <Link to="https://github.com/milan-sh" target="_blank">
                <FontAwesomeIcon size="xl" icon={faGithub} />
              </Link>
            </div>
            <div>
              <Link to="https://www.linkedin.com/in/milan-singh-81ms33/" target="_blank">
                <FontAwesomeIcon icon={faLinkedin} size="xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
