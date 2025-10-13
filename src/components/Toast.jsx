import React, { useEffect, useState } from "react";

export default function Toast({ message = "Welcome!", duration = 3000, onClose }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 50;
    const increment = (interval / duration) * 100;

    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
        // ✅ Call onClose AFTER state updates (async)
        setTimeout(() => {
          if (onClose) onClose();
        }, 0);
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-5 right-5 w-64 bg-gray-800 text-white rounded shadow-lg overflow-hidden">
      <div className="p-3 text-sm">{message}</div>
      <div
        className="h-1 bg-green-500"
        style={{
          width: `${progress}%`,
          transition: "width 0.05s linear",
        }}
      ></div>
    </div>
  );
}
