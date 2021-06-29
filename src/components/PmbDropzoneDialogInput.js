import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import deburr from "lodash/deburr";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Fab from "@material-ui/core/Fab";
import FolderIcon from "@material-ui/icons/Folder";
import PmbLogo from "./PmbLogo";

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2),
    display: "flex"
  },
  container: {
    position: "relative",
    flexGrow: 1
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  uploadPathButton: {
    marginLeft: theme.spacing(1)
  }
}));

function PmbDropzoneDialogInput({
  suggestions: suggestionsProps,
  suggestion: suggestionProps,
  suggestionsInputValue: suggestionsInputValueProps,
  onSubmit,
  processing
}) {
  const classes = useStyles();
  const { t } = useTranslation(["editor"]);
  const [suggestionsInputValue, setSuggestionsInputValue] = React.useState(
    suggestionsInputValueProps
  );
  const [suggestion, setSuggestion] = React.useState(suggestionProps);
  const [suggestions, setSuggestions] = React.useState([]);

  const renderInputComponent = inputProps => {
    const { classes, inputRef = () => {}, ref, ...otherProps } = inputProps;

    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input
          }
        }}
        {...otherProps}
      />
    );
  };

  const renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion.pathname, query);
    const parts = parse(suggestion.pathname, matches);

    return (
      <MenuItem
        component="div"
        onClick={() => handleClickSuggestion(suggestion)}
        selected={isHighlighted}
      >
        <div>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  };

  const renderSuggestionsContainer = options => {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
  };

  const getSuggestion = suggestion => {
    return suggestion;
  };

  const handleSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    if (method === "enter") {
      setSuggestion(suggestion);
      setSuggestionsInputValue(suggestion.pathname);
      onSubmit && onSubmit(suggestion);
    }
  };

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const shouldRenderSuggestions = suggestion => {
    let isBlank = suggestion === "";
    let matched = getSuggestions(suggestion).length;
    return isBlank || matched;
  };

  const getSuggestions = suggestionsInputValue => {
    const inputValue = deburr(suggestionsInputValue.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : suggestionsProps.filter(suggestion => {
          const keep =
            count < 10 &&
            suggestion.pathname.slice(0, inputLength).toLowerCase() ===
              inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  };

  const handleChange = (event, { newValue }) => {
    setSuggestionsInputValue(newValue);
  };

  const handleClickSuggestion = suggestion => {
    setSuggestion(suggestion);
    setSuggestionsInputValue(suggestion.pathname);
    onSubmit && onSubmit(suggestion);
  };

  const handleClickSubmitButton = () => {
    const closest = getSuggestions(suggestionsInputValue);
    const newSuggestion = closest.length ? closest[0] : suggestion;
    const newSuggestionsInputValue = newSuggestion.pathname;
    setSuggestion(newSuggestion);
    setSuggestionsInputValue(newSuggestionsInputValue);
    onSubmit && onSubmit(newSuggestion);
  };

  const handleSubmit = e => {
    // on press enter/return key
    if (e.which === 13 || e.keyCode === 13) {
      const closest = getSuggestions(suggestionsInputValue);
      const newSuggestion = closest.length ? closest[0] : suggestion;
      const newSuggestionsInputValue = newSuggestion.pathname;
      setSuggestion(newSuggestion);
      setSuggestionsInputValue(newSuggestionsInputValue);
      onSubmit && onSubmit(newSuggestion);
    }
  };

  const autosuggestProps = {
    suggestions: suggestionsProps,
    renderInputComponent: renderInputComponent,
    renderSuggestion: renderSuggestion,
    renderSuggestionsContainer: renderSuggestionsContainer,
    getSuggestionValue: suggestion => suggestion.pathname,
    onSuggestionSelected: handleSuggestionSelected,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    shouldRenderSuggestions: shouldRenderSuggestions
  };

  return (
    <div className={classes.root}>
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          label: t("caption.upload.destination.path"),
          placeholder: t("placeholder.upload.destination.path"),
          value: suggestionsInputValue,
          onChange: handleChange,
          onKeyPress: handleSubmit
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList
        }}
      />
      <Fab
        aria-label="Edit target path for files to upload"
        color="primary"
        className={classes.uploadPathButton}
        disabled={processing}
        onClick={handleClickSubmitButton}
      >
        {processing ? <PmbLogo rotating={true} size={17} /> : <FolderIcon />}
      </Fab>
    </div>
  );
}

PmbDropzoneDialogInput.defaultProps = {
  suggestions: [],
  suggestionsInputValue: "",
  suggestion: null,
  processing: false
};

PmbDropzoneDialogInput.propTypes = {
  suggestionsInputValue: PropTypes.string,
  suggestion: PropTypes.object,
  onSubmit: PropTypes.func,
  processing: PropTypes.bool
};

export default PmbDropzoneDialogInput;
