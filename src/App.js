import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes
} from "@material-ui/core/styles";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CssBaseline from '@material-ui/core/CssBaseline';
import grey from "@material-ui/core/colors/grey";
import Participant from './pages/Participant';

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
        <Participant />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
