export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

export const sendNotification = (title, options) => {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
};

export const checkAndNotify = () => {
  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  if (isWeekend) {
    sendNotification("Revision Day!", {
      body: "Time to revise your core DSA concepts. Check your dashboard.",
      icon: "/flame.png"
    });
  } else {
    sendNotification("Daily Goal", {
      body: "Solve at least 1 DSA problem today to keep the streak alive!",
      icon: "/flame.png"
    });
  }
};
