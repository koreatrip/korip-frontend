import React, { createContext, useState, useContext, ReactNode } from 'react';

interface InterestContextType {
  selectedInterests: string[];
  setSelectedInterests: React.Dispatch<React.SetStateAction<string[]>>;
}

const InterestContext = createContext<InterestContextType | undefined>(
  undefined
);

export const InterestProvider = ({ children }: { children: ReactNode }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  return (
    <InterestContext.Provider
      value={{ selectedInterests, setSelectedInterests }}
    >
      {children}
    </InterestContext.Provider>
  );
};

export const useInterestContext = () => {
  const context = useContext(InterestContext);
  if (context === undefined) {
    throw new Error(
      'useInterestContext must be used within an InterestProvider'
    );
  }
  return context;
};
