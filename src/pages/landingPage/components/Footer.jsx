import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import Logo from "../assets/wootlab-logo.png";
import { toast } from "react-toastify";

const SOCIAL_LINKS = [
  {
    icon: FaFacebook,
    href: "https://facebook.com/wootlab",
    label: "Facebook",
  },
  {
    icon: FaTwitter,
    href: "https://twitter.com/wootlab",
    label: "Twitter",
  },
  {
    icon: FaLinkedin,
    href: "https://linkedin.com/company/wootlab",
    label: "LinkedIn",
  },
  {
    icon: FaYoutube,
    href: "https://youtube.com/@wootlab",
    label: "YouTube",
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Save to localStorage
    const existing = JSON.parse(
      localStorage.getItem("wl_newsletter") || "[]"
    );
    if (!existing.includes(trimmed)) {
      localStorage.setItem(
        "wl_newsletter",
        JSON.stringify([...existing, trimmed])
      );
    }

    setSubscribed(true);
    setEmail("");
    toast.success("Thanks for subscribing! 🎉");
  };

  return (
    <section className="w-full bg-white py-0 md:py-14 p-4" id="about">
      <div className="md:max-w-[98%] m-auto grid md:grid-cols-5 gap-8 max-w-[98%] py-10 md:py-0 px-4">
        {/* Brand column */}
        <div className="col-span-3">
          <img
            src={Logo}
            alt="Wootlab Academy"
            className="h-[65px] cursor-pointer mb-2"
          />
          <h3 className="py-2 text-[#60737a] text-sm leading-relaxed">
            Wootlab Foundation is a non-profit organisation that leverages
            technology to promote inclusive and quality education for
            out-of-school children and youths in Africa.
          </h3>

          <h3 className="font-bold text-2xl mt-8 text-[#33468a]">
            Contact us
          </h3>
          {/* <h3 className="py-1 text-[#60737a] text-sm">
            Call: +234 034 5870 665
          </h3> */}
          <h3 className="py-1 text-[#60737a] text-sm">
            Email:{" "}
            <a
              href="mailto:foundation@wootlab.ng"
              className="hover:text-[#33468a] transition-colors"
            >
              foundation@wootlab.ng
            </a>
          </h3>

          {/* Social icons */}
          <div className="flex gap-3 py-4">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-3 rounded-xl bg-[#ebf9ff] cursor-pointer hover:bg-[#bae6fd] transition-colors duration-200"
              >
                <Icon size={22} className="text-[#33468a]" />
              </a>
            ))}
          </div>
        </div>

        {/* Subscribe column */}
        <div className="col-span-2">
          <h3 className="font-bold text-2xl mt-8 md:mt-0 text-[#33468a]">
            Subscribe
          </h3>
          <h3 className="py-2 text-[#60737a] text-sm">
            Get the latest news about courses and updates!
          </h3>

          {subscribed ? (
            <div className="flex items-center gap-2 py-4 text-green-600 font-medium text-sm">
              <span>✓</span> You're subscribed — thank you!
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col gap-2 mt-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 text-sm text-neutral-700 outline-none placeholder:text-neutral-500 rounded"
                placeholder="Enter your email address"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#33468a] text-white text-sm font-medium hover:bg-[#27366e] transition-colors duration-200 rounded"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="md:max-w-[1100px] m-auto border-t border-gray-100 pt-4 mt-4 max-w-[400px]">
        <p className="text-center text-xs text-[#94a3b8]">
          © {new Date().getFullYear()} Wootlab Foundation. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
