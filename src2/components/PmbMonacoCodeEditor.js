import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import PropTypes from "prop-types";
import React from "react";

class PmbMonacoEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorStates: new Map()
    };
    this.containerElement = undefined;
  }

  componentDidMount = () => {
    const { editorDidMount, onChange, onSubmit, options, theme } = this.props;

    if (this.containerElement) {
      this.editor = monaco.editor.create(this.containerElement, options);

      theme && monaco.editor.setTheme(theme);

      this.initModel();

      // After initializing monaco editor
      editorDidMount && editorDidMount(this.editor, monaco);

      this.editor.onDidChangeModelContent(event => {
        const value = this.editor.getValue();
        onChange && onChange(value, event);
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
    const { language: languageProps, name, uri } = this.props;
    const value =
      this.props.value !== null ? this.props.value : this.props.defaultValue;

    let model = monaco.editor
      .getModels()
      .find(model => model.uri.query === uri.query);

    if (!model) {
      const ext = this.extractExtension(uri.query);
      const supportedLanguage =
        this.findSupportedLanguageByExtension(ext[0]) ||
        this.findSupportedLanguageByFilename(name);
      const language = supportedLanguage && supportedLanguage.id;
      model = monaco.editor.createModel(
        value,
        languageProps || language,
        new monaco.Uri(uri)
      );
      model.updateOptions({
        tabSize: 2,
        insertSpaces: true
      });
    } else if (value !== model.getValue()) {
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value
          }
        ]
      );
    }

    this.editor.setModel(model);

    // Restore the editor state for the file
    const editorState = this.state.editorStates.get(uri.query);
    editorState && this.editor.restoreViewState(editorState);
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      this.props.uri.query !== nextProps.uri.query ||
      this.props.value !== nextProps.value
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
    } else if (triggeredFromOutside && prevProps.value !== this.props.value) {
      let model = monaco.editor
        .getModels()
        .find(model => model.uri.query === uri.query);
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: this.props.value
          }
        ]
      );
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

PmbMonacoEditor.defaultProps = {
  defaultValue: "",
  height: "100%",
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
  value: "",
  width: "100%"
};

PmbMonacoEditor.propTypes = {
  defaultValue: PropTypes.string,
  editorDidMount: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  language: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  options: PropTypes.object,
  theme: PropTypes.string,
  uri: PropTypes.object.isRequired,
  value: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PmbMonacoEditor;
