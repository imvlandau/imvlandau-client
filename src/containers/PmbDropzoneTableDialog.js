import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import FileUploadIcon from "@material-ui/icons/CloudUpload";
import ClearIcon from "@material-ui/icons/Clear";
import PmbDropzoneDialogInput from "../components/PmbDropzoneDialogInput";
import { initialState } from "../views/editor";
import {
  formatBytes,
  isDirectory,
  findById,
  generatePathByPathname,
  getNodeKey,
  getPreferredEntrypoint
} from "../helpers/utils";
import { walk as walkTree } from "react-sortable-tree";
import LinearProgress from "@material-ui/core/LinearProgress";
import green from "@material-ui/core/colors/green";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "label.filename"
  },
  { id: "size", numeric: true, disablePadding: true, label: "label.size" },
  { id: "path", numeric: false, disablePadding: false, label: "label.path" },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "label.mime.type"
  }
];

function PmbDropzoneTableDialogHead({
  numSelected,
  onSelectAllClick,
  order,
  orderBy,
  onRequestSort,
  rowCount
}) {
  const { t } = useTranslation();
  const createSortHandler = property => event => {
    onRequestSort && onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={numSelected === rowCount}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "Select all files" }}
          />
        </TableCell>
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? "right" : "inherit"}
            padding={row.disablePadding ? "none" : "default"}
            sortDirection={orderBy === row.id ? order : false}
          >
            <Tooltip
              enterDelay={300}
              placement={row.numeric ? "bottom-end" : "bottom-start"}
              title="Sort"
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
                onClick={createSortHandler(row.id)}
              >
                {t(`${row.label}`)}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

PmbDropzoneTableDialogHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
}));

function PmbDropzoneTableDialogToolbar({ numSelected, onUpload }) {
  const classes = useToolbarStyles();
  const { t } = useTranslation();

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} {t("caption.selected")}
          </Typography>
        ) : (
          <Typography id="upload-checked-table-title" variant="subtitle1">
            {t("subheading.check.and.confirm")}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Upload">
            <IconButton aria-label="Upload" onClick={onUpload}>
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
    </Toolbar>
  );
}

PmbDropzoneTableDialogToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onUpload: PropTypes.func
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: "auto"
  },
  progressBar: {
    marginTop: theme.spacing(1)
  },
  progressBarSuccess: {
    backgroundColor: green[500]
  }
}));

