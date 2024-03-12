import { Link } from "react-router-dom";
import manufacturer from "../assets/images/home/manufacturer.png";
import wholesaler from "../assets/images/home/wholesaler.png";
import retailer from "../assets/images/home/consumer.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen scroll-smooth">
        <div class="relative isolate overflow-hidden bg-gray-900">
          <svg
            class="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <svg x="50%" y="-1" class="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                stroke-width="0"
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              stroke-width="0"
              fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
            />
          </svg>
          <div
            class="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
            aria-hidden="true"
          >
            <div class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"></div>
          </div>
          <div class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
            <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
              {/* <img
                class="h-11"
                src="https://isren.org/storage/isren-network.png"
                alt="Your Company"
              /> */}
              <div class="mt-24 sm:mt-32 lg:mt-16">
                <a href="#about" class="inline-flex space-x-6">
                  <span class="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-cyan-500 ring-1 ring-inset ring-indigo-500/20">
                    What's new
                  </span>
                  <span class="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
                    <span>About us</span>
                    <svg
                      class="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </a>
              </div>
              <h1 class="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Your Supply Chain Nexus
              </h1>
              <p class="mt-6 text-lg leading-8 text-gray-300">
                Dive into the intricacies of supply chain management and stay
                updated on the latest industry advancements and insights.
              </p>
              <div class="mt-10 flex items-center gap-x-6">
                <a
                  onClick={() => navigate("/register")}
                  class="rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 transition duration-300 cursor-pointer"
                >
                  Get started
                </a>
                {/* <a href="#" class="text-sm font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </a> */}
              </div>
            </div>
          </div>
        </div>
        <div class="relative isolate overflow-hidden bg-gray-900">
          <div
            aria-hidden="true"
            class="absolute w-full top-10 -z-10 transform-gpu blur-3xl lg:top-[calc(50%-30rem)] "
          >
            <div class="aspect-[1108/632] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"></div>
          </div>
          <div>
            <div id="title" class="text-center my-10">
              <h1 class="font-bold text-4xl text-white">Key Features</h1>
            </div>
            <p class="mt-6 text-center text-lg leading-8 text-gray-300">
              Track and Trace: Monitor every step of your supply chain journey
              with real-time visibility, ensuring seamless coordination and
              transparency across all stakeholders.
            </p>
          </div>

          <div class="mx-auto max-w-7xl px-6 pb-24 py-10 lg:flex">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-evenly gap-10 pt-10">
              <div
                id="plan"
                class="rounded-lg text-center overflow-hidden w-full transform shadow-2xl transition duration-200 ease-in"
              >
                <div id="title" class="w-full py-5 border-b border-white">
                  <h2 class="font-bold text-3xl text-white">
                    For Manufacturer
                  </h2>
                </div>
                <div id="content" class="">
                  <div
                    id="icon"
                    class="my-5 text-center mx-auto flex items-center justify-center"
                  >
                    <img
                      src={manufacturer}
                      alt="Medical Record"
                      className="h-12 w-12 mb-4 text-white"
                    />
                  </div>
                  <div id="contain" class="leading-8 mb-10 text-lg font-light">
                    <p className="text-base text-gray-200 text-center px-20">
                      Our platform empowers distributors to efficiently manage
                      and track product movement, ensuring seamless transactions
                      and supply chain visibility.
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="plan"
                class="rounded-lg text-center overflow-hidden w-full transform shadow-2xl transition duration-200 ease-in"
              >
                <div id="title" class="w-full py-5 border-b border-white">
                  <h2 class="font-bold text-3xl text-white">
                    For Distributors
                  </h2>
                </div>
                <div id="content" class="">
                  <div
                    id="icon"
                    class="my-5 text-center mx-auto flex items-center justify-center"
                  >
                    <img
                      src={wholesaler}
                      alt="Secure Data"
                      className="h-12 w-12 mb-4"
                    />
                  </div>
                  <div id="contain" class="leading-8 mb-10 text-lg font-light">
                    <p className="text-base text-gray-200 text-center px-20">
                      Our platform empowers distributors to efficiently manage
                      and track product movement, ensuring seamless transactions
                      and supply chain visibility.
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="plan"
                class="rounded-lg text-center overflow-hidden w-full transform shadow-2xl transition duration-200 ease-in"
              >
                <div id="title" class="w-full py-5 border-b border-white">
                  <h2 class="font-bold text-3xl text-white">For Consumer</h2>
                </div>
                <div id="content" class="">
                  <div
                    id="icon"
                    class="my-5 text-center mx-auto flex items-center justify-center"
                  >
                    <img
                      src={retailer}
                      alt="Medical Record"
                      className="h-12 w-12 mb-4"
                    />
                  </div>
                  <div id="contain" class="leading-8 mb-10 text-lg font-light">
                    <p className="text-base text-gray-200 text-center px-20">
                      Our platform offers consumers unparalleled transparency,
                      enabling them to trace product origins and make informed
                      choices with confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="relative isolate overflow-hidden bg-gray-900">
          <div className="px-10 py-20 flex flex-col items-center">
            <h1 className="mb-4 text-center text-4xl font-extrabold text-white leading-tight">
              Supply Chain Management
            </h1>
            <p className="mt-8 max-w-2xl text-center text-xl text-gray-300">
              Our platform built on Hyperledger Fabric provides a secure and
              transparent way for supply chain members to track and manage an
              item.
            </p>
            <div className="mt-12">
              <Link
                to="/consumer"
                className="inline-block px-4 py-3 text-lg font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
              >
                Track a Token
              </Link>
            </div>
          </div>
        </div>
        <div class="relative isolate overflow-hidden bg-gray-900" id="about">
          <div class="absolute w-full top-10 -z-10 transform-gpu blur-3xl lg:top-[calc(50%-30rem)] ">
            <div class="aspect-[1108/632] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"></div>
          </div>
          <div className="px-10 py-20 flex flex-col items-center">
            <h1 className="text-center text-4xl font-extrabold text-white leading-tight">
              About Us
            </h1>
            <div className="mt-4 text-center rounded-lg px-8 pt-2 pb-10 flex flex-col justify-center items-center">
              <p className="mt-4 max-w-2xl text-xl text-gray-300">
                Welcome to our platform, where we merge cutting-edge Hyperledger
                Fabric technology with the dynamic MERN stack for frontend
                development to revolutionize supply chain management. With our
                platform, manufacturers tokenize their products, ensuring
                transparency and traceability from creation to consumption.
                Distributors benefit from streamlined operations, while
                consumers enjoy unparalleled transparency, making informed
                decisions based on real-time data. Together, we're shaping a
                supply chain ecosystem that's transparent, efficient, and
                sustainable for all stakeholders. Join us as we redefine the
                future of supply chain management.
              </p>
            </div>
          </div>
        </div>
        <div class="relative isolate overflow-hidden bg-gray-900">
          <div className="px-10 py-20 flex flex-col items-center">
            <h1 className="text-center text-4xl font-extrabold text-white leading-tight">
              Get Started
            </h1>
            <div className="mt-4 text-center rounded-lg px-8 pt-4 pb-10 flex flex-col justify-center items-center">
              <p className="mt-4 max-w-2xl text-xl text-gray-300">
                "Register today on our platform and unlock the advantages of
                secure, decentralized supply chain management. Experience
                transparency and efficiency like never before."
              </p>
              <div className="mt-12">
                <a
                  onClick={() => navigate("/register")}
                  className="inline-block px-4 py-3 text-lg font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-300 cursor-pointer"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
        <footer className="mx-auto py-4 sm:px-6 lg:px-8 bg-gray-950">
          <div className="pt-4 flex flex-col justify-center items-center">
            <p className="text-base leading-6 text-gray-300">
              © 2024 Supply Chain Management Platform. All rights reserved.
              Experience the future of supply chain management today.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;
