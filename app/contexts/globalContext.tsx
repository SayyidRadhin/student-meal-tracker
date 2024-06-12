// GlobalContextProvider.tsx
"use client"
import React, { createContext, ReactNode, useContext, useState } from 'react';

type GlobalContextType = {
  showModal: boolean,
  setShowModal:React.Dispatch<React.SetStateAction<boolean>>,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  searchTerm: string,
};

type ChildrenProps = {
  children: ReactNode;
};

const GlobalContext = createContext({} as GlobalContextType);

export function useGlobalContext() {
  return useContext(GlobalContext);
}

function GlobalContextProvider({ children }: ChildrenProps) {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <GlobalContext.Provider value={{
      showModal,
      setShowModal,
      searchTerm,
      setSearchTerm,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContextProvider;
