import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import UploadContent from "./pages/uploadContent";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Profile from "./pages/user/Profile";
import MyContent from "./pages/MyContent";
import Search from "./pages/Search";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAF9FF]">
        <Header />

        <div className="flex">
          <Sidebar />

          <main className="min-w-0 flex-1 px-2 pb-24 pt-5 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<UploadContent />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/my-content" element={<MyContent />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
