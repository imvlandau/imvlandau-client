import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import PropTypes from "prop-types";
import React from "react";

class PmbMonacoDiffEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorStates: new Map()
    };
    this.containerElement = undefined;
  }

  componentDidMount = () => {
    const {
      editorDidMount,
      externalValue,
      onChange,
      onSubmit,
      options,
      theme
    } = this.props;

    if (this.containerElement) {
      this.editor = monaco.editor.createDiffEditor(
        this.containerElement,
        options
      );

      theme && monaco.editor.setTheme(theme);

      this.initModel();

      // After initializing monaco editor
      editorDidMount && editorDidMount(this.editor, monaco);

      this.editor.onDidUpdateDiff(() => {
        const value = this.editor.getModel().modified.getValue();
        onChange && onChange(value, this.props.triggeredFromOutside, event);
      });

      // Explanation:
      // Press F1 (Alt-F1 in IE) => the action will appear and run if it is enabled
      // Press Ctrl-F10 => the action will run if it is enabled
      // Press Chord Ctrl-K, Ctrl-M => the action will run if it is enabled
      this.editor.addAction({
        // An unique identifier of the contributed action.
        id: "pmb-on-submit",
        // A label of the action that will be presented to the user.
        label: "Submit changes",
        // An optional array of keybindings for the action.
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
        // A precondition for this action.
        precondition: null,
        // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
        keybindingContext: null,
        contextMenuGroupId: "navigation",
        contextMenuOrder: 1.5,
        // Method that will be executed when the action is triggered.
        // @param editor The editor instance is passed in as a convinience
        run: function(editor) {
          onSubmit && onSubmit(editor.getValue());
          return null;
        }
      });
    }
  };

  initModel = () => {
    const { externalValue, language: languageProps, name, uri } = this.props;
    const localValue =
      this.props.localValue !== null
        ? this.props.localValue
        : this.props.defaultValue;

    let originalModel = monaco.editor
      .getModels()
      .find(
        model => model.uri.query === uri.query + "&diff=true&model=original"
      );
    let modifiedModel = monaco.editor
      .getModels()
      .find(
        model => model.uri.query === uri.query + "&diff=true&model=modified"
      );

    if (!originalModel || !modifiedModel) {
      const ext = this.extractExtension(uri.query);
      const supportedLanguage =
        this.findSupportedLanguageByExtension(ext[0]) ||
        this.findSupportedLanguageByFilename(name);
      const language = supportedLanguage && supportedLanguage.id;
      originalModel = monaco.editor.createModel(
        localValue,
        languageProps || language,
        new monaco.Uri({
          ...uri,
          query: uri.query + "&diff=true&model=original"
        })
      );
      modifiedModel = monaco.editor.createModel(
        externalValue,
        languageProps || language,
        new monaco.Uri({
          ...uri,
          query: uri.query + "&diff=true&model=modified"
        })
      );
      originalModel.updateOptions({
        tabSize: 2,
        insertSpaces: true
      });
      modifiedModel.updateOptions({
        tabSize: 2,
        insertSpaces: true
      });
    } else if (localValue !== originalModel.getValue()) {
      originalModel.pushEditOperations(
        [],
        [
          {
            range: originalModel.getFullModelRange(),
            text: localValue
          }
        ]
      );
    } else if (externalValue !== modifiedModel.getValue()) {
      modifiedModel.pushEditOperations(
        [],
        [
          {
            range: modifiedModel.getFullModelRange(),
            text: externalValue
          }
        ]
      );
    }

    this.editor.setModel({
      original: originalModel,
      modified: modifiedModel
    });

    // Restore the editor state for the file
    const editorState = this.state.editorStates.get(uri.query);
    editorState && this.editor.restoreViewState(editorState);
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      this.props.uri.query !== nextProps.uri.query ||
      this.props.localValue !== nextProps.localValue ||
      this.props.externalValue !== nextProps.externalValue
    );
  };

  componentDidUpdate = (prevProps, prevState) => {
    const {
      height,
      options,
      theme,
      triggeredFromOutside,
      uri,
      width
    } = this.props;

    if (uri.query !== prevProps.uri.query) {
      this.setState({
        editorStates: this.state.editorStates.set(
          prevProps.uri.query,
          this.editor.saveViewState()
        )
      });
      this.initModel();
    } else if (
      (triggeredFromOutside &&
        prevProps.externalValue !== this.props.externalValue) ||
      (!triggeredFromOutside && prevProps.localValue !== this.props.localValue)
    ) {
      if (prevProps.localValue !== this.props.localValue) {
        let originalModel = monaco.editor
          .getModels()
          .find(
            model => model.uri.query === uri.query + "&diff=true&model=original"
          );
        originalModel.pushEditOperations(
          [],
          [
            {
              range: originalModel.getFullModelRange(),
              text: this.props.localValue
            }
          ]
        );
      }
      if (prevProps.externalValue !== this.props.externalValue) {
        let modifiedModel = monaco.editor
          .getModels()
          .find(
            model => model.uri.query === uri.query + "&diff=true&model=modified"
          );
        modifiedModel.pushEditOperations(
          [],
          [
            {
              range: modifiedModel.getFullModelRange(),
              text: this.props.externalValue
            }
          ]
        );
      }
    }

    if (prevProps.theme !== theme) {
      monaco.editor.setTheme(theme);
    }

    if (width !== prevProps.width || height !== prevProps.height) {
      this.editor.layout();
    }

    if (prevProps.options !== options) {
      this.editor.updateOptions(options);
    }
  };

  componentWillUnmount = () => {
    typeof this.editor !== "undefined" && this.editor.dispose();
  };

  assignRef = component => {
    this.containerElement = component;
  };

  processSize = size => {
    return !/^\d+$/.test(size) ? size : `${size}px`;
  };

  extractExtension = name => {
    return /(?:\.([^.]+))?$/.exec(name);
  };

  findSupportedLanguageByExtension = ext => {
    return monaco.languages.getLanguages().find(item => {
      return item.extensions.indexOf(ext) !== -1;
    });
  };

  findSupportedLanguageByFilename = name => {
    return monaco.languages.getLanguages().find(item => {
      return item.filenames && item.filenames.indexOf(name) !== -1;
    });
  };

  render() {
    const { width, height } = this.props;
    const fixedWidth = this.processSize(width);
    const fixedHeight = this.processSize(height);
    const style = {
      width: fixedWidth,
      height: fixedHeight
    };

    return (
      <div
        ref={this.assignRef}
        style={style}
        className="react-monaco-editor-container"
      />
    );
  }
}

PmbMonacoDiffEditor.defaultProps = {
  defaultValue: "",
  externalValue: "",
  height: "100%",
  localValue: "",
  language: "javascript",
  name: "",
  options: {},
  theme: null,
  uri: {
    scheme: "",
    authority: "",
    path: "",
    query: "",
    fragment: ""
  },
  width: "100%"
};

PmbMonacoDiffEditor.propTypes = {
  defaultValue: PropTypes.string,
  editorDidMount: PropTypes.func,
  externalValue: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  localValue: PropTypes.string,
  language: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  options: PropTypes.object,
  theme: PropTypes.string,
  uri: PropTypes.object.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PmbMonacoDiffEditor;
