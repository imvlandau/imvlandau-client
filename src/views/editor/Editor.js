import React from "react";
import PropTypes from "prop-types";
import ioClient from "socket.io-client";
import { Helmet } from "react-helmet";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import * as actionCreators from "./actions";
import EventListener from "react-event-listener";
import SplitterLayout from "react-splitter-layout";
import "react-splitter-layout/lib/index.css";
import PmbTree from "../../containers/PmbTree";
import PmbSnackbar from "../../containers/PmbSnackbar";
import PmbCodeEditor from "../../containers/PmbCodeEditor";
import PmbDiffEditor from "../../containers/PmbDiffEditor";
import PmbPreview from "../../components/PmbPreview";
import PmbDropzone from "../../components/PmbDropzone";
import PmbConfirmationDialog from "../../components/PmbConfirmationDialog";
import { ab2str, isFile, setSelectedNode } from "../../helpers/utils";
import "./Editor.scss";

const styles = theme => ({
  "@global": {
    html: {
      height: "100%"
    },
    body: {
      height: "100%"
    },
    "#root": {
      height: "100%"
    }
  }
});

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeEditorDialogNode: null,
      localFiles: new Map(),
      externalFiles: new Map(),
      selectedNode: null,
      triggeredFromOutside: false
    };
    this.pmbTree = React.createRef();
  }

  componentDidMount = () => {
    this.socket = ioClient(window.location.origin, {
      path: "/synchronizer",
      secure: true,
      rejectUnauthorized: true, // don't use here "false", like often supposed!
      transports: ["websocket"],
      query: "shortid=" + this.props.match.params.shortid
    });
    this.socket.on("connect", () => {
      console.log("[PMB] Connected");
    });
    this.socket.on("disconnect", () => {
      console.log("[PMB] Disconnected");
    });
    this.socket.on("error", data => {
      console.error("[PMB] Error", data);
    });

    // ======================= boxTree
    // =========================================================================
    this.socket.on("updateContent", data => {
      this.updateContent(data);
    });
  };

  handleSelectNode = node => {
    if (isFile(node)) {
      let uri = {
        scheme: window.location.protocol.slice(0, -1),
        authority: window.location.hostname,
        path: "/fetch/content",
        query: "?pathname=" + node.pathname
      };
      if (!this.state.localFiles.has(uri.query)) {
        this.props
          .fetchContent(this.props.match.params.shortid, node.pathname)
          .then(payload => {
            const localValue = ab2str(payload);
            const selectedNode = { ...node, uri };
            this.setState({
              localFiles: this.state.localFiles.set(uri.query, {
                node,
                value: localValue,
                defaultValue: localValue
              }),
              selectedNode
            });
            setSelectedNode(this.props.match.params.shortid, selectedNode);
          });
      } else {
        const selectedNode = { ...node, uri };
        this.setState({ selectedNode });
        setSelectedNode(this.props.match.params.shortid, selectedNode);
      }
    } else {
      const selectedNode = node;
      this.setState({ selectedNode });
      setSelectedNode(this.props.match.params.shortid, selectedNode);
    }
  };

  handleCodeEditorChange = newValue => {
    this.setState({
      localFiles: this.state.localFiles.set(this.state.selectedNode.uri.query, {
        ...this.state.localFiles.get(this.state.selectedNode.uri.query),
        value: newValue
      }),
      triggeredFromOutside: false
    });
  };

  handleDiffEditorChange = (newValue, triggeredFromOutside = false) => {
    this.setState({
      externalFiles: this.state.externalFiles.set(
        this.state.selectedNode.uri.query,
        {
          ...this.state.externalFiles.get(this.state.selectedNode.uri.query),
          value: newValue
        }
      ),
      triggeredFromOutside: triggeredFromOutside || false
    });
  };

  // update content
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  openCodeEditorDialog = () => {
    this.setState({ codeEditorDialogNode: this.state.selectedNode });
  };

  handleCodeEditorSubmit = content => {
    const localFiles = this.state.localFiles;
    const externalFiles = this.state.externalFiles;
    const selectedNode = this.state.selectedNode;
    if (
      localFiles.has(selectedNode.uri.query) &&
      externalFiles.has(selectedNode.uri.query) &&
      localFiles.get(selectedNode.uri.query).value !==
        externalFiles.get(selectedNode.uri.query).value
    ) {
      this.openCodeEditorDialog();
    } else {
      this.handleUpdateContent(content);
    }
  };

  handleCodeEditorDialogSubmit = () => {
    this.handleUpdateContent(
      this.state.localFiles.get(this.state.selectedNode.uri.query).value
    );
    this.handleCodeEditorDialogClose();
  };

  handleCodeEditorDialogClose = () => {
    this.setState({ codeEditorDialogNode: null });
  };

  handleUpdateContent = content => {
    this.props
      .updateContent(
        this.props.match.params.shortid,
        this.state.selectedNode.pathname,
        content
      )
      .then(() => {
        let data = { content };
        this.updateContent({ ...data, triggeredFromOutside: false });
        this.socket.emit("updateContent", {
          ...data,
          triggeredFromOutside: true
        });
      });
  };

  handleDiffEditorSubmit = content => {
    this.props
      .updateContent(
        this.props.match.params.shortid,
        this.state.selectedNode.pathname,
        content
      )
      .then(() => {
        let data = { content };
        this.state.externalFiles.delete(this.state.selectedNode.uri.query);
        this.setState({
          externalFiles: this.state.externalFiles,
          localFiles: this.state.localFiles.set(
            this.state.selectedNode.uri.query,
            {
              ...this.state.localFiles.get(this.state.selectedNode.uri.query),
              defaultValue: content,
              value: content
            }
          ),
          triggeredFromOutside: true
        });
        this.socket.emit("updateContent", {
          ...data,
          triggeredFromOutside: true
        });
      });
  };

  updateContent = ({ content, triggeredFromOutside }) => {
    if (isFile(this.state.selectedNode)) {
      let uri = { query: "?pathname=" + this.state.selectedNode.pathname };
      if (triggeredFromOutside) {
        // is already opened
        if (this.state.localFiles.has(uri.query)) {
          let localFile = this.state.localFiles.get(uri.query);
          // was already edited and has new/different content
          if (
            localFile.value !== localFile.defaultValue &&
            localFile.value !== content
          ) {
            // if diff editor already opened
            if (this.state.externalFiles.has(uri.query)) {
              let externalFile = this.state.externalFiles.get(uri.query);
              // if external content again changed
              if (externalFile.value !== content) {
                this.setState({
                  externalFiles: this.state.externalFiles.set(uri.query, {
                    defaultValue: content,
                    value: content
                  }),
                  triggeredFromOutside
                });
              }
            } else {
              // open diff editor and set content
              this.setState({
                externalFiles: this.state.externalFiles.set(uri.query, {
                  defaultValue: content,
                  value: content
                }),
                triggeredFromOutside
              });
            }
          } else {
            // just opened, not edited
            this.setState({
              localFiles: this.state.localFiles.set(uri.query, {
                ...this.state.localFiles.get(uri.query),
                defaultValue: content,
                value: content
              }),
              triggeredFromOutside
            });
          }
        } else {
          // not yet opened, so not yet edited
          this.setState({
            localFiles: this.state.localFiles.set(uri.query, {
              ...this.state.localFiles.get(uri.query),
              defaultValue: content,
              value: content
            }),
            triggeredFromOutside
          });
        }
      } else {
        // set content of local editor
        this.state.externalFiles.delete(uri.query);
        this.setState({
          externalFiles: this.state.externalFiles,
          localFiles: this.state.localFiles.set(uri.query, {
            ...this.state.localFiles.get(uri.query),
            defaultValue: content,
            value: content
          }),
          triggeredFromOutside
        });
      }
    }
  };

  onUnload = event => {
    const localFiles = this.state.localFiles;
    const externalFiles = this.state.externalFiles;
    let found = null;

    // look in nodes with local changes
    for (const [key, localFile] of localFiles) {
      if (localFile.value !== localFile.defaultValue) {
        found = localFile.node;
        break;
      }
    }

    // look in nodes with external changes
    // skip if already found
    if (!Boolean(found)) {
      for (const [key, externalFile] of externalFiles) {
        if (externalFile.value !== externalFile.defaultValue) {
          found = externalFile.node;
          break;
        }
      }
    }

    if (!Boolean(found)) {
      return;
    } else {
      this.handleSelectNode(found);
    }

    event.preventDefault(); // Cancel the event as stated by the standard.
    (event || window.event).returnValue = null; // Chrome requires returnValue to be set.
    return null;
  };

  // handle file upload
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleDropUploadFiles = files => {
    this.pmbTree.current && this.pmbTree.current.handleStartUploadFiles(files);
  };

  // handle refresh content
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  handleRefresh = node => {
    if (isFile(node)) {
      let uri = {
        scheme: window.location.protocol.slice(0, -1),
        authority: window.location.hostname,
        path: "/fetch/content",
        query: "?pathname=" + node.pathname
      };
      if (this.state.localFiles.has(uri.query)) {
        this.props
          .fetchContent(this.props.match.params.shortid, node.pathname)
          .then(payload => {
            const value = ab2str(payload);
            if (this.state.selectedNode.pathname === node.pathname) {
              const selectedNode = { ...node, uri };
              this.setState({
                localFiles: this.state.localFiles.set(uri.query, {
                  ...this.state.localFiles.get(uri.query),
                  defaultValue: value,
                  value
                }),
                selectedNode
              });
            } else {
              this.setState({
                localFiles: this.state.localFiles.set(uri.query, {
                  ...this.state.localFiles.get(uri.query),
                  defaultValue: value,
                  value
                })
              });
            }
          });
      }
    }
  };

  render() {
    const {
      externalFiles,
      localFiles,
      selectedNode,
      triggeredFromOutside
    } = this.state;

    return (
      <React.Fragment>
        <Helmet title={this.props.match.url} />
        <EventListener onBeforeunload={this.onUnload} target="window" />
        <PmbSnackbar />
        <PmbConfirmationDialog
          onClose={this.handleCodeEditorDialogClose}
          onSubmit={this.handleCodeEditorDialogSubmit}
          node={this.state.codeEditorDialogNode}
        />
        <PmbDropzone onDrop={this.handleDropUploadFiles}>
          <SplitterLayout percentage={true} secondaryInitialSize={75}>
            <PmbTree
              initialSize="30%"
              innerRef={this.pmbTree}
              minSize="10%"
              selectedNode={selectedNode}
              onSelectNode={this.handleSelectNode}
              onRefresh={this.handleRefresh}
              socket={this.socket}
            />
            <SplitterLayout
              percentage={true}
              primaryIndex={0}
              primaryMinSize={50}
              secondaryMinSize={50}
              secondaryInitialSize={50}
            >
              {selectedNode &&
              isFile(selectedNode) &&
              localFiles.has(selectedNode.uri.query) ? (
                <PmbCodeEditor
                  initialSize="30%"
                  defaultValue={
                    localFiles.get(selectedNode.uri.query).defaultValue
                  }
                  name={selectedNode.name}
                  onChange={this.handleCodeEditorChange}
                  onSubmit={this.handleCodeEditorSubmit}
                  triggeredFromOutside={triggeredFromOutside}
                  uri={selectedNode.uri}
                  value={localFiles.get(selectedNode.uri.query).value}
                />
              ) : null}
              {selectedNode &&
              isFile(selectedNode) &&
              externalFiles.has(selectedNode.uri.query) &&
              localFiles.has(selectedNode.uri.query) ? (
                <PmbDiffEditor
                  externalValue={
                    externalFiles.get(selectedNode.uri.query).value
                  }
                  localValue={localFiles.get(selectedNode.uri.query).value}
                  name={selectedNode.name}
                  onChange={this.handleDiffEditorChange}
                  onSubmit={this.handleDiffEditorSubmit}
                  triggeredFromOutside={triggeredFromOutside}
                  uri={selectedNode.uri}
                />
              ) : null}
            </SplitterLayout>
          </SplitterLayout>
        </PmbDropzone>
      </React.Fragment>
    );
  }
}

Editor.defaultProps = {};

Editor.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default compose(
  connect(
    mapStateToProps,
    actionCreators
  ),
  withTranslation(["editor"]),
  withStyles(styles, { withTheme: true })
)(Editor);
