import React from 'react'
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import Logo from '../assets/wootlab-logo.png'

const Footer = () => {
  return (
    <section className="w-full bg-white py:0 md:py-14 p-4">
      <div className="md:max-w-[1100px] m-auto grid md:grid-cols-5 max-[768px]:md:grid-cols-6 gap-8 max-w-[400px]">
        <div className="col-span-3 ">
          <img
            src={Logo}
            alt="logo-footer"
            className="h-[65px]  cursor-pointer mb-2"
          />
          <h3 className="py-2 text-[#60737a]">
            Wootlab Foundation is a non-profit organisation that leverages
            technology to promote inclusive and quality education for
            ​out-of-school children and youths in Africa.
          </h3>
          <h3 className="font-bold text-2xl mt-10 text-[#33468a]">
            Contact us
          </h3>
          <h3 className="py-2 text-[#60737a]">call: +234 034 5870 665</h3>
          <h3 className="py-2 text-[#60737a]">Email: hello@wootlab.ng</h3>

          <div className="flex gap-4 py-4">
            <div className="p-4 rounded-xl bg-[#ebf9ff] cursor-pointer">
              <FaFacebook size={25} className="text-[#33468a]" />
            </div>
            <div className="p-4 rounded-xl bg-[#ebf9ff] cursor-pointer">
              <FaTwitter size={25} className="text-[#33468a]" />
            </div>
            <div className="p-4 rounded-xl bg-[#ebf9ff] cursor-pointer">
              <FaLinkedin size={25} className="text-[#33468a]" />
            </div>
            <div className="p-4 rounded-xl bg-[#ebf9ff] cursor-pointer">
              <FaYoutube size={25} className="text-[#33468a]" />
            </div>
          </div>
        </div>

        {/* <div className="col-span-1">
          <h3 className="font-bold text-2xl mt-10">Explore</h3>
          <ul className="py-3 text-[#60737a]">
            <li className="py-2">Home</li>
            <li className="py-2">About us</li>
            <li className="py-2">Courses</li>
            <li className="py-2">Contact us</li>
          </ul>
        </div> */}

        {/* <div className="col-span-1">
          <h3 className="font-bold text-2xl mt-10">Categories</h3>
          <ul className="py-3 text-[#60737a]">
            <li className="py-2">Design</li>
            <li className="py-2">Development</li>
            <li className="py-2">Marketing</li>
            <li className="py-2">Finance</li>
            <li className="py-2">Music</li>
            <li className="py-2">Photography</li>
          </ul>
        </div> */}

        <div className="col-span-2">
          <h3 className="font-bold text-2xl mt-10 text-[#33468a]">Subscribe</h3>
          <h3 className="py-2 text-[#60737a]">
            Subscribe to get latest news about courses and updates!
          </h3>
          <form className="input-box-shadow flex justify-content-between items-center bg-transparent gap-2">
            <input
              type="text"
              className="my-2 w-full px-5 py-3 border border-solid border-neutral-300 bg-transparent bg-clip-padding text-base font-normal text-neutral-700 outline-none placeholder:text-neutral-500"
              placeholder="Enter your email address here"
            />
            <button className="my-2 px-5 py-3 bg-[#33468a] text-white">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Footer