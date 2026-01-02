import React, { createContext } from "react";

export const UserDataContext = createContext(null);

const [user, setUser] = React.useState({
  email: "",
  fullName: {
    firstName: "",
    lastName: "",
  },
});

const UserContext = ({ children }) => {
  return (
    <div>
      <UserDataContext.Provider value={user}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
};

export default UserContext;
