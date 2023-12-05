import { useEffect, useRef, useState } from "react";
import Container from "./UI/Container.tsx";
import { type Timer as TimerProps } from "./store/timer-context.tsx";
type TimerProps = {
  name: string;
  duration: number;
};
export default function Timer({ name, duration }: TimerProps) {
  const interval = useRef<number | null>(null);

  const [remainingTime, setRemainingTime] = useState(duration * 1000);
  if (remainingTime <= 0 && interval.current) {
    clearInterval(interval.current);
  }
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 50);
    }, 50);

    interval.current = timer;
    return () => {
      clearInterval(timer);
    };
  }, []);
  const fomattedRemainingTime = (remainingTime / 100).toFixed(2);
  return (
    <Container as="article">
      <h2>{name}</h2>
      <p>
        <progress max={duration * 1000} value={remainingTime} />
      </p>
      <p>{fomattedRemainingTime}</p>
    </Container>
  );
}
