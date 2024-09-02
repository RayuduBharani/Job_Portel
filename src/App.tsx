  import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
  import SignIn from "./Pages/SignIn";
  import SignUp from "./Pages/SignUp";
  import NavBar from "./components/NavBar";
  import Onboard from "./Pages/Onboard";
  import Jobs from "./Pages/Jobs";
  import Activity from "./Pages/Activity";
  import Feed from "./Pages/Feed";
  import Home from "./Pages/Home";
  import Account from "./Pages/Account";
  import Companies from "./Pages/Companies";
  import { useEffect } from "react";
  import Cookies from "js-cookie";
  import Postjob from "./components/PostJob/Postjob";
import PostInfo from "./components/PostInfo";

  export default function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const showNav = location.pathname === "/onboard";

    useEffect(() => {
      const cookie = Cookies.get('bharani');
      if (cookie) {
        const cookieData = JSON.parse(cookie);
        if (cookieData.role == null) {
          navigate('/onboard');
        } else if (cookieData.role != null) {
          if (location.pathname === "/sign-in") {
            navigate('/home');
          }
          if (location.pathname === "/sign-up") {
            navigate('/home');
          }
        }
      } else {
        navigate('/sign-in');
      }
    }, []);

    return (
      <div
        className="h-screen w-full relative bg-cover bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-background bg-opacity-50">
          {showNav ? null : <NavBar />}
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/onboard" element={<Onboard />} />

            <Route path="/jobs" element={<Jobs />} >
              
            </Route>

            <Route path="/jobs/:name" element = {<PostInfo />} />

            <Route path="/jobs/post-job" element={<Postjob />} />

            <Route path="/Activity" element={<Activity />} />
            <Route path="/Feed" element={<Feed />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="*" element={<SignIn />} />
          </Routes>
        </div>
      </div>
    );
  }