function PmbDropzoneTableDialog({
  boxTree,
  data = [],
  onCancel,
  onChangeTargetParent,
  onClose,
  onConfirm,
  open,
  targetParent = null,
  uploaded,
  uploadPreferredEntrypoints
}) {
  const classes = useStyles();
  const { t } = useTranslation(["editor"]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("path");
  const [selected, setSelected] = React.useState(getSelected(data));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(
    data.length > rowsPerPage ? true : false
  );
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  let todo = selected;
  let done = [];
  for (let file of data) {
    if (isMaxSizeExceeded(file.size) || fileuploadDone(file)) {
      let pos = selected.indexOf(file.path);
      if (pos !== -1) {
        todo.splice(pos, 1);
      }
      if (fileuploadDone(file)) {
        done.push(file.path);
      }
    }
  }

  let boxTreeFlat = [];
  walkTree({
    treeData: boxTree,
    getNodeKey,
    ignoreCollapsed: false,
    callback: nodeInfo => {
      isDirectory(nodeInfo.node) && boxTreeFlat.push(nodeInfo.node);
    }
  });

  const preferredUploadpoint = handleGetPreferredUploadpoint(boxTreeFlat);

  function isSelected(id) {
    return selected.indexOf(id) !== -1;
  }

  function getSelected(data = []) {
    let selected = [];
    for (let file of data) {
      if (!isMaxSizeExceeded(file.size)) {
        selected.push(file.path);
      }
    }
    return selected;
  }

  function isMaxSizeExceeded(size) {
    return size > initialState.uploadMaxFileSize;
  }

  function handleConfirm(preferredUploadpoint) {
    onConfirm &&
      onConfirm(
        preferredUploadpoint,
        data.filter(file => {
          return selected.includes(file.path) && !fileuploadDone(file);
        })
      );
  }

  function fileuploadDone(file) {
    return uploaded[file.uid].loaded === uploaded[file.uid].total;
  }

  function handleCancel() {
    handleClose();
    onCancel && onCancel();
  }

  function handleClose() {
    setSelected([]);
    onClose && onClose();
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      let newSelected = [];
      let notSelectable = [];
      let notYetFilledUp = true;
      for (let n in data) {
        if (!isMaxSizeExceeded(data[n].size) && !fileuploadDone(data[n])) {
          newSelected.push(data[n].path);
        } else {
          notSelectable.push(data[n].path);
        }
      }
      for (let path of newSelected) {
        if (selected.indexOf(path) === -1) {
          notYetFilledUp = true;
        } else {
          notYetFilledUp = false;
        }
      }
      if (notYetFilledUp) {
        setSelected(newSelected);
      } else {
        setSelected([]);
      }
      return;
    }
    setSelected([]);
  }

  function handleClick(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  }

  function handleSetTargetParent(targetParent) {
    onChangeTargetParent && onChangeTargetParent(targetParent);
  }

  function handleGetPreferredUploadpoint(boxTreeFlat = []) {
    let nodeData =
      targetParent &&
      boxTreeFlat.find(node => {
        return node.pathname === targetParent.pathname;
      });
    let uploadPreferredEntrypoint = uploadPreferredEntrypoints.filter(
      pathname => {
        return boxTreeFlat.find(node => {
          return node.pathname === targetParent.pathname;
        });
      }
    );
    let root = boxTreeFlat[0];
    return nodeData || uploadPreferredEntrypoint[0] || root;
  }

  function handleChangePage(event, page) {
    setPage(page);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
  }

  return (
    <Dialog
      aria-labelledby="upload-checked-dialog-title"
      disableEscapeKeyDown
      fullWidth={true}
      maxWidth="lg"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle id="upload-checked-dialog-title">
        {t("heading.file.upload")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          {t("subheading.upload.these.files")}
        </DialogContentText>
        <PmbDropzoneDialogInput
          onSubmit={handleSetTargetParent}
          suggestions={boxTreeFlat}
          suggestion={preferredUploadpoint}
          suggestionsInputValue={
            preferredUploadpoint && preferredUploadpoint.pathname
          }
        />
        {data.filter(n => isMaxSizeExceeded(n.size)).length ? (
          <Typography color="error" paragraph gutterBottom>
            {t("subheading.maximum.upload.size.exceeded")}{" "}
            <Typography color="inherit" variant="caption">
              {t("caption.maximum.upload.size") +
                formatBytes(initialState.uploadMaxFileSize)}
            </Typography>
          </Typography>
        ) : null}
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <PmbDropzoneTableDialogToolbar
              numSelected={todo.length}
              onUpload={() =>
                preferredUploadpoint && handleConfirm(preferredUploadpoint)
              }
            />
            <div className={classes.tableWrapper}>
              <Table
                aria-labelledby="upload-checked-table-title"
                className={classes.table}
              >
                <PmbDropzoneTableDialogHead
                  numSelected={todo.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  order={order}
                  orderBy={orderBy}
                  rowCount={data.length}
                />
                <TableBody>
                  {stableSort(data, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n, index) => {
                      const isItemSelected =
                        isSelected(n.path) && !fileuploadDone(n);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          aria-checked={isItemSelected}
                          hover
                          key={index}
                          onClick={event =>
                            !isMaxSizeExceeded(n.size) &&
                            handleClick(event, n.path)
                          }
                          role="checkbox"
                          selected={isItemSelected}
                          tabIndex={-1}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {n.name}
                            <LinearProgress
                              className={clsx(classes.progressBar)}
                              classes={{
                                barColorPrimary:
                                  fileuploadDone(n) &&
                                  classes.progressBarSuccess
                              }}
                              variant="determinate"
                              value={
                                (uploaded[n.uid].loaded /
                                  uploaded[n.uid].total) *
                                100
                              }
                            />
                          </TableCell>
                          <TableCell align="right" padding="none">
                            {isMaxSizeExceeded(n.size) && (
                              <Tooltip
                                enterDelay={300}
                                title={t("caption.maximum.upload.size.exceeded")}
                              >
                                <Typography color="error">
                                  {formatBytes(n.size)}
                                </Typography>
                              </Tooltip>
                            )}
                            {!isMaxSizeExceeded(n.size) && (
                              <Typography>{formatBytes(n.size)}</Typography>
                            )}
                          </TableCell>
                          <TableCell>{n.path}</TableCell>
                          <TableCell>{n.type}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              backIconButtonProps={{
                "aria-label": "Previous Page"
              }}
              component="div"
              count={data.length}
              nextIconButtonProps={{
                "aria-label": "Next Page"
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
          </Paper>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleCancel}>
          {t("button.cancel")}
        </Button>
        {preferredUploadpoint && (
          <Button
            color="primary"
            onClick={() =>
              done.length === data.length
                ? handleClose()
                : handleConfirm(preferredUploadpoint)
            }
          >
            {t(done.length === data.length ? "button.done" : "button.upload.checked")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

PmbDropzoneTableDialog.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onCancel: PropTypes.func,
  onChangeTargetParent: PropTypes.func,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onRemove: PropTypes.func,
  open: PropTypes.bool,
  targetParent: PropTypes.object,
  uploaded: PropTypes.object
};

const mapStateToProps = state => {
  return {
    boxTree: state.editor.boxTree,
    uploadPreferredEntrypoints: state.editor.uploadPreferredEntrypoints
  };
};

export default connect(mapStateToProps)(PmbDropzoneTableDialog);
