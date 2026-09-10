import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const getProfile = async () => {
    try {
      const res = await axios.get("https://hipnovivev2.onrender.com/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Profile Info */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Profile Picture */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-3xl font-bold text-violet-700 sm:h-28 sm:w-28 sm:text-4xl">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              user.name?.charAt(0).toUpperCase()
            )}
          </div>

          {/* User Details */}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-zinc-900">{user.name}</h1>

            <p className="mt-1 text-sm text-zinc-500">{user.email}</p>

            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600">
              {user.bio}
            </p>

            {/* Followers / Following */}
            <div className="mt-5 flex justify-center gap-8 sm:justify-start">
              <div>
                <p className="text-lg font-bold text-zinc-900">120</p>
                <p className="text-sm text-zinc-500">Followers</p>
              </div>

              <div>
                <p className="text-lg font-bold text-zinc-900">80</p>
                <p className="text-sm text-zinc-500">Following</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleLogout}
                className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
