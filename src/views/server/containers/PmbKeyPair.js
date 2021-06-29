/* eslint-disable no-use-before-define */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import GetAppIcon from "@material-ui/icons/GetApp";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: theme.spacing(2)
  },
  loader: {
    marginRight: theme.spacing(1)
  },
  selectField: {
    marginBottom: theme.spacing(1)
  },
  textField: {
    marginBottom: theme.spacing(1),
    "& span": {
      display: "block",
      marginBottom: theme.spacing(1)
    }
  },
  formLabel: {
    marginBottom: theme.spacing(1)
  },
  button: {
    marginBottom: theme.spacing(2)
  }
}));

function PmbKeyPair({
  processingKeyPairs,
  checkedKeyPairOwner,
  checkedWithoutKeyPair,
  keyPairs: keyPairsProps = [],
  notifications,
  onChangeSelect,
  onChangeValue,
  onCreate,
  selected: selectedProps = null,
  setCheckedKeyPairOwner,
  setCheckedWithoutKeyPair,
  value: valueProps = "",
  ...props
}) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["server"]);
  const didMountRef = React.useRef(false);
  const [keyPairs, setKeyPairs] = React.useState(keyPairsProps);
  const [selected, setSelected] = React.useState(selectedProps);
  const [value, setValue] = React.useState(valueProps);
  const errorsInValueField = notifications.filter(notification => {
    return notification.key.indexOf("key_pair.name") > -1;
  });
  const errorsInKeyPairAgreement = notifications.filter(
    notification => notification.key.indexOf("key_pair.agreement") > -1
  );

  const handleChangeSelect = event => {
    event.preventDefault();
    let found = keyPairs.find(item => item.id === event.target.value);
    setSelected(found || null);
    onChangeSelect && onChangeSelect(found || null);
  };

  const handleChangeValue = event => {
    event.preventDefault();
    setValue(event.target.value);
    onChangeValue && onChangeValue();
  };

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      didMountRef.current = true;
    } else {
      // updated
      setCheckedKeyPairOwner && setCheckedKeyPairOwner(checkedKeyPairOwner);
      setCheckedWithoutKeyPair &&
        setCheckedWithoutKeyPair(checkedWithoutKeyPair);
      setKeyPairs(keyPairsProps);
      setSelected(selectedProps);
      setValue(valueProps);
    }
  }, [
    checkedKeyPairOwner,
    checkedWithoutKeyPair,
    keyPairsProps,
    selectedProps,
    valueProps
  ]);

  return processingKeyPairs ? (
    <div className={classes.loaderContainer}>
      <CircularProgress className={classes.loader} color="secondary" />
      <Typography component="h6">{t("caption.processing.key.pairs")}</Typography>
    </div>
  ) : (
    <React.Fragment>
      <FormControl fullWidth variant="filled" className={classes.selectField}>
        <InputLabel id="pmb-key-pair-select-field-label">
          {t("label.select.key.pair")}
        </InputLabel>
        <Select
          labelId="pmb-key-pair-select-field-label"
          id="pmb-key-pair-select-field"
          value={(selected && selected.id) || ""}
          onChange={handleChangeSelect}
        >
          <MenuItem value="">
            <em>{t("caption.nothing.selected")}</em>
          </MenuItem>
          {keyPairs.map((keyPair, index) => (
            <MenuItem key={index} value={keyPair.id}>
              {keyPair.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        error={Boolean(errorsInValueField.length)}
        className={classes.textField}
        label={t("label.enter.key.pair.name")}
        placeholder={t("placeholder.enter.key.pair.name")}
        fullWidth
        value={value}
        onChange={handleChangeValue}
        helperText={
          errorsInValueField.length
            ? errorsInValueField.map((notification, index) => (
                <span key={index}>- {notification.message}</span>
              ))
            : null
        }
        variant="filled"
      />
      {!processingKeyPairs ? (
        <Button
          variant="outlined"
          color="secondary"
          className={classes.button}
          disabled={!value}
          fullWidth
          onClick={() => onCreate && onCreate(value)}
          size="large"
          startIcon={<GetAppIcon />}
        >
          {t("button.create.and.download.key.pair")}
        </Button>
      ) : null}
      {selected ? (
        <FormControl error={Boolean(errorsInKeyPairAgreement.length)}>
          <FormLabel className={classes.formLabel} component="legend">
            {t("label.keypair.acknowledgment")}
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedKeyPairOwner}
                  onChange={event =>
                    setCheckedKeyPairOwner &&
                    setCheckedKeyPairOwner(event.target.checked)
                  }
                  value={false}
                  color="secondary"
                />
              }
              label={
                <Typography variant="caption">
                  {selected &&
                    t("caption.keypair.acknowledgment", {
                      filename: selected && selected.name + ".pem"
                    })}
                </Typography>
              }
            />
          </FormGroup>
          <FormHelperText>
            {errorsInKeyPairAgreement.length
              ? errorsInKeyPairAgreement.map((notification, index) => (
                  <span key={index}>- {notification.message}</span>
                ))
              : null}
          </FormHelperText>
        </FormControl>
      ) : (
        <FormControl error={Boolean(errorsInKeyPairAgreement.length)}>
          <FormLabel className={classes.formLabel} component="legend">
            {t("label.keypair.acknowledgment")}
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedWithoutKeyPair}
                  onChange={event =>
                    setCheckedWithoutKeyPair &&
                    setCheckedWithoutKeyPair(event.target.checked)
                  }
                  value={false}
                  color="secondary"
                />
              }
              label={
                <Typography variant="caption">
                  {t("caption.access.acknowledgment")}
                </Typography>
              }
            />
          </FormGroup>
          <FormHelperText>
            {errorsInKeyPairAgreement
              ? errorsInKeyPairAgreement.map((notification, index) => (
                  <span key={index}>- {notification.message}</span>
                ))
              : null}
          </FormHelperText>
        </FormControl>
      )}
    </React.Fragment>
  );
}

PmbKeyPair.propTypes = {
  checkedKeyPairOwner: PropTypes.bool,
  checkedWithoutKeyPair: PropTypes.bool,
  keyPairs: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeSelect: PropTypes.func,
  onChangeValue: PropTypes.func,
  onCreate: PropTypes.func,
  selected: PropTypes.object,
  setCheckedKeyPairOwner: PropTypes.func,
  setCheckedWithoutKeyPair: PropTypes.func,
  value: PropTypes.string
};

const mapStateToProps = (state, ownProps) => ({
  processingKeyPairs: state.server.processingKeyPairs,
  notifications: state.toastr.notifications
});

export default connect(mapStateToProps)(PmbKeyPair);
