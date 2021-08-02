import React from "react";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import PmbBrand from "./PmbBrand";

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: "space-between"
  },
  divider: {
    flexGrow: 1
  }
}));

function PmbNavBar() {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <PmbBrand />
        <div className={classes.divider} />
      </Toolbar>
    </AppBar>
  );
}

PmbNavBar.propTypes = {
};

export default PmbNavBar;
