import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from 'react';

interface InterestContextType {
  selectedDetailInterests: string[];
  setSelectedDetailInterests: React.Dispatch<React.SetStateAction<string[]>>;
}

const InterestContext = createContext<InterestContextType | undefined>(
  undefined
);

export const InterestProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDetailInterests, setSelectedDetailInterests] = useState<
    string[]
  >([]);

  return (
    <InterestContext.Provider
      value={{ selectedDetailInterests, setSelectedDetailInterests }}
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
