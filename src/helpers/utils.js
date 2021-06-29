import { getNodeAtPath, changeNodeAtPath } from "react-sortable-tree";

// ======================= tree utils
// ===========================================================================

export const DIRECTORY = "dir";
export const TOOL = "tool";
export const FILE = "file";

export const getNodeKey = ({ node }) => node.pathname;

export const isDirectory = node => {
  return hasType(node, DIRECTORY);
};

export const isTool = node => {
  return hasType(node, TOOL);
};

export const isFile = node => {
  return hasType(node, FILE);
};

export const hasType = (node, type) => {
  return node && node.type && node.type.indexOf(type) > -1;
};

export const flatToNested = list => {
  var map = {},
    node,
    roots = [],
    i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i].pathname] = i; // initialize the map
    list[i].children = []; // initialize the children
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    // root node has to be the first element of the array
    if (i > 0) {
      // if you have dangling branches check that map[node.path] exists
      list[map[node.path]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
};

export const generatePathByPathname = pathname => {
  function generatePathArray(path, name) {
    if (!Array.isArray(path)) {
      path = [path];
      path.push(path + "/" + name);
      return path;
    } else {
      path.push(path[path.length - 1] + "/" + name);
      return path;
    }
  }
  let result = pathname.split("/").reduce(generatePathArray);
  return !Array.isArray(result) ? [result] : result;
};

export const isDescendantElementOfClass = (child, className, max = 5) => {
  let node = child;
  let i = 0;
  while (node != null && i <= max) {
    if (node.className && node.className.includes(className)) {
      return true;
    }
    node = node.parentNode;
    i++;
  }
  return false;
};

export const findParentOf = (nodes, node) => {
  return findParentOfByPathname(nodes, node.pathname);
};

export const findParentOfByPathname = (nodes, pathname) => {
  let parent = null;
  for (let node of nodes) {
    if (hasChildByPathname(node, pathname)) {
      return node;
    } else {
      parent = findParentOfByPathname(node.children, pathname);
      if (parent) {
        return parent;
      }
    }
  }
  return null;
};

export const hasChild = (parent, child) => {
  return hasChildByPathname(parent, child.pathname);
};

export const hasChildByPathname = (parent, pathname) => {
  let children = parent.children;
  let found = false;
  for (let i = 0; i < children.length; i++) {
    if (children[i].pathname === pathname) {
      found = true;
      break;
    }
  }
  return found;
};

export const ab2str = uint8array => {
  return new TextDecoder().decode(uint8array);
};

export const findAllParentsOf = (nodes, node) => {
  let parents = [];
  var currentNode = node;
  while (currentNode) {
    parents.unshift(currentNode);
    currentNode = findParentOfByPathname(nodes, currentNode.pathname);
  }
  return parents;
};

export const isDescendantOf = (nodes, parent, child) => {
  return findAllParentsOf(nodes, child).filter(node => {
    return node.pathname === parent.pathname;
  }).length;
};

// ======================= localStorage utils
// ===========================================================================

export const getLazyLoadedPathnames = shortid => {
  let localStore = getStoreOrCreateIfNotExists(shortid);
  return localStore["lazyLoadedPathnames"] || [];
};

export const addLazyLoadedPathname = (shortid, pathname) => {
  let localStore = getStoreOrCreateIfNotExists(shortid);
  let lazyLoadedPathnames = getLazyLoadedPathnames(shortid) || [];
  if (lazyLoadedPathnames.indexOf(pathname) === -1) {
    lazyLoadedPathnames.push(pathname);
    localStorage.setItem(
      shortid,
      JSON.stringify({ ...localStore, lazyLoadedPathnames })
    );
  }
};

export const removeLazyLoadedPathname = (shortid, pathname) => {
  let localStore = getStoreOrCreateIfNotExists(shortid);
  let lazyLoadedPathnames = getLazyLoadedPathnames(shortid) || [];
  let index = lazyLoadedPathnames.indexOf(pathname);
  if (index !== -1) {
    lazyLoadedPathnames.splice(index, 1);
    localStorage.setItem(
      shortid,
      JSON.stringify({ ...localStore, lazyLoadedPathnames })
    );
  }
};

export const getExpandedPathnames = shortid => {
  let localStore = getStoreOrCreateIfNotExists(shortid);
  return localStore["expandedPathnames"] || [];
};

export const addExpandedPathname = (shortid, pathname) => {
  let localStore = getStoreOrCreateIfNotExists(shortid);
  let expandedPathnames = getExpandedPathnames(shortid) || [];
  if (expandedPathnames.indexOf(pathname) === -1) {
    expandedPathnames.push(pathname);
    localStorage.setItem(
      shortid,
      JSON.stringify({ ...localStore, expandedPathnames })
    );
  }
};

export const removeExpandedPathname = (shortid, pathname) => {
  let localStore = getStoreOrCreateIfNotExists(shortid);
  let expandedPathnames = getExpandedPathnames(shortid) || [];
  let index = expandedPathnames.indexOf(pathname);
  if (index !== -1) {
    expandedPathnames.splice(index, 1);
    localStorage.setItem(
      shortid,
      JSON.stringify({ ...localStore, expandedPathnames })
    );
  }
};

export const getSelectedNode = shortid => {
  let localStore = getStoreOrCreateIfNotExists(shortid);
  return localStore["selectedNode"];
};

export const setSelectedNode = (shortid, node) => {
  let localStore = getStoreOrCreateIfNotExists(shortid);
  localStorage.setItem(
    shortid,
    JSON.stringify({ ...localStore, selectedNode: node })
  );
};

export const unsetSelectedNode = shortid => {
  let localStore = getStoreOrCreateIfNotExists(shortid);
  localStorage.setItem(
    shortid,
    JSON.stringify({ ...localStore, selectedNode: null })
  );
};

export const getStoreOrCreateIfNotExists = shortid => {
  let localStore =
    localStorage.getItem(shortid) && JSON.parse(localStorage.getItem(shortid));
  if (!localStore) {
    localStore = {};
    localStorage.setItem(shortid, JSON.stringify(localStore));
  }
  return localStore;
};

export const expandTreeByLocalStorage = (shortid, treeData) => {
  let expandedPathnames = getExpandedPathnames(shortid);
  for (let expandedPathname of expandedPathnames) {
    let nodePath = generatePathByPathname(expandedPathname);
    let nodeData = getNodeAtPath({
      treeData,
      path: nodePath,
      getNodeKey,
      ignoreCollapsed: false
    });
    if (!nodeData) {
      // if tried to expand non-existant directory node due to old localStore data
      removeExpandedPathname(shortid, expandedPathname);
    } else {
      treeData = changeNodeAtPath({
        treeData,
        path: nodePath,
        newNode: { ...nodeData.node, expanded: true },
        getNodeKey,
        ignoreCollapsed: false
      });
    }
  }
  return treeData;
};

// ======================= file upload utils
// ===========================================================================

export const formatBytes = (bytes, decimals) => {
  if (bytes === 0) return "0 Bytes";
  var k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const uid = () => {
  const ALPHABET = "0123456789abcdef";
  const s = [];
  for (let i = 0; i < 36; i++) {
    s[i] = ALPHABET.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = ALPHABET.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
};
