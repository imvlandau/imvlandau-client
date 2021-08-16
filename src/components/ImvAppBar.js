import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ImvBrand from "./ImvBrand";
import PmbLanguageDropdown from "./PmbLanguageDropdown";
import PmbProfileMenu from "./PmbProfileMenu";

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: "space-between"
  },
  divider: {
    flexGrow: 1
  }
}));

function ImvAppBar({ showProfileMenu = true}) {
  const classes = useStyles();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <ImvBrand />
          <div className={classes.divider} />
          {showProfileMenu && <PmbProfileMenu />}
          <PmbLanguageDropdown
            languages={[
              { lacc: "de-DE", cca2: "DE", cca3: "DEU" },
              { lacc: "en-US", cca2: "US", cca3: "USA" },
              { lacc: "ar-PS", cca2: "PS", cca3: "PSE" }
            ]}
            defaultLanguage="de-DE"
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

ImvAppBar.propTypes = {
  showProfileMenu: PropTypes.bool
};

export default ImvAppBar;
