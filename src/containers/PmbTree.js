import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import * as actionCreators from "../views/editor/actions";
import {
  SortableTreeWithoutDndContext as SortableTree,
  addNodeUnderParent,
  changeNodeAtPath,
  getNodeAtPath,
  removeNode,
  walk as walkTree
} from "react-sortable-tree";
import "react-sortable-tree/style.css";
import AnyFileTypeIcon from "@material-ui/icons/ListAlt";
import PmbNodeRendererDefault from "../components/PmbNodeRendererDefault";
import PmbTreeNodeNameDialog from "../components/PmbTreeNodeNameDialog";
import PmbDeleteDialog from "../components/PmbDeleteDialog";
import PmbTreeNodeMenu from "../components/PmbTreeNodeMenu";
import PmbDropzoneTableDialog from "./PmbDropzoneTableDialog";
import { initialState } from "../views/editor";
import {
  isDirectory,
  isFile,
  isDescendantElementOfClass,
  isDescendantOf,
  findParentOf,
  findAllParentsOf,
  getNodeKey,
  generatePathByPathname,
  addExpandedPathname,
  removeExpandedPathname,
  removeLazyLoadedPathname,
  addLazyLoadedPathname,
  DIRECTORY,
  FILE
} from "../helpers/utils";

require("blueimp-file-upload/js/vendor/jquery.ui.widget.js");
require("blueimp-file-upload/js/jquery.iframe-transport.js");
require("blueimp-file-upload/js/jquery.fileupload.js");
require("blueimp-file-upload/js/jquery.fileupload-process.js");
require("blueimp-file-upload/js/jquery.fileupload-validate.js");
require("blueimp-file-upload/js/cors/jquery.postmessage-transport.js");
require("blueimp-file-upload/js/cors/jquery.xdr-transport.js");

const styles = theme => ({
  "@global": {
    ".rst__virtualScrollOverride": {
      overflowX: "scroll !important"
    }
  },
  tree: {
    height: "100%",
    overflow: "hidden"
  },
  selectedNode: {
    "& .rst__moveHandle": {
      backgroundColor: theme.palette.secondary.dark
    },
    "& .rst__rowContents": {
      backgroundColor: theme.palette.grey[300]
    }
  }
});

class PmbTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boxTree: [],
      boxTreePrevious: null,
      nameDialogNode: null,
      nameDialogType: null,
      deleteDialogNode: null,
      deleteDialogPath: null,
      deleteChildrenDialogNode: null,
      deleteChildrenDialogPath: null,
      duplicateDialogNode: null,
      filesToUpload: [],
      uploaded: {},
      uploadFilesToTargetParent: null,
      uploadFilesDialogOpen: false
    };
  }

  componentDidMount = () => {
    this.props.fetchApp(this.props.match.params.shortid).then(data => {
      this.props.onSelectNode && this.props.onSelectNode(data.selectedNode);
      this.setState({ boxTree: data.boxTree });
    });

    this.dropzone = $(document).fileupload({
      disableAudioPreview: true,
      disableImageLoad: true,
      disableImagePreview: true,
      disableImageResize: true,
      disableVideoPreview: true,
      maxFileSize: initialState.uploadMaxFileSize,
      limitConcurrentUploads: initialState.uploadMaxNumberOfFiles,
      acceptFileTypes: initialState.uploadAcceptFileTypes,
      dropZone: null,
      autoUpload: true
    });
  };

  componentDidUpdate = prevProps => {
    // ======================= boxTree
    // =========================================================================
    if (!prevProps.socket && this.props.socket) {
      this.props.socket.on("createFile", data => {
        this.createNode(data);
      });
      this.props.socket.on("createDirectory", data => {
        this.createNode(data);
      });

      this.props.socket.on("deleteFile", data => {
        this.deleteNode(data);
      });
      this.props.socket.on("deleteDirectory", data => {
        this.deleteNode(data);
      });
      this.props.socket.on("deleteChildren", data => {
        this.deleteChildren(data);
      });

      this.props.socket.on("duplicateFile", data => {
        this.duplicateNode(data);
      });
      this.props.socket.on("duplicateDirectory", data => {
        this.duplicateNode(data);
      });

      this.props.socket.on("renameFile", data => {
        this.renameNode(data);
      });
      this.props.socket.on("renameDirectory", data => {
        this.renameNode(data);
      });

      this.props.socket.on("moveFile", data => {
        this.moveNode(data);
      });
      this.props.socket.on("moveDirectory", data => {
        this.moveNode(data);
      });

      this.props.socket.on("uploadFiles", data => {
        this.disposeUploadedFiles(data);
      });
    }
  };

  handleChangeNode = boxTree => {
    this.setState({
      boxTree,
      boxTreePrevious: this.state.boxTree
    });
  };

  handleToggleVisibility = ({ node, expanded }) => {
    if (expanded) {
      addExpandedPathname(this.props.match.params.shortid, node.pathname);
      node.children &&
        !node.children.length &&
        this.props
          .getChildren(this.props.match.params.shortid, node.pathname)
          .then(children => {
            if (children.length) {
              let boxTree = changeNodeAtPath({
                treeData: this.state.boxTree,
                path: generatePathByPathname(node.pathname),
                newNode: { ...node, children: [] },
                getNodeKey,
                ignoreCollapsed: false
              });
              let tree = { treeData: boxTree };
              for (let child of children) {
                tree = addNodeUnderParent({
                  treeData: tree.treeData,
                  newNode: child,
                  parentKey: node.pathname,
                  getNodeKey,
                  ignoreCollapsed: false,
                  expandParent: true,
                  addAsFirstChild: false
                });
              }
              this.setState({ boxTree: tree.treeData });
            } else {
              // if directory does not have any children remove it from the
              // lazy loading process list
              removeLazyLoadedPathname(
                this.props.match.params.shortid,
                node.pathname
              );
              // also do not expand it automatically during init process
              removeExpandedPathname(
                this.props.match.params.shortid,
                node.pathname
              );
            }
          });
    } else {
      removeExpandedPathname(this.props.match.params.shortid, node.pathname);
    }
  };

  // create file or folder
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleClickCreateFile = node => {
    this.setState({ nameDialogNode: node, nameDialogType: FILE });
  };

  handleClickCreateDirectory = node => {
    this.setState({ nameDialogNode: node, nameDialogType: DIRECTORY });
  };

  handleNameDialogSubmit = name => {
    if (this.state.nameDialogType === FILE) {
      this.props
        .createFile(
          this.props.match.params.shortid,
          this.state.nameDialogNode.pathname,
          name
        )
        .then(added => {
          const data = {
            pathname: this.state.nameDialogNode.pathname,
            added
          };
          this.createNode(data);
          this.handleNameDialogClose();
          this.props.socket.emit("createFile", data);
        });
    } else if (this.state.nameDialogType === DIRECTORY) {
      this.props
        .createDirectory(
          this.props.match.params.shortid,
          this.state.nameDialogNode.pathname,
          name
        )
        .then(added => {
          const data = {
            pathname: this.state.nameDialogNode.pathname,
            added
          };
          this.createNode(data);
          this.handleNameDialogClose();
          this.props.socket.emit("createDirectory", data);
        });
    }
  };

  handleNameDialogClose = () => {
    this.setState({ nameDialogNode: null, nameDialogType: null });
  };

  createNode = ({ added, pathname }) => {
    let newTree = addNodeUnderParent({
      treeData: this.state.boxTree,
      newNode: added,
      parentKey: pathname,
      getNodeKey,
      ignoreCollapsed: false,
      expandParent: true,
      addAsFirstChild: true
    });
    this.setState({ boxTree: newTree.treeData });
  };

  // delete file or folder
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleClickDeleteNode = (node, path) => {
    this.setState({ deleteDialogNode: node, deleteDialogPath: path });
  };

  handleDeleteDialogDelete = () => {
    if (isFile(this.state.deleteDialogNode)) {
      this.props
        .deleteFile(
          this.props.match.params.shortid,
          this.state.deleteDialogNode.pathname
        )
        .then(() => {
          const data = {
            path: this.state.deleteDialogPath,
            node: this.state.deleteDialogNode
          };
          this.deleteNode(data);
          this.handleDeleteDialogClose();
          this.props.socket.emit("deleteFile", data);
        });
    } else if (isDirectory(this.state.deleteDialogNode)) {
      this.props
        .deleteDirectory(
          this.props.match.params.shortid,
          this.state.deleteDialogNode.pathname
        )
        .then(() => {
          const data = {
            path: this.state.deleteDialogPath,
            node: this.state.deleteDialogNode
          };
          this.deleteNode(data);
          this.handleDeleteDialogClose();
          this.props.socket.emit("deleteDirectory", data);
        });
    }
  };

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogNode: null, deleteDialogPath: null });
  };

  deleteNode = ({ path, node }) => {
    let parent = findParentOf(this.state.boxTree, node);
    let newTree = removeNode({
      treeData: this.state.boxTree,
      path,
      getNodeKey,
      ignoreCollapsed: false
    });
    if (isFile(node) && this.props.selectedNode.pathname === node.pathname) {
      this.props.onSelectNode && this.props.onSelectNode(parent);
    } else if (isDirectory(node)) {
      walkTree({
        treeData: [node],
        getNodeKey,
        callback: item => {
          if (isDirectory(item.node)) {
            removeLazyLoadedPathname(
              this.props.match.params.shortid,
              item.node.pathname
            );
            removeExpandedPathname(
              this.props.match.params.shortid,
              item.node.pathname
            );
          }
        },
        ignoreCollapsed: false
      });
      if (isDescendantOf(this.state.boxTree, node, this.props.selectedNode)) {
        this.props.onSelectNode && this.props.onSelectNode(parent);
      }
    }
    this.setState({ boxTree: newTree.treeData });
  };

  // delete children of target folder
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleClickDeleteChildren = (node, path) => {
    this.setState({
      deleteChildrenDialogNode: node,
      deleteChildrenDialogPath: path
    });
  };

  handleDeleteChildrenDialogDelete = () => {
    isDirectory(this.state.deleteChildrenDialogNode) &&
      this.props
        .deleteChildren(
          this.props.match.params.shortid,
          this.state.deleteChildrenDialogNode.pathname
        )
        .then(() => {
          let data = { pathname: this.state.deleteChildrenDialogNode.pathname };
          this.deleteChildren(data);
          this.handleDeleteChildrenDialogClose();
          this.props.socket.emit("deleteChildren", data);
        });
  };

  handleDeleteChildrenDialogClose = () => {
    this.setState({
      deleteChildrenDialogNode: null,
      deleteChildrenDialogPath: null
    });
  };

  deleteChildren = ({ pathname }) => {
    let nodePath = generatePathByPathname(pathname);
    let nodeData = getNodeAtPath({
      treeData: this.state.boxTree,
      path: nodePath,
      getNodeKey,
      ignoreCollapsed: false
    });
    let parent = findParentOf(this.state.boxTree, nodeData.node);
    walkTree({
      treeData: [nodeData.node],
      getNodeKey,
      callback: item => {
        if (isDirectory(item.node)) {
          removeLazyLoadedPathname(
            this.props.match.params.shortid,
            item.node.pathname
          );
          removeExpandedPathname(
            this.props.match.params.shortid,
            item.node.pathname
          );
        }
      },
      ignoreCollapsed: false
    });
    if (
      isDescendantOf(this.state.boxTree, nodeData.node, this.props.selectedNode)
    ) {
      this.props.onSelectNode && this.props.onSelectNode(parent);
    }
    let boxTree = changeNodeAtPath({
      treeData: this.state.boxTree,
      path: nodePath,
      newNode: { ...nodeData.node, children: [], expanded: false },
      getNodeKey,
      ignoreCollapsed: false
    });
    this.setState({ boxTree });
  };

  // duplicate file or folder
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleClickDuplicateNode = node => {
    this.setState({ duplicateDialogNode: node });
  };

  handleDuplicateDialogSubmit = name => {
    if (isFile(this.state.duplicateDialogNode)) {
      this.props
        .duplicateFile(
          this.props.match.params.shortid,
          this.state.duplicateDialogNode.pathname,
          this.state.duplicateDialogNode.path,
          name
        )
        .then(added => {
          let data = {
            addedNodes: [added],
            path: this.state.duplicateDialogNode.path
          };
          this.duplicateNode(data);
          this.handleDuplicateDialogClose();
          this.props.socket.emit("duplicateFile", data);
        });
    } else if (isDirectory(this.state.duplicateDialogNode)) {
      this.props
        .duplicateDirectory(
          this.props.match.params.shortid,
          this.state.duplicateDialogNode.pathname,
          this.state.duplicateDialogNode.path,
          name
        )
        .then(addedNodes => {
          let data = {
            addedNodes,
            path: this.state.duplicateDialogNode.path
          };
          this.duplicateNode(data);
          this.handleDuplicateDialogClose();
          this.props.socket.emit("duplicateDirectory", data);
        });
    }
  };

  handleDuplicateDialogClose = () => {
    this.setState({ duplicateDialogNode: null });
  };

  duplicateNode = ({ addedNodes, path }) => {
    let tree = { treeData: this.state.boxTree };
    for (let added of addedNodes) {
      tree = addNodeUnderParent({
        treeData: tree.treeData,
        newNode: added,
        parentKey: path,
        getNodeKey,
        ignoreCollapsed: false,
        expandParent: true,
        addAsFirstChild: true
      });
    }
    this.setState({ boxTree: tree.treeData });
  };

  // rename file or folder
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleSubmitInlineEditable = (node, path, name) => {
    if (node.name !== name) {
      if (isFile(node)) {
        this.props
          .renameFile(
            this.props.match.params.shortid,
            node.pathname,
            node.path,
            name
          )
          .then(renamed => {
            let data = { renamedNodes: [renamed], node };
            this.renameNode(data);
            this.props.socket.emit("renameFile", data);
          });
      } else if (isDirectory(node)) {
        this.props
          .renameDirectory(
            this.props.match.params.shortid,
            node.pathname,
            node.path,
            name
          )
          .then(renamedNodes => {
            let data = { renamedNodes, node };
            this.renameNode(data);
            this.props.socket.emit("renameDirectory", data);
          });
      }
    }
  };

  renameNode = ({ renamedNodes, node }) => {
    let boxTree = this.state.boxTree;
    for (let renamed of renamedNodes) {
      if (isDirectory(node)) {
        removeLazyLoadedPathname(
          this.props.match.params.shortid,
          node.pathname
        );
        removeExpandedPathname(this.props.match.params.shortid, node.pathname);
        addLazyLoadedPathname(
          this.props.match.params.shortid,
          renamed.pathname
        );
        addExpandedPathname(this.props.match.params.shortid, renamed.pathname);
      }
      let nodePath = generatePathByPathname(node.pathname);
      boxTree = changeNodeAtPath({
        treeData: boxTree,
        path: nodePath,
        newNode: renamed,
        getNodeKey,
        ignoreCollapsed: false
      });
    }
    this.setState({ boxTree });
  };

  // Move file or folder
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleMoveNode = ({
    treeData: boxTree,
    node,
    nextParentNode: parent,
    nextPath
  }) => {
    if (isFile(node)) {
      this.props
        .moveFile(
          this.props.match.params.shortid,
          parent.pathname,
          node.path,
          node.name
        )
        .then(
          moved => {
            let data = {
              boxTree: this.state.boxTree,
              movedNodes: [moved],
              nextPath
            };
            this.moveNode(data);
            this.props.socket.emit("moveFile", data);
          },
          () => {
            this.setState({
              boxTree: this.state.boxTreePrevious,
              boxTreePrevious: null
            });
          }
        );
    } else if (isDirectory(node)) {
      this.props
        .moveDirectory(
          this.props.match.params.shortid,
          parent.pathname,
          node.path,
          node.name
        )
        .then(
          movedNodes => {
            let data = { boxTree: this.state.boxTree, movedNodes, nextPath };
            this.moveNode(data);
            this.props.socket.emit("moveDirectory", data);
          },
          () => {
            this.setState({
              boxTree: this.state.boxTreePrevious,
              boxTreePrevious: null
            });
          }
        );
    }
  };

  moveNode = ({ boxTree, movedNodes, nextPath }) => {
    for (let moved of movedNodes) {
      boxTree = changeNodeAtPath({
        treeData: boxTree,
        path: nextPath,
        newNode: moved,
        getNodeKey,
        ignoreCollapsed: false
      });
    }
    if (
      isFile(movedNodes[0]) &&
      this.props.selectedNode.pathname === nextPath[nextPath.length - 1]
    ) {
      this.props.onSelectNode && this.props.onSelectNode(movedNodes[0]);
    } else if (
      !getNodeAtPath({
        treeData: boxTree,
        path: generatePathByPathname(this.props.selectedNode.pathname),
        getNodeKey,
        ignoreCollapsed: false
      })
    ) {
      this.props.onSelectNode && this.props.onSelectNode(movedNodes[0]);
    }
    this.setState({ boxTree, boxTreePrevious: null });
  };

  // select target node
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleClickNode = (event, node, path) => {
    if (isDescendantElementOfClass(event.target, "rowContents")) {
      this.props.onSelectNode && this.props.onSelectNode(node);
    }
    // !node.epanded because of uninterrupted interaction with tree search (nervous scrollTop)
    // if (isDirectory(node) && !node.expanded) {
    if (
      (!this.props.selectedNode && isDirectory(node)) ||
      (isDirectory(node) &&
        this.props.selectedNode &&
        this.props.selectedNode.pathname === node.pathname)
    ) {
      if (node.expanded) {
        removeExpandedPathname(this.props.match.params.shortid, node.pathname);
      } else {
        addExpandedPathname(this.props.match.params.shortid, node.pathname);
      }
      let boxTree = changeNodeAtPath({
        treeData: this.state.boxTree,
        path: generatePathByPathname(node.pathname),
        newNode: { ...node, expanded: !node.expanded },
        getNodeKey,
        ignoreCollapsed: false
      });
      this.setState({ boxTree });
    }
  };

  // handle file upload
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleChangeTargetParent = targetParent => {
    this.setState({
      uploadFilesToTargetParent: targetParent
    });
  };

  onSelectFilesInFileBrowser = (files, targetParent) => {
    this.handleStartUploadFiles(files, targetParent);
  };

  handleStartUploadFiles = (files, targetParent) => {
    if (!files.length) {
      this.showNoFilesNotification();
    } else {
      let uploaded = {};
      for (let file of files) {
        uploaded[file.uid] = {
          loaded: 0,
          total: file.size
        };
      }
      this.setState({
        uploaded,
        uploadFilesToTargetParent:
          targetParent || this.state.uploadFilesToTargetParent,
        uploadFilesDialogOpen: true,
        filesToUpload: files
      });
    }
  };

  handleClickUploadFiles = (node, files) => {
    if (!files.length) {
      this.showNoFilesNotification();
    } else {
      this.dropzone.fileupload("option", {
        progress: (e, data) => {
          let uploaded = this.state.uploaded;
          if (data && uploaded[data.formData.uid]) {
            uploaded[data.formData.uid]["loaded"] = data.loaded;
            this.setState({
              uploaded: Object.assign({}, this.state.uploaded, uploaded)
            });
          }
        }
      });
      let promises = [];
      for (let file of files) {
        let jqXHR = this.props.uploadFile(
          this.dropzone,
          this.props.match.params.shortid,
          node.pathname,
          file
        );
        promises.push(jqXHR);
      }
      Promise.all(promises).then(uploads => {
        let data = { node, uploads };
        this.disposeUploadedFiles(data);
        this.props.socket.emit("uploadFiles", data);
      });
    }
  };

  disposeUploadedFiles = ({ node, uploads }) => {
    let boxTree = this.state.boxTree;
    for (let boxTreeFlat of uploads) {
      for (let node of boxTreeFlat) {
        let nodePath = generatePathByPathname(node.pathname);
        let nodeData = getNodeAtPath({
          treeData: boxTree,
          path: nodePath,
          getNodeKey,
          ignoreCollapsed: false
        });
        if (nodeData) {
          boxTree = changeNodeAtPath({
            treeData: boxTree,
            path: nodePath,
            newNode: { ...nodeData.node, expanded: true },
            getNodeKey,
            ignoreCollapsed: false
          });
        } else {
          let tree = addNodeUnderParent({
            treeData: boxTree,
            newNode: node,
            parentKey: node.path,
            getNodeKey,
            ignoreCollapsed: false,
            expandParent: true,
            addAsFirstChild: false
          });
          boxTree = tree.treeData;
        }
      }
    }
    this.setState({ boxTree });
  };

  handleCancelUploadFiles = () => {
    this.handleCloseUploadFiles();
  };

  handleCloseUploadFiles = () => {
    this.setState({
      uploadFilesDialogOpen: false,
      filesToUpload: []
    });
  };

  showNoFilesNotification = () => {
    this.props.addNotification(t("caption.no.files.were.dropped"));
  };

  // refresh file or folder
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleClickRefresh = node => {
    if (isFile(node)) {
      this.props.onRefresh && this.props.onRefresh(node);
    } else if (isDirectory(node)) {
      this.props
        .refresh(this.props.match.params.shortid, node.pathname)
        .then(children => {
          let boxTree = this.state.boxTree;
          for (let child of children) {
            let nodePath = generatePathByPathname(child.pathname);
            let nodeData = getNodeAtPath({
              treeData: boxTree,
              path: nodePath,
              getNodeKey,
              ignoreCollapsed: false
            });
            if (nodeData) {
              isFile(nodeData.node) &&
                this.props.onRefresh &&
                this.props.onRefresh(nodeData.node);
            } else {
              let tree = addNodeUnderParent({
                treeData: boxTree,
                newNode: child,
                parentKey: child.path,
                getNodeKey,
                ignoreCollapsed: false,
                expandParent: true,
                addAsFirstChild: false
              });
              boxTree = tree.treeData;
            }
          }
          this.setState({ boxTree });
        });
    }
  };

  render() {
    const { classes, selectedNode, t } = this.props;

    const generateNodeProps = ({ node, path, pathname }) => {
      let nodeProps = {};

      nodeProps.buttons = [
        <PmbTreeNodeMenu
          handleClickCreateFile={this.handleClickCreateFile}
          handleClickCreateDirectory={this.handleClickCreateDirectory}
          handleClickDeleteNode={this.handleClickDeleteNode}
          handleClickDeleteChildren={this.handleClickDeleteChildren}
          handleClickDuplicateNode={this.handleClickDuplicateNode}
          handleClickRefresh={this.handleClickRefresh}
          node={node}
          path={path}
        />
      ];

      nodeProps.onSubmit = (node, name) =>
        this.handleSubmitInlineEditable(node, path, name);

      nodeProps.onClickOnTitle = event =>
        this.handleClickNode(event, node, path);

      if (selectedNode && selectedNode.pathname === node.pathname) {
        nodeProps.className = classes.selectedNode;
      }

      return nodeProps;
    };

    return (
      <React.Fragment ref={this.props.innerRef}>
        {this.state.nameDialogNode && (
          <PmbTreeNodeNameDialog
            onClose={this.handleNameDialogClose}
            onSubmit={this.handleNameDialogSubmit}
            node={this.state.nameDialogNode}
            type={this.state.nameDialogType}
          />
        )}
        {this.state.duplicateDialogNode && (
          <PmbTreeNodeNameDialog
            dialogContentText={
              t("caption.enter.label.the.copy.of") +
              " " +
              this.state.duplicateDialogNode.name
            }
            dialogTitle={
              isFile(this.state.duplicateDialogNode)
                ? t("caption.duplicate.file")
                : t("caption.duplicate.folder")
            }
            node={this.state.duplicateDialogNode}
            onClose={this.handleDuplicateDialogClose}
            onSubmit={this.handleDuplicateDialogSubmit}
            value={this.state.duplicateDialogNode.name || ""}
          />
        )}
        <PmbDeleteDialog
          onClose={this.handleDeleteDialogClose}
          onSubmit={this.handleDeleteDialogDelete}
          node={this.state.deleteDialogNode}
        />
        <PmbDeleteDialog
          onClose={this.handleDeleteChildrenDialogClose}
          onSubmit={this.handleDeleteChildrenDialogDelete}
          node={this.state.deleteChildrenDialogNode}
          dialogContentText={t(
            "caption.delete.entire.content.of.folder"
          )}
          icon={<AnyFileTypeIcon />}
          label={t("caption.delete.content.of.folder")}
          type={t("caption.files.and.folders")}
        />
        {this.state.filesToUpload.length ? (
          <PmbDropzoneTableDialog
            onCancel={this.handleCancelUploadFiles}
            onChangeTargetParent={this.handleChangeTargetParent}
            onClose={this.handleCloseUploadFiles}
            onConfirm={this.handleClickUploadFiles}
            open={this.state.uploadFilesDialogOpen}
            data={this.state.filesToUpload}
            uploaded={this.state.uploaded}
            targetParent={this.state.uploadFilesToTargetParent}
          />
        ) : null}
        <div className={classes.tree}>
          <SortableTree
            generateNodeProps={generateNodeProps}
            getNodeKey={getNodeKey}
            nodeContentRenderer={PmbNodeRendererDefault}
            onChange={this.handleChangeNode}
            onMoveNode={this.handleMoveNode}
            onVisibilityToggle={this.handleToggleVisibility}
            treeData={this.state.boxTree}
          />
        </div>
      </React.Fragment>
    );
  }
}

PmbTree.propTypes = {
  boxTree: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
      pathname: PropTypes.string,
      children: PropTypes.array,
      type: PropTypes.string
    })
  ),
  classes: PropTypes.object.isRequired,
  onSelectNode: PropTypes.func,
  onRefresh: PropTypes.func,
  selectedNode: PropTypes.object,
  socket: PropTypes.object,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default compose(
  connect(
    mapStateToProps,
    actionCreators
  ),
  withRouter,
  withTranslation(["editor"]),
  withStyles(styles)
)(PmbTree);
