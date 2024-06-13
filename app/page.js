'use client';
import Link from "next/link";
import { useSession } from "next-auth/react";
import Head from "next/head";
export default function Home() {
  const { data: session, status } = useSession(); // This will now only execute on the client side
  const loading = status === "loading";

  if (loading) {
    // Render a loading indicator while session data is being fetched
    return (<>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="-mt-[64px] relative text-white flex justify-center items-center z-[1111] bg-[#161a24]" style={{ height: "calc(100vh - 64px)" }}>
        <img src="/output-onlinegiftools.gif" alt="" />
      </div></>
    );
  }

  if (session) {
    var username = session.user.username;
  }
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-white flex flex-col gap-2 sm:gap-4 items-center justify-center  border-b-2 border-gray-300 border-opacity-30">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold flex justify-center items-center sm:gap-4">
          <span className="pt-2 sm:pt-4 md:pt-8">Buy Me A Chai</span>
          <span>
            <img src="/output-onlinegiftools.gif" alt="Tea" className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32" />
          </span>
        </div>
        <p className="text-sm sm:text-base md:text-lg text-center px-4 sm:px-6 md:px-0 max-w-3xl mb-2">
          Empower your creative journey with a platform dedicated to helping developers secure funding for their projects. Launch your idea and watch it grow!
        </p>
        <div className="flex justify-center items-center my-2 sm:my-3 md:my-4">
          <Link href="/about">
            <button
              type="button"
              className="text-white bg-[#3b4f63] hover:bg-slate-700 focus:bg-[#2f3e50] focus:outline-none font-medium rounded-lg text-xs sm:text-sm md:text-sm px-4 py-2 sm:px-5 sm:py-2.5 text-center inline-flex items-center me-1 sm:me-2 md:me-4 dark:bg-[rgb(41,53,72)] dark:hover:bg-slate-700"
            >
              <svg className="size-4 mr-1 mb-[2px]" fill="#ffffff" viewBox="-9.6 -9.6 115.20 115.20" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" transform="rotate(0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g> <path d="M66,84H54V42a5.9966,5.9966,0,0,0-6-6H36a6,6,0,0,0,0,12h6V84H30a6,6,0,0,0,0,12H66a6,6,0,0,0,0-12Z"></path> <path d="M48,24A12,12,0,1,0,36,12,12.0119,12.0119,0,0,0,48,24Z"></path> </g> </g></svg>
              Read more
            </button>
          </Link>

          {session ? (
            <Link href={"/" + username}> {/* If user is logged in, link to their page */}
              <button
                type="button"
                className="text-white bg-[#3b4f63] hover:bg-slate-700 focus:bg-gray-800 focus:outline-none font-medium rounded-lg text-xs sm:text-sm md:text-sm px-4 py-2 sm:px-5 sm:py-2.5 text-center inline-flex items-center me-1 sm:me-2 md:me-4 dark:bg-[rgb(41,53,72)] dark:hover:bg-slate-700"
              >
                Your Profile
                <svg className="rtl:rotate-180 w-3 h-3 sm:w-3.5 sm:h-3.5 ms-1 sm:ms-2 md:ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </button>
            </Link>
          ) : (
            <Link href="/login"> {/* If user is not logged in, link to the login page */}
              <button
                type="button"
                className="text-white bg-[#3b4f63] hover:bg-[#4a657d] focus:bg-[#2f3e50] focus:outline-none font-medium rounded-lg text-xs sm:text-sm md:text-sm px-4 py-2 sm:px-5 sm:py-2.5 text-center inline-flex items-center me-1 sm:me-2 md:me-4 dark:bg-[#2f3e50] dark:hover:bg-[#4a657d]"
              >
                Log in
                <svg className="rtl:rotate-180 w-3 h-3 sm:w-3.5 sm:h-3.5 ms-1 sm:ms-2 md:ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="text-white mx-auto lg:py-32 md:py-20 sm:py-12 py-8 container">
        <div className="text-3xl md:text-5xl font-bold text-center lg:mb-16 md:mb-12 sm:mb-8 mb-4">How It Works</div>
        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-12 xl:gap-[5vw] justify-center items-center">
          <div className="flex flex-col items-center bg-[#1e2536] p-8 rounded-lg shadow-lg max-sm:w-[80vw] lg:w-[27vw] md:w-[35vw] transform transition duration-300 hover:scale-105">
            <img src="/blueprint.gif" alt="" className="h-14 w-14 lg:h-20 lg:w-20 rounded-full mb-4" />
            <div className="text-2xl md:text-3xl font-semibold text-center my-2">Create Your Project</div>
            <div className="text-base md:text-lg text-center mt-5">
              Kickstart your journey by setting up a project page. Describe your idea, set your funding goals, and let the community know why your project matters.
            </div>
          </div>
          <div className="flex flex-col items-center bg-[#1e2536] p-8 rounded-lg shadow-lg max-sm:w-[80vw] lg:w-[27vw] md:w-[35vw] transform transition duration-300 hover:scale-105">
            <img src="/share.gif" alt="" className="h-14 w-14 lg:h-20 lg:w-20 rounded-full mb-4" />
            <div className="text-2xl md:text-3xl font-semibold text-center my-2">Share with the Community</div>
            <div className="text-base md:text-lg text-center mt-5">
              Spread the word! Share your project across social media and within the community to gather support. The more you share, the more likely you are to get funded.
            </div>
          </div>
          <div className="flex flex-col items-center bg-[#1e2536] p-8 rounded-lg shadow-lg sm max-sm:w-[80vw] lg:w-[27vw] md:w-[35vw] transform transition duration-300 hover:scale-105">
            <img src="/money.gif" alt="" className="h-14 w-14 lg:h-20 lg:w-20 rounded-full mb-4" />
            <div className="text-2xl md:text-3xl font-semibold text-center my-2">Get Funded Quickly</div>
            <div className="text-base md:text-lg text-center mt-5">
              Watch the support roll in! Our platform ensures you receive funding quickly and securely. Focus on your project while we handle the rest.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

