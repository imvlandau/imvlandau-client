import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import PmbMonacoCodeEditor from "../components/PmbMonacoCodeEditor";
import PmbOverlay from "../components/PmbOverlay";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    height: "100%"
  }
}));

function PmbCodeEditor({
  defaultValue,
  fetchingContent,
  name,
  onChange,
  onSubmit,
  options = {
    model: null,
    selectOnLineNumbers: true,
    roundedSelection: false,
    automaticLayout: true,
    hover: {
      enabled: true
    },
    renderLineHighlight: "gutter",
    theme: "vs",
    language: null,
    scrollbar: {
      // Subtle shadows to the left & top. Defaults to true.
      useShadows: false,

      // Render vertical arrows. Defaults to false.
      verticalHasArrows: true,
      // Render horizontal arrows. Defaults to false.
      horizontalHasArrows: true,

      // Render vertical scrollbar.
      // Accepted values: 'auto', 'visible', 'hidden'.
      // Defaults to 'auto'
      vertical: "visible",
      // Render horizontal scrollbar.
      // Accepted values: 'auto', 'visible', 'hidden'.
      // Defaults to 'auto'
      horizontal: "visible",

      verticalScrollbarSize: 17,
      horizontalScrollbarSize: 17,
      arrowSize: 30
    }
  },
  triggeredFromOutside,
  uri,
  value
}) {
  const classes = useStyles();
  const { t } = useTranslation(["editor"]);

  return (
    <div className={classes.root}>
      {fetchingContent ? (
        <PmbOverlay
          position="absolute"
          size={34}
          title={t("caption.fetching.content")}
          variant="h5"
        />
      ) : (
        <PmbMonacoCodeEditor
          defaultValue={defaultValue}
          height="100%"
          language={options.language}
          name={name}
          onChange={onChange}
          onSubmit={onSubmit}
          options={options}
          theme={options.theme}
          triggeredFromOutside={triggeredFromOutside}
          uri={uri}
          value={value}
          width="100%"
        />
      )}
    </div>
  );
}

PmbCodeEditor.propTypes = {
  defaultValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  options: PropTypes.object,
  triggeredFromOutside: PropTypes.bool,
  uri: PropTypes.object.isRequired,
  value: PropTypes.string
};

const mapStateToProps = (state, props) => {
  return { fetchingContent: state.editor.fetchingContent };
};

export default connect(mapStateToProps)(PmbCodeEditor);
