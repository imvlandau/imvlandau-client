import React from "react";
import PropTypes from "prop-types";
import PmbMonacoDiffEditor from "../components/PmbMonacoDiffEditor";

function PmbDiffEditor({
  externalValue,
  localValue,
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
    originalEditable: true,
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
  uri
}) {
  return (
    <PmbMonacoDiffEditor
      externalValue={externalValue}
      height="100%"
      language={options.language}
      localValue={localValue}
      name={name}
      onChange={onChange}
      onSubmit={onSubmit}
      options={options}
      theme={options.theme}
      triggeredFromOutside={triggeredFromOutside}
      uri={uri}
      width="100%"
    />
  );
}

PmbDiffEditor.propTypes = {
  externalValue: PropTypes.string,
  localValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  options: PropTypes.object,
  triggeredFromOutside: PropTypes.bool,
  uri: PropTypes.object.isRequired
};

export default PmbDiffEditor;
