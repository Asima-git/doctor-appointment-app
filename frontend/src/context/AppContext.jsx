import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Initialize userData properly
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    address: { lin1: "", lin2: "" },
    gender: "",
    dob: "",
    email: "",
    image: "",
  });

  const getDoctorsData = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/doctor/list`);
      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/get-profile`, {
        headers: { token: token },
      });

      if (data.success) {
        setUserData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      setUserData({
        name: "",
        phone: "",
        address: { lin1: "", lin2: "" },
        gender: "",
        dob: "",
        email: "",
        image: "",
      });
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        doctors,
        currencySymbol,
        getDoctorsData,
        token,
        setToken,
        backendURL,
        userData,
        setUserData,
        loadUserProfile,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;



