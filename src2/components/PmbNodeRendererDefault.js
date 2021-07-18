import React from "react";
import PropTypes from "prop-types";
import { isDescendant } from "react-sortable-tree";
import clsx from "clsx";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FolderIcon from "@material-ui/icons/Folder";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import EditIcon from "@material-ui/icons/Edit";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import { isFile, isDirectory } from "../helpers/utils";

const useStyles = makeStyles(theme => ({
  "@global": {
    ".rst__moveHandle": {
      borderRadius: 0,
      boxShadow: "none"
    },
    ".rst__rowContents": {
      borderRadius: 0,
      boxShadow: "none",
      cursor: "pointer"
    }
  },
  checkbox: {
    height: "42px",
    width: "42px"
  },
  rowLabel: {
    display: "flex",
    alignItems: "center"
  },
  iconButton: {
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(1 / 2)
  },
  fileIcon: {
    color: theme.palette.primary.main
  },
  renameIconButton: {
    marginLeft: theme.spacing(2)
  }
}));

function PmbNodeRendererDefault({
  buttons = [],
  canDrag = false,
  canDrop = false,
  className = "",
  connectDragPreview,
  connectDragSource,
  didDrop,
  draggedNode = null,
  hasCheckbox = false,
  hasLink = false,
  isDragging,
  isOver, // Not needed, but preserved for other renderers
  isSearchFocus = false,
  isSearchMatch = false,
  node,
  onClickOnTitle,
  onSubmit,
  onSetVisibility,
  onSubmitLink,
  onToggleCheckbox,
  parentNode = null, // Needed for dndManager
  path,
  rowDirection = "ltr",
  scaffoldBlockPxWidth,
  style = {},
  subtitle = null,
  title = null,
  toggleChildrenVisibility = null,
  treeId,
  treeIndex,
  ...otherProps
}) {
  const classes = useStyles();
  const [renameMode, setRenameMode] = React.useState(true);
  const nodeTitle = title || node.title || node.name;
  const nodeSubtitle = subtitle || node.subtitle;
  const rowDirectionClass = rowDirection === "rtl" ? "rst__rtl" : null;

  let handle;
  if (canDrag) {
    if (typeof node.children === "function" && node.expanded) {
      // Show a loading symbol on the handle when the children are expanded
      //  and yet still defined by a function (a callback to fetch the children)
      handle = (
        <div className="rst__loadingHandle">
          <div className="rst__loadingCircle">
            {[...new Array(12)].map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={clsx("rst__loadingCirclePoint", rowDirectionClass)}
              />
            ))}
          </div>
        </div>
      );
    } else {
      // Show the handle used to initiate a drag-and-drop
      handle = connectDragSource(<div className="rst__moveHandle" />, {
        dropEffect: "copy"
      });
    }
  }

  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
  const isLandingPadActive = !didDrop && isDragging;

  let buttonStyle = { left: -0.5 * scaffoldBlockPxWidth };
  if (rowDirection === "rtl") {
    buttonStyle = { right: -0.5 * scaffoldBlockPxWidth };
  }

  function activateRenameMode() {
    setRenameMode(false);
  }

  function handleSubmit(node, e) {
    onSubmit && onSubmit(node, e.target.value);
    closeInlineEditable();
  }

  function handleClickOnTitle(e, node, path) {
    // usage of currentTarget here is a solution to prevent following console error:
    // Uncaught TypeError: event.target.className.includes is not a function
    onClickOnTitle && onClickOnTitle({ target: e.currentTarget }, node, path);
  }

  function closeInlineEditable() {
    setRenameMode(true);
  }

  return (
    <div style={{ height: "100%" }} {...otherProps}>
      {toggleChildrenVisibility && isDirectory(node) && (
        <div>
          <button
            type="button"
            aria-label={node.expanded ? "Collapse" : "Expand"}
            className={clsx(
              node.expanded ? "rst__collapseButton" : "rst__expandButton",
              rowDirectionClass
            )}
            style={buttonStyle}
            onClick={() =>
              toggleChildrenVisibility({
                node,
                path,
                treeIndex
              })
            }
          />

          {node.expanded &&
          node.children &&
          node.children.length &&
          !isDragging ? (
            <div
              style={{ width: scaffoldBlockPxWidth }}
              className={clsx("rst__lineChildren", rowDirectionClass)}
            />
          ) : null}
        </div>
      )}

      <div className={clsx("rst__rowWrapper", rowDirectionClass)}>
        {/* Set the row preview to be used during drag and drop */}
        {connectDragPreview(
          <div
            className={clsx(
              "rst__row",
              isLandingPadActive && "rst__rowLandingPad",
              isLandingPadActive && !canDrop && "rst__rowCancelPad",
              isSearchMatch && "rst__rowSearchMatch",
              isSearchFocus && "rst__rowSearchFocus",
              rowDirectionClass,
              className
            )}
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1,
              ...style
            }}
          >
            {hasCheckbox && (
              <Checkbox
                checked={node.checked}
                className={classes.checkbox}
                color="primary"
                onChange={e => {
                  e.stopPropagation();
                  onToggleCheckbox && onToggleCheckbox(node, e);
                }}
              />
            )}

            {handle}

            <div
              className={clsx(
                "rst__rowContents",
                !canDrag && "rst__rowContentsDragDisabled",
                rowDirectionClass
              )}
            >
              <div
                className={clsx(
                  "rst__rowLabel",
                  rowDirectionClass,
                  classes.rowLabel
                )}
                onClick={e => {
                  e.stopPropagation();
                  handleClickOnTitle(e, node, path);
                }}
              >
                {!renameMode ? (
                  <Input
                    placeholder="Placeholder"
                    autoFocus
                    inputProps={{
                      "aria-label": "Name of node"
                    }}
                    defaultValue={
                      typeof nodeTitle === "function"
                        ? nodeTitle({
                            node,
                            path,
                            treeIndex
                          })
                        : nodeTitle
                    }
                    onBlur={e => {
                      e.stopPropagation();
                      handleSubmit(node, e);
                    }}
                    onKeyDown={e => {
                      e.stopPropagation();
                      if (e.which === 27 || e.keyCode === 27) {
                        // on press escape key
                        closeInlineEditable();
                      }
                    }}
                    onKeyPress={e => {
                      e.stopPropagation();
                      if (e.which === 13 || e.keyCode === 13) {
                        // on press return key
                        handleSubmit(node, e);
                      }
                    }}
                    type="text"
                  />
                ) : (
                  <React.Fragment>
                    {isDirectory(node) && (
                      <IconButton
                        aria-label="File system type"
                        className={classes.iconButton}
                      >
                        <FolderIcon />
                      </IconButton>
                    )}
                    {isFile(node) && (
                      <IconButton
                        aria-label="File system type"
                        className={classes.iconButton}
                      >
                        <FileIcon classes={{ root: classes.fileIcon }} />
                      </IconButton>
                    )}
                    <Typography color="inherit" variant="body1">
                      {typeof nodeTitle === "function"
                        ? nodeTitle({
                            node,
                            path,
                            treeIndex
                          })
                        : nodeTitle}
                    </Typography>
                    <IconButton
                      aria-label="Rename node"
                      className={classes.renameIconButton}
                      onClick={e => {
                        e.stopPropagation();
                        activateRenameMode();
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </React.Fragment>
                )}

                {nodeSubtitle && (
                  <span className="rst__rowSubtitle">
                    {typeof nodeSubtitle === "function"
                      ? nodeSubtitle({
                          node,
                          path,
                          treeIndex
                        })
                      : nodeSubtitle}
                  </span>
                )}
              </div>

              <div className="rst__rowToolbar">
                {buttons.map((btn, index) => (
                  <div
                    key={index} // eslint-disable-line react/no-array-index-key
                    className="rst__toolbarButton"
                  >
                    {btn}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

PmbNodeRendererDefault.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  canDrag: PropTypes.bool,
  canDrop: PropTypes.bool,
  className: PropTypes.string,
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  didDrop: PropTypes.bool.isRequired,
  draggedNode: PropTypes.shape({}),
  hasCheckbox: PropTypes.bool,
  hasLink: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  isSearchFocus: PropTypes.bool,
  isSearchMatch: PropTypes.bool,
  node: PropTypes.shape({}).isRequired,
  onClickOnTitle: PropTypes.func,
  onSubmit: PropTypes.func,
  onSetVisibility: PropTypes.func,
  onSubmitLink: PropTypes.func,
  onToggleCheckbox: PropTypes.func,
  rowDirection: PropTypes.string,
  parentNode: PropTypes.shape({}), // Needed for dndManager
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  subtitle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  toggleChildrenVisibility: PropTypes.func,
  treeId: PropTypes.string.isRequired,
  treeIndex: PropTypes.number.isRequired
};

export default props => <PmbNodeRendererDefault {...props} />;
