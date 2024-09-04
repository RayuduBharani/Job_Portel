import JobCard from "@/components/JobCard";
import LoadingComponent from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Jobs() {

  const [RecriterJobs, setRecruiterJobs] = useState<IrecruiterJobData[]>()
  const [Loading, setLoading] = useState(false)

  const cookie = Cookies.get("bharani") || null;
  let CookieData: IcookieData | null = null;

  if (cookie) {
    CookieData = JSON.parse(cookie);
  }

  useEffect(() => {
    async function FetchRecruiterJobs() {
      if (!CookieData) return;
      setLoading(true)
      try {
        const response = await fetch(
          CookieData.role === "recruiter" ? "http://localhost:8000/getjob" : "http://localhost:8000/getAllJobs",
          {
            headers: {
              "Authorization": `Bearer ${CookieData.token}`,
            },
          }
        );
        const data = await response.json();
        setRecruiterJobs(data.data || []);
      }
      catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
      finally {
        setLoading(false)
      }
    }

    FetchRecruiterJobs();
  }, []);


  return (
    <>
      {
        CookieData?.role == "recruiter" ? (
          <div className="w-full h-screen pt-[75px] flex justify-center items-center">
            <div className="w-[91%] h-[90%] hide-scrollbar">
              <div className="w-full h-fit flex justify-between items-center">
                <p className="font-bold text-xl">Job DashBoard</p>
                <Button><Link to='post-job'>Post Jobs</Link></Button>
              </div>
              <Separator className="mt-2 bg-primary" />
              {
                Loading ?
                  <div className="w-full h-[90%] flex justify-center items-center">
                    <LoadingComponent />
                  </div>
                  : RecriterJobs?.length ?
                    <div className="hide-scrollbar py-10 w-full h-[90%] grid gap-5 grid-cols-3 overflow-y-scroll max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3">
                      <JobCard RecriterJobs={RecriterJobs} />
                    </div>
                    :
                    <div className="hide-scrollbar w-full h-[90%] flex justify-center items-center">
                      <p className="">Your are not post any jobs</p>
                    </div>
              }
            </div>
          </div>
        ) : (
          <div className="w-full h-screen pt-[75px] flex justify-center items-center">
            <div className="w-[91%] h-[90%] hide-scrollbar">
              <div className="w-full h-fit flex justify-between items-center">
                <p className="font-bold text-xl">Job DashBoard</p>
                <Button>Filter</Button>
              </div>
              <Separator className="mt-2 bg-primary" />

              {
                Loading ?
                  <p className="">Loading . . .</p>
                  : RecriterJobs?.length ?
                    <div className="hide-scrollbar py-10 w-full h-[90%] grid gap-5 grid-cols-3 overflow-y-scroll max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3">
                      <JobCard RecriterJobs={RecriterJobs} />
                    </div>
                    :
                    <div className="hide-scrollbar w-full h-[90%] flex justify-center items-center">
                      <p className="">No Jobs Availble</p>
                    </div>
              }
            </div>
          </div>
        )
      }
    </>
  )
}
