import constate from "constate";
import { PropsWithChildren, useCallback, useEffect, useState } from "react"

export const useMagicalNumber = () => {
  // generate a random number between 0-10
  const generateMagicalNumber = useCallback(() => {
    return Math.round(Math.random() * 10);
  }, []);

  // initialize the magicalNumber state
  const [magicalNumber, setMagicalNumber] = useState<number>(() => generateMagicalNumber());

  // run a side effect, but just once
  useEffect(() => {
    // run a function every 1 second
    setInterval(() => {
      // re-generate a new `magicalNumber`
      const magicalNumber = generateMagicalNumber();
      // update the state
      setMagicalNumber(magicalNumber);
    }, 1000);
  }, [setMagicalNumber, generateMagicalNumber]);

  return magicalNumber;
}

export const [MagicalNumberProvider, useMagicalNumberContext] = 
  constate<PropsWithChildren<any>, ReturnType<typeof useMagicalNumber>, never>(useMagicalNumber)