import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, getProfileData, profileData, setProfileData, backendURL } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  // ✅ Updated Profile Update Function
  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      console.log("Updating Profile with:", updateData); // Debugging

      const { data } = await axios.post(
        `${backendURL}/api/doctor/update-profile`,
        updateData,  // ✅ Fixed payload
        {
          headers: {
            dtoken: dToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", data); // Debugging

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData(); // Refresh profile data after update
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      toast.error("Failed to update profile");
    }
  };

  // ✅ Fetch Profile Data on Token Change
  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return profileData && (
    <div>
      <div className='flex flex-col gap-4 m-5'>
        <div>
          <img className='bg-primary/80 rounded-xl' src={profileData.image} alt="Doctor Profile" />
        </div>
        <div className='flex-1 border border-stone-100 bg-white rounded-lg px-8 py-7'>

          {/* Doctor Info */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
            {profileData.name}
          </p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{profileData.degree} - {profileData.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {profileData.experience} years
            </button>
          </div>

          {/* About Section */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
              {profileData.about}
            </p>
          </div>

          {/* Fees */}
          <p className='text-gray-600 font-medium mt-4'>
            Appointment Fee: <span className='text-gray-800'>
              {currency} 
              {isEdit ? (
                <input
                  type='number'
                  onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                  value={profileData.fees}
                />
              ) : profileData.fees}
            </span>
          </p>

          {/* Address */}
          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {isEdit ? (
                <>
                  <input
                    type='text'
                    onChange={(e) => setProfileData(prev => ({
                      ...prev, 
                      address: { ...prev.address, line1: e.target.value }
                    }))}
                    value={profileData.address?.line1 || ''}
                  />
                  <br />
                  <input
                    type='text'
                    onChange={(e) => setProfileData(prev => ({
                      ...prev, 
                      address: { ...prev.address, line2: e.target.value }
                    }))}
                    value={profileData.address?.line2 || ''}
                  />
                </>
              ) : (
                <>
                  {profileData?.address?.line1} <br />
                  {profileData?.address?.line2}
                </>
              )}
            </p>
          </div>

          {/* Availability Checkbox */}
          <div className='flex gap-1 pt-2'>
            <input
              onChange={() => isEdit && setProfileData(prev => ({
                ...prev,
                available: !prev.available
              }))}
              checked={profileData.available || false}
              type='checkbox'
            />
            <label htmlFor=''>Available</label>
          </div>

          {/* Buttons */}
          {isEdit ? (
            <button
              onClick={updateProfile}
              className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
