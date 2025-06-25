import React, { useEffect, useState } from "react";

interface TimerProps {
  initialTime: number;         // Time in seconds
  onTimerEnd?: () => void;      // Optional callback when timer ends
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimerEnd }) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimerEnd) onTimerEnd();
      return;
    }

    const timer: NodeJS.Timeout = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimerEnd]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <>
      {formatTime(timeLeft)}
      </>
  );
};

export default Timer;