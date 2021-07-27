import * as constants from "./constants";

export const addNotification = notification => {
  if (typeof notification === "string") {
    return {
      type: constants.ADD_NOTIFICATION,
      notification: {
        key: notification,
        message: notification,
        type: "error",
        toastId: new Date().getTime() + Math.random()
      }
    };
  } else {
    return {
      type: constants.ADD_NOTIFICATION,
      notification: {
        key: notification.key || notification.message,
        message:
          (notification.response &&
            notification.response.data &&
            notification.response.data.message) ||
          notification.message,
        type:
          notification.type ||
          (notification.response &&
            notification.response.data &&
            notification.response.data.type === "about:blank")
            ? "error"
            : notification.type,
        toastId: new Date().getTime() + Math.random()
      }
    };
  }
};

export const addNotifications = notifications => {
  let notificationsTmp = [];
  for (var key in notifications) {
    notificationsTmp.push({
      key: key,
      message: notifications[key],
      type: notifications[key].type || "error",
      toastId: new Date().getTime() + Math.random()
    });
  }
  return {
    type: constants.ADD_NOTIFICATIONS,
    notifications: notificationsTmp
  };
};

export const removeNotification = key => ({
  type: constants.REMOVE_NOTIFICATION,
  key
});

export const removeNotifications = () => ({
  type: constants.REMOVE_NOTIFICATIONS
});
