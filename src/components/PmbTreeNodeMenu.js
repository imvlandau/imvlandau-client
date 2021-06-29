import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CreateNewFileIcon from "@material-ui/icons/InsertDriveFile";
import CreateNewFolderIcon from "@material-ui/icons/Folder";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import RefreshIcon from "@material-ui/icons/Refresh";
import { isDirectory, isFile } from "../helpers/utils";

const useStyles = makeStyles(theme => ({
  fileIcon: {
    fill: theme.palette.primary.main
  }
}));

function PmbTreeNodeMenu({
  handleClickCreateFile,
  handleClickCreateDirectory,
  handleClickDeleteNode,
  handleClickDeleteChildren,
  handleClickDuplicateNode,
  handleClickRefresh,
  node,
  path
}) {
  const classes = useStyles();
  const { t } = useTranslation(["editor"]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const createFileMenuItem = node => {
    return (
      <MenuItem
        key="create-file"
        onClick={e => {
          e.stopPropagation();
          handleClickCreateFile(node);
          handleClose();
        }}
      >
        <ListItemIcon>
          <CreateNewFileIcon className={classes.fileIcon} />
        </ListItemIcon>
        <ListItemText primary={t("label.new.file")} />
      </MenuItem>
    );
  };

  const createFolderMenuItem = node => {
    return (
      <MenuItem
        key="create-folder"
        onClick={e => {
          e.stopPropagation();
          handleClickCreateDirectory(node);
          handleClose();
        }}
      >
        <ListItemIcon>
          <CreateNewFolderIcon />
        </ListItemIcon>
        <ListItemText primary={t("label.new.folder")} />
      </MenuItem>
    );
  };

  const deleteNodeMenuItem = (node, path) => {
    return (
      <MenuItem
        key="delete-node"
        onClick={e => {
          e.stopPropagation();
          handleClickDeleteNode(node, path);
          handleClose();
        }}
      >
        <ListItemIcon>
          <DeleteIcon color="error" />
        </ListItemIcon>
        <ListItemText
          primary={t(
            isFile(node) ? "label.delete.file" : "label.delete.folder"
          )}
        />
      </MenuItem>
    );
  };

  const deleteChildrenMenuItem = (node, path) => {
    return (
      <MenuItem
        key="delete-children"
        onClick={e => {
          e.stopPropagation();
          handleClickDeleteChildren(node, path);
          handleClose();
        }}
      >
        <ListItemIcon>
          <DeleteIcon color="error" />
        </ListItemIcon>
        <ListItemText primary={t(`label.delete.children`)} />
      </MenuItem>
    );
  };

  const duplicateNodeMenuItem = node => (
    <MenuItem
      key="duplicate-node"
      onClick={e => {
        e.stopPropagation();
        handleClickDuplicateNode(node);
        handleClose();
      }}
    >
      <ListItemIcon>
        <FileCopyIcon />
      </ListItemIcon>
      <ListItemText primary={t("label.duplicate")} />
    </MenuItem>
  );

  const refreshMenuItem = node => (
    <MenuItem
      key="refresh-node"
      onClick={e => {
        e.stopPropagation();
        handleClickRefresh(node);
        handleClose();
      }}
    >
      <ListItemIcon>
        <RefreshIcon />
      </ListItemIcon>
      <ListItemText primary={t("label.refresh")} />
    </MenuItem>
  );

  return (
    <React.Fragment>
      <IconButton
        aria-label="Menu of tree node"
        aria-owns={open ? "pmb-tree-node-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="pmb-tree-node-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {isDirectory(node) && createFileMenuItem(node)}
        {isDirectory(node) && createFolderMenuItem(node)}
        {duplicateNodeMenuItem(node)}
        {refreshMenuItem(node)}
        <Divider />
        {deleteNodeMenuItem(node, path)}
        {isDirectory(node) && deleteChildrenMenuItem(node, path)}
      </Menu>
    </React.Fragment>
  );
}

PmbTreeNodeMenu.propTypes = {
  handleClickCreateFile: PropTypes.func,
  handleClickCreateDirectory: PropTypes.func,
  handleClickDeleteNode: PropTypes.func,
  handleClickDeleteChildren: PropTypes.func,
  handleClickDuplicateNode: PropTypes.func,
  handleClickRefresh: PropTypes.func
};

export default PmbTreeNodeMenu;
