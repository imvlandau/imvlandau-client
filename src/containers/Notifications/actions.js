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
  for (var key in payload) {
    notifications.push({
      key: payload[key]["key"],
      message: payload[key]["message"],
      type: payload[key]["type"] || "error",
      toastId: new Date().getTime() + Math.random()
    });
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
