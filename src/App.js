import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes
} from "@mui/material/styles";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import grey from "@mui/material/colors/grey";
import Auth0ProviderWithHistory from "./auth/Auth0ProviderWithHistory";
import Home from "./pages/Home";
import Participant from './pages/Participant';
import Participants from './pages/Participants';
import Settings from './pages/Settings';
import Profile from "./components/Profile";
import PrivateRoute from "./auth/PrivateRoute";

const theme = responsiveFontSizes(
  createTheme({
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
    shape: {
      borderRadius: 0
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          html, body {
            background-color: ${grey[100]};
          }
        `
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)"
          }
        }
      }
    },
  })
);

const titleTemplate = window.location.hostname.indexOf('playmobox') !== -1 ? "Playmobox" : "Imv-landau";
const defaultTitle = window.location.hostname.indexOf('playmobox') !== -1 ? "Playmobox - web application editor" : "Imv-landau - Islamischer multikultureller Verein in Landau";
const content = window.location.hostname.indexOf('playmobox') !== -1 ? "Playmobox is a high-end web application editor" : "Imv-landau - Islamischer multikultureller Verein in Landau";

function App() {
  return (
    <HelmetProvider>
      <Helmet
        titleTemplate={"%s | " + titleTemplate}
        defaultTitle={"%s | " + defaultTitle}
        meta={[
          {
            name: "description",
            content: "%s | " + content
          }
        ]}
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Auth0ProviderWithHistory>
            <Switch>
              <Route exact path="/" component={window.location.hostname.indexOf('imv-landau') > -1 ? Participant : Home} />
              <Route exact path="/participant" component={Participant} />
              <PrivateRoute exact path="/participants" component={Participants} />
              <PrivateRoute exact path="/settings" component={Settings} />
              <PrivateRoute exact path="/profile" component={Profile} />
            </Switch>
          </Auth0ProviderWithHistory>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
