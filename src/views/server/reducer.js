import * as constants from "./constants";

export const initialState = {
  fetching: false,
  processingKeyPairs: false,
  processingStartupScripts: false,
  startupScripts: [],
  keyPairs: [],
  locations: [],
  operatingSystems: [],
  hardwarePriceList: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.GET_INFRASTRUCTURE_OPTIONS_REQUEST:
      return {
        ...state,
        fetching: true,
        processingStartupScripts: true,
        processingKeyPairs: true
      };

    case constants.GET_INFRASTRUCTURE_OPTIONS_SUCCESS:
      return {
        ...state,
        fetching: false,
        processingStartupScripts: false,
        processingKeyPairs: false,
        hardwarePriceList: action.hardwarePriceList,
        startupScripts: action.startupScripts,
        keyPairs: action.keyPairs,
        locations: action.locations,
        operatingSystems: action.operatingSystems
      };

    case constants.GET_INFRASTRUCTURE_OPTIONS_FAILURE:
      return {
        ...state,
        fetching: false,
        processingStartupScripts: false,
        processingKeyPairs: false
      };

    case constants.GET_HARDWARE_PRICE_LIST_REQUEST:
      return { ...state, fetching: true };

    case constants.GET_HARDWARE_PRICE_LIST_SUCCESS:
      return {
        ...state,
        fetching: false,
        hardwarePriceList: action.hardwarePriceList
      };

    case constants.GET_HARDWARE_PRICE_LIST_FAILURE:
      return {
        ...state,
        fetching: false
      };

    case constants.CREATE_STARTUP_SCRIPT_REQUEST:
      return { ...state, processingStartupScripts: true };

    case constants.CREATE_STARTUP_SCRIPT_SUCCESS:
      return {
        ...state,
        processingStartupScripts: false,
        startupScripts: action.startupScripts
      };

    case constants.CREATE_STARTUP_SCRIPT_FAILURE:
      return {
        ...state,
        processingStartupScripts: false
      };

    case constants.CREATE_KEY_PAIR_REQUEST:
      return { ...state, processingKeyPairs: true };

    case constants.CREATE_KEY_PAIR_SUCCESS:
      return {
        ...state,
        processingKeyPairs: false,
        keyPairs: action.keyPairs
      };

    case constants.CREATE_KEY_PAIR_FAILURE:
      return {
        ...state,
        processingKeyPairs: false
      };

    case constants.DEPLOY_SERVER_REQUEST:
      return { ...state, fetching: true };

    case constants.DEPLOY_SERVER_SUCCESS:
      return {
        ...state,
        fetching: false
      };

    case constants.DEPLOY_SERVER_FAILURE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
}
