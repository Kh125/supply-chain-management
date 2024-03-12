import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import authService from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/common/sclogo.png";
import defaultProfile from "../assets/images/common/defaultProfile.jpg";

const navigation = [
  { name: "Create", href: "/create-token", current: true },
  { name: "Sell", href: "/sell-to-wholesaler", current: false },
  { name: "My Tokens", href: "/my-tokens", current: false },
];

const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Sign out", href: "/logout" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [navbarDropdown, setNavbarDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-950">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <Link to={"/"}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10"
                            src={logo}
                            alt="Your Company"
                          />
                        </div>
                        <div className="text-white ml-5 font-semibold text-lg">
                          Supply Chain Management
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6 gap-3">
                      {!authService.getCurrentUser() ? (
                        <>
                          <Link
                            to="/login"
                            className="bg-gray-900 text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-semibold border border-gray-600 transition duration-300"
                          >
                            Login
                          </Link>
                          <Link
                            to="/register"
                            className="bg-gray-900 text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-semibold border border-gray-600"
                          >
                            Register
                          </Link>
                          {/* <a
                            className="transition duration-300 cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                            onClick={() => navigate("/login")}
                          >
                            Login
                          </a>
                          <a
                            className="transition duration-300 cursor-pointer rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                            onClick={() => navigate("/register")}
                          >
                            Register
                          </a> */}
                        </>
                      ) : (
                        <>
                          <Link
                            to="/dashboard"
                            className="bg-gray-900 text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-semibold border border-gray-600"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            className="bg-gray-900 text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-semibold border border-gray-600"
                          >
                            Profile
                          </Link>
                          <Link
                            to="/logout"
                            className="bg-gray-900 text-gray-100 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-semibold border border-gray-600"
                          >
                            Logout
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {navbarDropdown && (
                <div className="md:hidden">
                  <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setNavbarDropdown(!navbarDropdown)}
                        className={classNames(
                          "/" + window.location.pathname.split("/")[1] ===
                            item.href
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  {authService.getCurrentUser() ? (
                    <></>
                  ) : (
                    <>
                      <div className="border-t border-gray-700 pt-4 pb-3">
                        <div className="mt-3 space-y-1 px-2">
                          <Disclosure.Button
                            key={"login"}
                            as="a"
                            onClick={() => {
                              navigate("/login");
                              setNavbarDropdown(false);
                            }}
                            className="block rounded-md px-3 py-2 text-base font-medium text-white bg-gray-800 hover:bg-gray-700 hover:text-white cursor-pointer"
                          >
                            Login
                          </Disclosure.Button>
                          <Disclosure.Button
                            key={"register"}
                            as="a"
                            onClick={() => {
                              navigate("/register");
                              setNavbarDropdown(false);
                            }}
                            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white cursor-pointer"
                          >
                            Register
                          </Disclosure.Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
