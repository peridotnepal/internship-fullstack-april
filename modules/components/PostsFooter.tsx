import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const PostsFooter = () => {
  return (
    <div>
      <footer className="w-full absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur   border-t shadow-sm px-2">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <img
              className="h-10 w-10 rounded-full object-cover shadow"
              src="https://static.vecteezy.com/system/resources/thumbnails/019/166/318/small/lion-head-lion-logo-symbol-gaming-logo-elegant-element-for-brand-abstract-symbols-vector.jpg"
              alt="Peridot Logo"
            />
            <h1 className="mt-2 font-bold text-lg text-slate-800">Peridot</h1>
            <p className="text-xs text-slate-500">Your trusted news source</p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-1 text-sm text-slate-600">
            <div className="flex items-center gap-2 hover:text-slate-900 transition">
              <Mail size={16} />
              <span>info@news.com</span>
            </div>

            <div className="flex items-center gap-2 hover:text-slate-900 transition">
              <Phone size={16} />
              <span>+977-9800000000</span>
            </div>

            <div className="flex items-center gap-2 hover:text-slate-900 transition">
              <MapPin size={16} />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>

          {/* Right Section (optional future links/socials) */}
          <div className="text-xs text-slate-400 text-center md:text-right">
            <div className="flex justify-center space-x-1">
              <FaFacebook size={16} />
              <FaInstagram size={16} />
              <FaTwitter size={16} />
            </div>
            <p>
              {" "}
              © {new Date().getFullYear()} Peridot News <br />
              All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PostsFooter;
