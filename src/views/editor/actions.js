import { axiosInstance } from "../../instances";
import { addNotification, addNotifications } from "../../helpers";
import find from "lodash.find";
import * as constants from "./constants";
import {
  ab2str,
  getLazyLoadedPathnames,
  getSelectedNode,
  addLazyLoadedPathname,
  expandTreeByLocalStorage,
  flatToNested,
  DIRECTORY,
  FILE
} from "../../helpers/utils";

export { addNotification };

export const fetchApp = shortid => (dispatch, getState) => {
  dispatch({ type: constants.FETCH_APP_REQUEST });
  return axiosInstance
    .get(`/api/${shortid}/app/fetch`)
    .then(response => {
      try {
        let boxTree = [];
        let boxTreeFlat = response.data.boxTreeFlat;
        let boxTreeMaxDepth = response.data.boxTreeMaxDepth;
        let lazyLoadedPathnames = getLazyLoadedPathnames(shortid);
        let selectedNode = getSelectedNode(shortid);
        if (!lazyLoadedPathnames.length) {
          selectedNode =
            (selectedNode &&
              find(boxTreeFlat, { pathname: selectedNode.pathname })) ||
            boxTreeFlat[0];
          boxTree = expandTreeByLocalStorage(
            shortid,
            flatToNested(boxTreeFlat)
          );
          dispatch({
            type: constants.FETCH_APP_SUCCESS,
            boxTreeMaxDepth
          });
          return { ...response.data, boxTree, selectedNode };
        } else {
          let promises = lazyLoadedPathnames.map(pathname =>
            getChildren(shortid, pathname)(dispatch, getState)
          );
          return Promise.all(promises).then(lazyLoadedResponse => {
            let lazyLoadedDirectories = lazyLoadedResponse.reduce(
              (total, next) => {
                return total.concat(next);
              }
            );
            for (let lazyLoadedDirectory of lazyLoadedDirectories) {
              if (
                // if not loaded already by fetchApp AND
                lazyLoadedDirectory.path.split("/").length - 1 >
                  boxTreeMaxDepth &&
                // if not yet added to flat tree
                !find(boxTreeFlat, { pathname: lazyLoadedDirectory.pathname })
              ) {
                boxTreeFlat = boxTreeFlat.concat(lazyLoadedDirectory);
              }
            }
            selectedNode =
              (selectedNode &&
                find(boxTreeFlat, { pathname: selectedNode.pathname })) ||
              boxTreeFlat[0];
            boxTree = expandTreeByLocalStorage(
              shortid,
              flatToNested(boxTreeFlat)
            );
            dispatch({
              type: constants.FETCH_APP_SUCCESS,
              boxTreeMaxDepth
            });
            return { ...response.data, boxTree, selectedNode };
          });
        }
      } catch (error) {
        console.error(error);
        return Promise.reject(error.message);
      }
    })
    .catch(message => {
      dispatch({ type: constants.FETCH_APP_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const getChildren = (shortid, pathname, depth = 0) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.GET_CHILDREN_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/get/children`, {
      pathname,
      depth
    })
    .then(response => {
      dispatch({ type: constants.GET_CHILDREN_SUCCESS });
      addLazyLoadedPathname(shortid, pathname);
      return response.data;
    })
    .catch(message => {
      dispatch({ type: constants.GET_CHILDREN_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const createFile = (shortid, pathname, name) => (dispatch, getState) => {
  dispatch({ type: constants.CREATE_FILE_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/file/create`, {
      pathname,
      name
    })
    .then(response => {
      dispatch({ type: constants.CREATE_FILE_SUCCESS });
      return {
        children: [],
        name,
        path: pathname,
        pathname: pathname + "/" + name,
        type: FILE
      };
    })
    .catch(message => {
      dispatch({ type: constants.CREATE_FILE_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const createDirectory = (shortid, pathname, name) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.CREATE_DIRECTORY_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/directory/create`, {
      pathname,
      name
    })
    .then(response => {
      dispatch({ type: constants.CREATE_DIRECTORY_SUCCESS });
      return {
        children: [],
        name,
        path: pathname,
        pathname: pathname + "/" + name,
        type: DIRECTORY
      };
    })
    .catch(message => {
      dispatch({ type: constants.CREATE_DIRECTORY_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const deleteFile = (shortid, pathname) => (dispatch, getState) => {
  dispatch({ type: constants.DELETE_FILE_REQUEST });
  return axiosInstance
    .delete(`/api/${shortid}/file/delete`, {
      data: {
        pathname
      }
    })
    .then(response => {
      dispatch({ type: constants.DELETE_FILE_SUCCESS });
      return response.data;
    })
    .catch(message => {
      dispatch({ type: constants.DELETE_FILE_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const deleteDirectory = (shortid, pathname) => (dispatch, getState) => {
  dispatch({ type: constants.DELETE_DIRECTORY_REQUEST });
  return axiosInstance
    .delete(`/api/${shortid}/directory/delete`, {
      data: {
        pathname
      }
    })
    .then(response => {
      dispatch({ type: constants.DELETE_DIRECTORY_SUCCESS });
      return response.data;
    })
    .catch(message => {
      dispatch({ type: constants.DELETE_DIRECTORY_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const deleteChildren = (shortid, pathname) => (dispatch, getState) => {
  dispatch({ type: constants.DELETE_CHILDREN_REQUEST });
  return axiosInstance
    .delete(`/api/${shortid}/children/delete`, {
      data: {
        pathname
      }
    })
    .then(response => {
      dispatch({ type: constants.DELETE_CHILDREN_SUCCESS });
      return response.data;
    })
    .catch(message => {
      dispatch({ type: constants.DELETE_CHILDREN_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const duplicateFile = (shortid, pathname, path, name) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.DUPLICATE_FILE_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/file/duplicate`, {
      pathname,
      path,
      name
    })
    .then(response => {
      dispatch({ type: constants.DUPLICATE_FILE_SUCCESS });
      return response.data;
    })
    .catch(message => {
      dispatch({ type: constants.DUPLICATE_FILE_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const duplicateDirectory = (shortid, pathname, path, name) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.DUPLICATE_DIRECTORY_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/directory/duplicate`, {
      pathname,
      path,
      name
    })
    .then(response => {
      dispatch({ type: constants.DUPLICATE_DIRECTORY_SUCCESS });
      return flatToNested(response.data);
    })
    .catch(message => {
      dispatch({ type: constants.DUPLICATE_DIRECTORY_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const renameFile = (shortid, pathname, path, name) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.RENAME_FILE_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/file/rename`, {
      pathname,
      path,
      name
    })
    .then(response => {
      dispatch({ type: constants.RENAME_FILE_SUCCESS });
      return response.data;
    })
    .catch(message => {
      dispatch({ type: constants.RENAME_FILE_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const renameDirectory = (shortid, pathname, path, name) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.RENAME_DIRECTORY_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/directory/rename`, {
      pathname,
      path,
      name
    })
    .then(response => {
      dispatch({ type: constants.RENAME_DIRECTORY_SUCCESS });
      return flatToNested(response.data);
    })
    .catch(message => {
      dispatch({ type: constants.RENAME_DIRECTORY_FAILURE });
      dispatch(addNotifications(message));
      return new Promise(() => {});
    });
};

export const moveFile = (shortid, pathname, path, name) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.MOVE_FILE_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/file/move`, {
      pathname,
      path,
      name
    })
    .then(response => {
      dispatch({ type: constants.MOVE_FILE_SUCCESS });
      return response.data;
    })
    .catch(message => {
      dispatch({ type: constants.MOVE_FILE_FAILURE });
      dispatch(addNotifications(message));
      return Promise.reject(message);
    });
};

export const moveDirectory = (shortid, pathname, path, name) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.MOVE_DIRECTORY_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/directory/move`, {
      pathname,
      path,
      name
    })
    .then(response => {
      dispatch({ type: constants.MOVE_DIRECTORY_SUCCESS });
      return flatToNested(response.data);
    })
    .catch(message => {
      dispatch({ type: constants.MOVE_DIRECTORY_FAILURE });
      dispatch(addNotifications(message));
      return Promise.reject(message);
    });
};

export const fetchContent = (shortid, pathname) => (dispatch, getState) => {
  dispatch({ type: constants.FETCH_CONTENT_REQUEST });
  return axiosInstance
    .get(`/api/${shortid}/fetch/content`, {
      params: {
        pathname
      },
      headers: { "Cache-Control": "no-cache" },
      responseType: "arraybuffer"
    })
    .then(response => {
      dispatch({ type: constants.FETCH_CONTENT_SUCCESS });
      return response.data;
    })
    .catch(response => {
      let data = JSON.parse(ab2str(response));
      dispatch({ type: constants.FETCH_CONTENT_FAILURE });
      dispatch(addNotifications(data.message));
    });
};

export const updateContent = (shortid, pathname, content) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.UPDATE_CONTENT_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/update/content`, {
      pathname,
      content
    })
    .then(response => {
      dispatch({
        type: constants.UPDATE_CONTENT_SUCCESS,
        notification: {
          toastId: new Date().getTime() + Math.random(),
          message: "Changes saved",
          autoClose: 5000,
          type: "success"
        }
      });
    })
    .catch(message => {
      dispatch({ type: constants.UPDATE_CONTENT_FAILURE });
      dispatch(addNotifications(message));
    });
};

export const uploadFile = (dropzone, shortid, pathname, file) => (
  dispatch,
  getState
) => {
  dispatch({ type: constants.UPLOAD_FILE_REQUEST });
  return dropzone
    .fileupload("send", {
      url: `/api/${shortid}/file/upload`,
      files: [file],
      formData: {
        pathname,
        uid: file.uid
      }
    })
    .done((result, textStatus, jqXHR) => {
      dispatch({ type: constants.UPLOAD_FILE_SUCCESS });
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      dispatch({ type: constants.UPLOAD_FILE_FAILURE });
      dispatch(addNotifications(textStatus));
    });
};

export const refresh = (shortid, pathname, depth) => (dispatch, getState) => {
  dispatch({ type: constants.REFRESH_REQUEST });
  return axiosInstance
    .post(`/api/${shortid}/refresh`, {
      pathname,
      depth
    })
    .then(response => {
      dispatch({ type: constants.REFRESH_SUCCESS });
      return response.data;
    })
    .catch(message => {
      dispatch({ type: constants.REFRESH_FAILURE });
      dispatch(addNotifications(message));
      return Promise.reject(message);
    });
};

// createPmbConfigFile
// createPm2ConfigFile

// duplicateChecked
// deleteChecked
