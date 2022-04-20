import React, { useCallback, useState } from "react"
import { useMagicalNumberContext } from "../hooks/useMagicalNumber";

export interface CounterProps {
  incrementBy?: number
}

// default `incrementBy = 1`
export const Counter: React.FC<CounterProps> = ({ incrementBy = 1 }) => {
  const magicalNumber = useMagicalNumberContext();
  const [count, setCount] = useState<number>(0); 

  const handleIncrementClick = useCallback(() => {
    setCount(count => count + incrementBy + magicalNumber);
  }, [setCount, magicalNumber, incrementBy]);

  return <>
    <p>{count}</p>
    <button onClick={handleIncrementClick}>Increment</button>
  </>
}