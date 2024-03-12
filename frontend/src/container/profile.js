const Profile = () => {
  let name = localStorage.getItem("username");
  let orgname = localStorage.getItem("orgName");

  return (
    <div className="container my-12 px-6 mx-auto">
      <div className="border-b-2 block md:flex">
        <div className="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
          <div className="flex justify-between">
            <span className="text-xl font-semibold block">User Profile</span>
            {/* <a
              href="#"
              className="-mt-2 text-md font-bold text-white bg-gray-700 rounded-full px-5 py-2 hover:bg-gray-800"
            >
              Edit
            </a> */}
          </div>

          <span className="text-gray-600">
            This information is secret so be careful
          </span>
          <div className="w-full p-8 mx-2 flex justify-center">
            <img
              id="showImage"
              className="max-w-xs w-32 items-center border"
              src={`https://ui-avatars.com/api/?name=${name}`}
              alt=""
            />
          </div>
        </div>

        <div className="w-full md:w-3/5 p-8 bg-white lg:ml-4 shadow-md">
          <div className="rounded  shadow p-6">
            <div className="pb-6">
              <label
                for="name"
                className="font-semibold text-gray-700 block pb-1"
              >
                Name
              </label>
              <div className="flex">
                <input
                  disabled
                  id="username"
                  className="border-1  rounded-r px-4 py-2 w-full"
                  type="text"
                  value={name}
                />
              </div>
            </div>
            <div className="pb-4">
              <label
                for="about"
                className="font-semibold text-gray-700 block pb-1"
              >
                Organization
              </label>
              <input
                disabled
                id="organization"
                className="border-1  rounded-r px-4 py-2 w-full uppercase"
                type="text"
                value={orgname}
              />
              <span className="text-gray-600 pt-4 block opacity-70">
                Personal login information of your account
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
