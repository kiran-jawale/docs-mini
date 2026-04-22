import { useState, useEffect } from "react";

export const useNotifier = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (permission === "default") {
      Notification.requestPermission().then(setPermission);
    }
  }, [permission]);

  const sendNotification = (title, body) => {
    if (permission === "granted") {
      new Notification(title, { body });
    } else {
      console.log(`Notification: ${title} - ${body}`);
    }
  };

  return { sendNotification };
};