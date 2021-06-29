import * as constants from "./constants";

export const initialState = {
  notifications: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.ADD_NOTIFICATION: {
      let foundInOldTheNewOne = state.notifications.filter(notification => {
        let notfound = notification.key.indexOf(action.notification.key) === -1;
        return notfound;
      });
      let newNotification = action.notification;
      return {
        ...state,
        notifications: [...foundInOldTheNewOne, newNotification]
      };
    }

    case constants.ADD_NOTIFICATIONS: {
      // if the new notification was found in the current list, return cut this element out from current list
      // get current list minus new notification
      let foundInOldSomeOfTheNew = state.notifications.filter(notification => {
        let found = action.notifications.find(newNotification => {
          return notification.key === newNotification.key;
        });
        return !found;
      });
      let newNotifications = action.notifications;
      return {
        ...state,
        notifications: [...foundInOldSomeOfTheNew, ...newNotifications]
      };
    }

    case constants.REMOVE_NOTIFICATION: {
      return {
        ...state,
        notifications: [
          ...state.notifications.filter(
            notification => notification.key.indexOf(action.key) === -1
          )
        ]
      };
    }

    case constants.REMOVE_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };

    default:
      return state;
  }
}
