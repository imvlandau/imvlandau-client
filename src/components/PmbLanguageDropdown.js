import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import countries from "world-countries/countries.json";
import PmbFlag from "./PmbFlag";
import http from "../services/http";

const useStyles = makeStyles(theme => ({
  buttonIcon: {
    width: "1.2rem",
    height: "1.2rem"
  },
  selectedFlag: {
    marginRight: theme.spacing(1 / 2)
  }
}));

function PmbLanguageDropdown({
  languages = [{ lacc: "en-US", cca2: "US", cca3: "USA" }],
  label = "label.change.language",
  defaultLanguage = "en-US"
}) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const filteredLanguages = getFilteredLanguages();
  const [selected, setSelected] = React.useState(getSelected());

  function getFilteredLanguages() {
    return countries.filter(language => {
      return languages.filter(lang => {
        let found = lang.cca3 === language.cca3;
        if (found) {
          language.lacc = lang.lacc;
        }
        return found;
      }).length;
    });
  }

  function getSelected() {
    return (
      filteredLanguages.find(language =>
        isLaccInLanguage(i18n.language, language)
      ) || filteredLanguages.find(language => language.lacc === defaultLanguage)
    );
  }

  function isLaccInLanguage(lacc, language) {
    return language.lacc.indexOf(lacc) !== -1;
  }

  function handleOpen(event) {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  }

  function handleChooseLanguage(country) {
    setOpen(false);
    setSelected(country);
    if (!i18n.hasResourceBundle(country.lacc, "common")) {
      i18n.loadLanguages(country.lacc, () => {
        i18n.changeLanguage(country.lacc, () => {
          http.setAcceptLanguage(country.lacc);
        });
      });
    } else {
      i18n.changeLanguage(country.lacc, () => {
        http.setAcceptLanguage(country.lacc);
      });
    }
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Button
        aria-haspopup="true"
        aria-owns={open ? "choose-language-menu" : null}
        sx={{ fontWeight: "light", fontStyle: "italic", mr: 1 }}
        color="inherit"
        onClick={handleOpen}
        title={t(label)}
      >
        <PmbFlag
          alt={`Flag of ${selected.cca3}`}
          className={classes.selectedFlag}
          format="png"
          name={selected.cca3}
          pngSize={16}
          shiny={true}
        />
        {selected.cca2}
        <ArrowDropDownIcon className={classes.buttonIcon} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="choose-language-menu"
        onClose={handleClose}
        open={open}
      >
        {filteredLanguages.map(language => (
          <MenuItem
            disabled={language.lacc === selected.lacc}
            key={language.lacc}
            onClick={event => handleChooseLanguage(language)}
            selected={language.lacc === selected.lacc}
          >
            <ListItemIcon>
              <PmbFlag
                alt={`Flag of ${language.name.common}`}
                format="png"
                name={language.cca3}
                pngSize={32}
                shiny={true}
              />
            </ListItemIcon>
            <ListItemText
              primary={`${language.name.common} (${language.cca2})`}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

PmbLanguageDropdown.propTypes = {
  languages: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  defaultLanguage: PropTypes.string
};

export default PmbLanguageDropdown;
