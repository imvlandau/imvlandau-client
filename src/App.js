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
import { fromEvent } from "file-selector";
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
            <Route exact path={"/"} component={Server} />
            <Route exact path={"/servers"} component={Servers} />
            <Route exact path={"/loading"} component={Loading} />
            <PrivateRoute exact path="/profile" component={Profile} />
          </Switch>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  );
}

export default App;
