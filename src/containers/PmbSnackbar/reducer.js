import * as constants from "./constants";

export const initialState = {
  notifications: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.ADD_NOTIFICATION: {
      return {
        ...state,
        notifications: [action.notification]
      };
    }

    case constants.ADD_NOTIFICATIONS: {
      return {
        ...state,
        notifications: action.notifications
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
