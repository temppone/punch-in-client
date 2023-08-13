/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from "react";

interface LoadingContextProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextProps>({
  loading: false,
  setLoading: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const LoadingContextProvider = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {props.children}
    </LoadingContext.Provider>
  );
};
