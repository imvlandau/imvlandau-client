import React, { Suspense } from "react";
import { Helmet } from "react-helmet";
import { Router, Switch, Route } from "react-router-dom";
import {
  MuiThemeProvider,
  createMuiTheme,
  responsiveFontSizes
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import grey from "@material-ui/core/colors/grey";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import { DragDropContext as dragDropContext } from "react-dnd";
import { fromEvent } from "file-selector";
import { Home } from "./views/home";
import { LegalNote } from "./views/legal-note";
import { Editor } from "./views/editor";
import { Servers } from "./views/servers";
import { Server, Loading } from "./views/server";
import Profile from "./components/Profile";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";

// https://stackoverflow.com/a/4819886/1601953
const isTouchDevice = !!("ontouchstart" in window || navigator.maxTouchPoints);

export const HTML5BackendWithFolderSupport = manager => {
  const backend = HTML5Backend(manager),
    orgTopDropCapture = backend.handleTopDropCapture;

  backend.handleTopDropCapture = e => {
    orgTopDropCapture.call(backend, e);
    // just true if files/folders were dropped
    if (backend.currentNativeSource) {
      backend.currentNativeSource.item.dirContent = fromEvent(e); //returns a promise
    }
  };

  return backend;
};

const wrap = dragDropContext(
  isTouchDevice ? TouchBackend : HTML5BackendWithFolderSupport
);

const DnDEditor = wrap(Editor);

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        light: "#4dd5f5",
        main: "#21CBF3",
        dark: "#178eaa",
        contrastText: "#fff"
      },
      secondary: {
        light: "#4dabf5",
        main: "#2196F3",
        dark: "#1769aa",
        contrastText: "#fff"
      }
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          body: {
            backgroundColor: grey[100]
          }
        }
      },
      MuiAppBar: {
        root: {
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)"
        }
      }
    },
    shape: {
      borderRadius: 0
    }
  })
);

function App() {
  return (
    <React.Fragment>
      <Helmet
        titleTemplate="%s | Playmobox"
        defaultTitle="Playmobox - web application editor"
        meta={[
          {
            name: "description",
            content: "Playmobox is a high-end web application editor"
          }
        ]}
      />
      <Router history={history}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <Route exact path={"/"} component={Home} />
            <Route exact path={"/legal-note"} component={LegalNote} />
            <Route
              exact
              path={"/start"}
              render={props => <Servers data={[]} {...props} />}
            />
            <Route exact path={"/new/server"} component={Server} />
            <Route exact path={"/servers"} component={Servers} />
            <Route exact path={"/loading"} component={Loading} />
            <Route
              exact
              path={"/(new|edit)/:shortid/(.*)?"}
              component={DnDEditor}
            />
            <PrivateRoute exact path="/profile" component={Profile} />
          </Switch>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
