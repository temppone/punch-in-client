/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useEffect, useState } from "react";
import api from "../services/axios";

interface IUser {
  id: string;
  username: string;
}

interface UserContextProps {
  user: IUser | undefined | null;
  avatar: string;
  setAvatar: (avatar: string) => void;
  setUser: (user: IUser) => void;
}

export const UserContext = createContext<UserContextProps>({
  user: {
    id: "",
    username: "",
  },
  avatar: "",
  setAvatar: () => {},

  setUser: () => {},
});

interface Props {
  children: React.ReactNode;
}

const getInitialState = () => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }

  return null;
};

const getInitialAvatarState = () => {
  const avatar = localStorage.getItem("avatar");
  if (avatar) {
    avatar;
  }

  return "";
};

export const UserContextProvider = (props: Props) => {
  const [user, setUser] = useState<IUser>(getInitialState());
  const [avatar, setAvatar] = useState<string>(getInitialAvatarState());

  const getUserAvatar = async () => {
    const response = await api.get(`/users/${user.id}?populate=*`);

    localStorage.setItem(
      "avatar",
      `http://localhost:1337${response.data.avatar.formats.thumbnail.url}`
    );

    setAvatar(
      `http://localhost:1337${response.data.avatar.formats.thumbnail.url}`
    );
  };

  useEffect(() => {
    getUserAvatar();
  });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        avatar,
        setAvatar,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
