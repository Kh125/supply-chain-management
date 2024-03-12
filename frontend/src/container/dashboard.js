import Canteen from "../assets/images/dashboard/canteen.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "../services/authService";

function Dashboard() {
  const user = authService.getRole();
  const [apps, setApps] = useState([]);
  const [loader, setloader] = useState(false);

  const farmerDashboard = [
    {
      name: "Create Product",
      imgSrc: Canteen,
      link: "/create-product",
      description: "Create your product to deliver to the various users",
      button: "Create",
      blocked: false,
    },
    {
      name: "Orders",
      imgSrc: Canteen,
      link: "/requested-product-order-list",
      description: "Check all the order requests received from customers",
      button: "Deliver",
      blocked: false,
    },
    {
      name: "Products",
      imgSrc: Canteen,
      link: "/product-list",
      description:
        "Browse through our collection of products available for delivery to customers.",
      button: "Browse",
      blocked: false,
    },
  ];

  const wholesalerDashboard = [
    {
      name: "Create Tokens over Token",
      imgSrc: Canteen,
      link: "/create-tokens-over-token",
      blocked: false,
    },
    {
      name: "Sell to Consumer",
      imgSrc: Canteen,
      link: "/sell-to-retailer",
      blocked: false,
    },
    {
      name: "My Tokens",
      imgSrc: Canteen,
      link: "/my-tokens-wholesaler",
      blocked: false,
    },
  ];

  const retailerDashboard = [
    {
      name: "Sell to Consumer",
      imgSrc: Canteen,
      link: "/sell-to-consumer",
      blocked: false,
    },
    {
      name: "My Tokens",
      imgSrc: Canteen,
      link: "/my-tokens-retailer",
      blocked: false,
    },
  ];

  const consumerDashboard = [
    {
      name: "Product List",
      imgSrc: Canteen,
      link: "/product-list-consumer",
      description: "Browse products from manufacturers and order.",
      button: "Browse",
      blocked: false,
    },
    {
      name: "Orders",
      imgSrc: Canteen,
      link: "/consumer-product-order-list",
      description: "Check all the order requests created.",
      button: "View",
      blocked: false,
    },
  ];

  useEffect(() => {
    if (user === "farmer" || user === "manufacturer") {
      setApps(farmerDashboard);
    } else if (user === "wholesaler") {
      setApps(wholesalerDashboard);
    } else if (user === "retailer") {
      setApps(retailerDashboard);
    } else {
      setApps(consumerDashboard);
    }
    setloader(true);
  }, [user]);

  const navigate = useNavigate();

  return (
    <>
      <div className="h-4/5">
        <div className="text-left flex h-1/3 justify-around items-center">
          <div className="text-left mt-10 text-3xl font-bold">Services</div>
        </div>

        {!loader ? (
          <>Loading.......</>
        ) : (
          <>
            <div class="flex flex-col md:flex-row space-x-0 md:space-x-8 space-y-12  md:space-y-0 justify-center items-center mt-10">
              {/* <div className="text-center grid grid-cols-1 md:grid-cols-3 md:gap-5 justify-around mx-20 items-center mt-10 mb-10"> */}
              {apps?.map((app, index) => (
                // <div
                //   key={index}
                //   onClick={() => {
                //     app.blocked ? <></> : navigate(`${app.link}`);
                //   }}
                // >
                //   <div
                //     // to={`${app.link}`}
                //     className="scale-90 md:scale-100 border-2 rounded-3xl flex flex-col justify-center sm:mt-10 mx-5 md:mx-5 items-center border-blue-100  p-10 text-xl hover:border-blue-200 cursor-pointer hover:bg-blue-50 transition delay-100 hover:scale-90 md:hover:scale-110"
                //   >
                //     {app.name}
                //   </div>
                // </div>
                <div
                  key={index}
                  class="bg-[#FFFBEC] rounded-xl"
                  onClick={() => {
                    app.blocked ? <></> : navigate(`${app.link}`);
                  }}
                >
                  <div class="flex flex-col p-8 rounded-xl bg-white shadow-xl translate-x-4 translate-y-4 w-96 md:w-auto">
                    <img src={app.imgSrc} class="w-8" />
                    <div class="mt-3 font-semibold text-lg">{app.name}</div>
                    {/* <div class="text-sm font-light">Up to 100Mbit/s</div> */}
                    <div class="my-4 font-light text-sm">
                      {app.description}
                      {/* <span class="font-bold text-base">299,-</span>
                      <span class="font-light text-sm">/month</span> */}
                    </div>

                    <button class="bg-[#F4F5FA] px-4 py-3 rounded-full  border border-[#F0F0F6] shadow-xl mt-4">
                      {app.button}
                    </button>
                  </div>
                </div>
              ))}
              {/* </div> */}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
