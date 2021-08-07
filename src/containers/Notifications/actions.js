import * as constants from "./constants";

export const addNotification = payload => {
  if (typeof payload === "string") {
    return {
      type: constants.ADD_NOTIFICATION,
      notification: {
        key: payload,
        message: payload,
        type: "error",
        toastId: new Date().getTime() + Math.random()
      }
    };
  } else {
    return {
      type: constants.ADD_NOTIFICATION,
      notification: {
        key: payload.key || payload.message,
        message:
          (payload.response &&
            payload.response.data &&
            payload.response.data.message) ||
          payload.message,
        type: payload.type || "error",
        toastId: new Date().getTime() + Math.random()
      }
    };
  }
};

export const addNotifications = payload => {
  let notifications = [];
  if (
    !Array.isArray(payload) &&
    payload &&
    payload.response &&
    !Array.isArray(payload.response.data)
  ) {
    notifications.push({
      key: payload.key || payload.message,
      message:
        (payload.response &&
          payload.response.data &&
          payload.response.data.message) ||
        payload.message,
      type: payload.type || "error",
      toastId: new Date().getTime() + Math.random()
    });
  } else {
    let notificationsTmp =
      payload && payload.response && Array.isArray(payload.response.data)
        ? payload.response.data
        : payload;
    for (var key in notificationsTmp) {
      notifications.push({
        key: notificationsTmp[key]["key"],
        message: notificationsTmp[key]["message"],
        type: notificationsTmp[key]["type"] || "error",
        toastId: new Date().getTime() + Math.random()
      });
    }
  }
  return {
    type: constants.ADD_NOTIFICATIONS,
    notifications
  };
};

export const removeNotification = key => ({
  type: constants.REMOVE_NOTIFICATION,
  key
});

export const removeNotifications = () => ({
  type: constants.REMOVE_NOTIFICATIONS
});
