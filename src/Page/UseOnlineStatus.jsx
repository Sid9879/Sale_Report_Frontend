// src/Page/UseOnlineStatus.js
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const UseOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back Online ✅");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are Offline ❌");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

export default UseOnlineStatus;
