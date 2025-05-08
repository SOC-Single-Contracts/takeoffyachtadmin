import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';

import { switchReducer } from './switchReducer.jsx';

// Create a context
export const GlobalStateContext = createContext();

const initialState = {
  number: 3
}
const persistState = () => {
  try {
    if (typeof window !== "undefined") {
      const storedState = localStorage.getItem('globalStateYachtAdminProject');
      return storedState ? JSON.parse(storedState) : initialState; // Default state if nothing is stored
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return initialState; // Fallback state
  }
};

// Create a provider component
export const GlobalStateProvider = ({ children }) => {

  const [globalState, dispatch] = useReducer(switchReducer, persistState())

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('globalStateYachtAdminProject', JSON.stringify(globalState));
    }
  }, [globalState]);

  return (
    <GlobalStateContext.Provider value={{ globalState, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};


