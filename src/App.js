import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes
} from "@material-ui/core/styles";
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


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Participant />
    </ThemeProvider>
  );
}

export default App;
