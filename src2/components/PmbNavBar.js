import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import PmbBrand from "./PmbBrand";
import PmbNewButton from "./PmbNewButton";
import PmbLanguageDropdown from "./PmbLanguageDropdown";
import PmbLoginButton from "./PmbLoginButton";
import PmbProfileMenu from "./PmbProfileMenu";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  toolbar: {
    justifyContent: "space-between"
  },
  divider: {
    flexGrow: 1
  }
}));

function PmbNavBar({ showNewButtons = true, showProfileMenu = true }) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <PmbBrand />
        {showNewButtons && (
          <Hidden xsDown>
            <PmbNewButton
              label={t("button.label.create.react.app")}
              title={t("button.title.create.react.app")}
              href="/edit/create-react-app"
            />
          </Hidden>
        )}
        {showNewButtons && (
          <Hidden xsDown>
            <PmbNewButton
              label={t("button.label.create.blank.app")}
              title={t("button.title.create.blank.app")}
              href="/new/blank-app"
            />
          </Hidden>
        )}
        <div className={classes.divider} />
        {showProfileMenu && <PmbProfileMenu />}
        <PmbLanguageDropdown
          languages={[
            { lacc: "en-US", cca2: "US", cca3: "USA" },
            { lacc: "de-DE", cca2: "DE", cca3: "DEU" },
            { lacc: "ar-PS", cca2: "PS", cca3: "PSE" }
          ]}
        />
      </Toolbar>
    </AppBar>
  );
}

PmbNavBar.propTypes = {
  showNewButtons: PropTypes.bool,
  showProfileMenu: PropTypes.bool
};

export default PmbNavBar;
