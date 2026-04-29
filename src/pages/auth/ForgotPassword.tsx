import BG from "/assets/img/reset-1.jpg";
// import BG2 from "../../assets/img/forgot-password-office-dark.jpeg";

function ForgotPassword() {
  return (
    <div className="flex items-center min-h-screen p-6 bg-[#ebf9ff]">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:block"
              src={BG}
              alt="Office"
            />
            {/* <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={BG2}
              alt="Office"
            /> */}
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-primaryColor">
                Forgot password
              </h1>
              <label className="block text-sm">
                <span className="text-gray-700 dark:text-gray-400">Email</span>
                <input
                  className="block w-full p-2 mt-1 text-sm bg-[#ebf9ff] rounded-sm focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                  placeholder="okonmuhammad@gmail.com"
                />
              </label>

              {/* <!-- You should use a button here, as the anchor is only used for the example  --> */}
              <a
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-[#33468a] border border-transparent rounded-sm focus:outline-none focus:shadow-outline-purple"
                href="/login"
              >
                Recover password
              </a>

              <hr className="my-8" />

              <p className="mt-4 text-sm font-medium text-primaryColor">
                {/* <a
                  className="text-sm font-medium text-primaryColor cursor-none"
                    href=""
                >
                </a> */}
                  Use a strong password to remember!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
