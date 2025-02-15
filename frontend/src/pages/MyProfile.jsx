import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, token, backendURL, loadUserProfile } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("address", JSON.stringify(userData.address));
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendURL}/api/user/update-profile`,
        formData,
        { headers: { token: token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfile();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    userData && (
      <div>
        {/* Profile Image */}
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75"
                src={image ? URL.createObjectURL(image) : userData?.image || ""}
                alt="Profile"
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? "" : assets.upload_icon}
                alt="Upload Icon"
              />
            </div>
            <br />
            <input type="file" id="image" hidden onChange={handleImageChange} />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData?.image || ""} alt="Profile" />
        )}

        {/* Name */}
        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
            type="text"
            value={userData?.name || ""}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData?.name || "N/A"}
          </p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />

        {/* Contact & Personal Info */}
        <div>
          <p className="text-neutral-500 mt-3 underline">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email Id:</p>
            <p className="text-blue-500">{userData?.email || "N/A"}</p>

            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="text"
                value={userData?.phone || ""}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-400">{userData?.phone || "N/A"}</p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <>
                <input
                  className="bg-gray-100 max-w-52"
                  type="text"
                  value={userData?.address?.lin1 || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, lin1: e.target.value },
                    }))
                  }
                />
                <br />
                <input
                  className="bg-gray-100 max-w-52"
                  type="text"
                  value={userData?.address?.lin2 || ""}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, lin2: e.target.value },
                    }))
                  }
                />
              </>
            ) : (
              <p className="text-gray-500">
                {userData?.address?.lin1 || "N/A"}
                <br />
                {userData?.address?.lin2 || "N/A"}
              </p>
            )}

            {/* ✅ Gender Field */}
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="bg-gray-100 max-w-52"
                value={userData?.gender || ""}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-gray-500">{userData?.gender || "N/A"}</p>
            )}

            {/* ✅ Date of Birth (DOB) Field */}
            <p className="font-medium">Date of Birth:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="date"
                value={userData?.dob || ""}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-500">{userData?.dob || "N/A"}</p>
            )}
          </div>
        </div>

        {/* Edit / Save Button */}
        <div>
          {isEdit ? (
            <button
              className="border border-primary px-8 py-2 rounded-full mt-4 hover:bg-primary hover:text-white transition-all"
              onClick={updateUserProfile}
            >
              Save information
            </button>
          ) : (
            <button
              className="border border-primary px-8 py-2 rounded-full mt-4 hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
