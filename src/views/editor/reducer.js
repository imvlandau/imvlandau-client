import * as constants from "./constants";

export const initialState = {
  fetching: false,
  fetchingContent: false,
  boxTreeMaxDepth: 1,
  processing: false,
  uploadPreferredEntrypoints: [],
  uploadMaxNumberOfFiles: 52,
  uploadMaxFileSize: 8388608,
  uploadAcceptFileTypes: /\.(gif|jpe?g|png)$/i
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case constants.FETCH_APP_REQUEST:
      return { ...state, fetching: true };

    case constants.FETCH_APP_SUCCESS:
      return {
        ...state,
        fetching: false,
        boxTreeMaxDepth: action.boxTreeMaxDepth
      };

    case constants.FETCH_APP_FAILURE:
      return {
        ...state,
        fetching: false
      };

    case constants.GET_CHILDREN_REQUEST:
      return { ...state, fetching: true };

    case constants.GET_CHILDREN_SUCCESS:
      return { ...state, fetching: false };

    case constants.GET_CHILDREN_FAILURE:
      return {
        ...state,
        fetching: false
      };

    case constants.CREATE_FILE_REQUEST:
      return { ...state, processing: true };

    case constants.CREATE_FILE_SUCCESS:
      return { ...state, processing: false };

    case constants.CREATE_FILE_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.CREATE_DIRECTORY_REQUEST:
      return { ...state, processing: true };

    case constants.CREATE_DIRECTORY_SUCCESS:
      return { ...state, processing: false };

    case constants.CREATE_DIRECTORY_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.DELETE_FILE_REQUEST:
      return { ...state, processing: true };

    case constants.DELETE_FILE_SUCCESS:
      return { ...state, processing: false };

    case constants.DELETE_FILE_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.DELETE_DIRECTORY_REQUEST:
      return { ...state, processing: true };

    case constants.DELETE_DIRECTORY_SUCCESS:
      return { ...state, processing: false };

    case constants.DELETE_DIRECTORY_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.DELETE_CHILDREN_REQUEST:
      return { ...state, processing: true };

    case constants.DELETE_CHILDREN_SUCCESS:
      return { ...state, processing: false };

    case constants.DELETE_CHILDREN_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.DUPLICATE_FILE_REQUEST:
      return { ...state, processing: true };

    case constants.DUPLICATE_FILE_SUCCESS:
      return { ...state, processing: false };

    case constants.DUPLICATE_FILE_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.DUPLICATE_DIRECTORY_REQUEST:
      return { ...state, processing: true };

    case constants.DUPLICATE_DIRECTORY_SUCCESS:
      return { ...state, processing: false };

    case constants.DUPLICATE_DIRECTORY_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.RENAME_FILE_REQUEST:
      return { ...state, processing: true };

    case constants.RENAME_FILE_SUCCESS:
      return { ...state, processing: false };

    case constants.RENAME_FILE_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.RENAME_DIRECTORY_REQUEST:
      return { ...state, processing: true };

    case constants.RENAME_DIRECTORY_SUCCESS:
      return { ...state, processing: false };

    case constants.RENAME_DIRECTORY_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.MOVE_FILE_REQUEST:
      return { ...state, processing: true };

    case constants.MOVE_FILE_SUCCESS:
      return { ...state, processing: false };

    case constants.MOVE_FILE_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.MOVE_DIRECTORY_REQUEST:
      return { ...state, processing: true };

    case constants.MOVE_DIRECTORY_SUCCESS:
      return { ...state, processing: false };

    case constants.MOVE_DIRECTORY_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.FETCH_CONTENT_REQUEST:
      return { ...state, fetchingContent: true };

    case constants.FETCH_CONTENT_SUCCESS:
      return {
        ...state,
        fetchingContent: false
      };

    case constants.FETCH_CONTENT_FAILURE:
      return {
        ...state,
        fetchingContent: false
      };

    case constants.UPDATE_CONTENT_REQUEST:
      return { ...state, processing: true };

    case constants.UPDATE_CONTENT_SUCCESS:
      return {
        ...state,
        processing: false
      };

    case constants.UPDATE_CONTENT_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.UPLOAD_FILE_REQUEST:
      return { ...state, processing: true };

    case constants.UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        processing: false
      };

    case constants.UPLOAD_FILE_FAILURE:
      return {
        ...state,
        processing: false
      };

    case constants.REFRESH_REQUEST:
      return { ...state, fetchingContent: true };

    case constants.REFRESH_SUCCESS:
      return {
        ...state,
        fetchingContent: false
      };

    case constants.REFRESH_FAILURE:
      return {
        ...state,
        fetchingContent: false
      };

    default:
      return state;
  }
}
