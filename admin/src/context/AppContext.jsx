import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props)=>{
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currency = '$'
  const calculateAge = (dob)=>{
    const today = new Date();
    const birthDay = new Date(dob)
    let age = today.getFullYear() - birthDay.getFullYear()
   return age
  }
  const slotDateFormate = (slotDate) => {
    const dateArr = slotDate.split('_')
    return dateArr[0] + " " + months[Number(dateArr[1])] + ", " + dateArr[2]
  }
  const value = {
    calculateAge,
    slotDateFormate,
    currency
  }
  return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider