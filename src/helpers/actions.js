import * as constants from "./constants";

export const addNotification = notification => (dispatch, getState) => {
  if (typeof notify === "string") {
    notification = {
      key: notification,
      message: notification,
      type: "error",
      toastId: new Date().getTime() + Math.random()
    };
  } else {
    notification = {
      key: notification.key || notification.message,
      message: notification.message,
      type: notification.type === "about:blank" ? "error" : notification.type,
      toastId: new Date().getTime() + Math.random()
    };
  }
  dispatch({
    type: constants.ADD_NOTIFICATION,
    notification
  });
};

export const addNotifications = notifications => (dispatch, getState) => {
  let notificationsTmp = [];
  for (var key in notifications) {
    notificationsTmp.push({
      key: key,
      message: notifications[key],
      type: notifications[key].type || "error",
      toastId: new Date().getTime() + Math.random()
    });
  }
  dispatch({
    type: constants.ADD_NOTIFICATIONS,
    notifications: notificationsTmp
  });
};

export const removeNotification = key => (dispatch, getState) => {
  dispatch({ type: constants.REMOVE_NOTIFICATION, key });
};

export const removeNotifications = () => (dispatch, getState) => {
  dispatch({ type: constants.REMOVE_NOTIFICATIONS });
};
