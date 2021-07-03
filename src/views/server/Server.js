import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import TextField from "@material-ui/core/TextField";
import PmbNavBar from "../../components/PmbNavBar";
import PmbFooter from "../../components/PmbFooter";
import PmbSnackbar from "../../containers/PmbSnackbar";
import * as actionCreators from "./actions";

const useStyles = makeStyles(theme => ({
  heading: {
    margin: theme.spacing(3, 0)
  },
  stepper: {
    boxShadow: theme.shadows[10]
  },
  buttonStepper: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  headingServerSettings: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

function Server({ history, notifications, ...props }) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["server"]);
  const didMountRef = React.useRef(false);

  // ########## stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const amountOfSteps = 1;

  // ########## server data
  const [valuesServerData, setValuesServerData] = React.useState({
    name: "",
    email: "",
    mobile: "",
    companion1: "",
    companion2: "",
    companion3: "",
    companion4: "",
    qrCodeImageData: null
  });

  // ########## stepper
  const handleNext = () => {
    if (activeStep === amountOfSteps - 1) {
      if (
        valuesServerData.name &&
        valuesServerData.email &&
        valuesServerData.mobile
      ) {
        props
          .provisionServer(
            valuesServerData.name,
            valuesServerData.email,
            valuesServerData.mobile,
            valuesServerData.companion1,
            valuesServerData.companion2,
            valuesServerData.companion3,
            valuesServerData.companion4
          )
          .then(qrCodeImageData => {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
            props.addNotification({
              key: "key_pair.success",
              message: t(
                "Ihre Anmeldung war erfolgreich. Bitte schauen Sie in Ihrer E-Mail nach."
              ),
              type: "success"
            });
            setValuesServerData({
              ...valuesServerData,
              ["qrCodeImageData"]: qrCodeImageData
            });
          });
      } else {
        props.addNotification({
          key: "key_pair.agreement",
          message: t("Sie müssen alle Pflichtfelder* ausfüllen."),
          type: "error"
        });
      }
    }
  };

  // ########## server data
  const handleChangeServerData = name => event => {
    setValuesServerData({ ...valuesServerData, [name]: event.target.value });
  };

  const formNotFilledOut = notifications.filter(notification => {
    return notification.key.indexOf("key_pair.agreement") > -1;
  });

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      didMountRef.current = true;
    } else {
      // updated
    }
  }, []);

  return (
    <React.Fragment>
      <Helmet title="Server" />
      <PmbSnackbar />
      <PmbNavBar showNewButtons={false} />
      <Container maxWidth="lg">
        <Typography className={classes.heading} component="h1" variant="h4">
          {t("Eid al-Adha - 19.07.2021 - Sporthalle IGS Landau")}
        </Typography>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical"
        >
          <Step key="server-settings">
            <StepLabel>{t("Anmeldung")}</StepLabel>
            <StepContent>
              <Typography variant="h6">
                {t(
                  "Hier können Sie sich und Ihre Angehörige für Eid al-Adha registrieren."
                )}
              </Typography>
              <Typography variant="caption">
                {t(
                  "Bitte füllen Sie das folgende Formular aus. Im Anschluss senden wir Ihnen an die hier eingegebene E-Mail-Adresse einen QR-Code zu. Bitte bewahren Sie diesen gut auf und zeigen Sie diesen an der Anmdelung im Eingangsbereich um einen reibungslosen und schnellen Anmeldungsprozess zu ermöglichen."
                )}
              </Typography>
              <form noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      error={Boolean(
                        formNotFilledOut.length && !valuesServerData.name
                      )}
                      autoFocus
                      id="name"
                      label={t("Vor- und Nachname*")}
                      className={classes.textField}
                      fullWidth
                      value={valuesServerData.name || ""}
                      onChange={handleChangeServerData("name")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      error={Boolean(
                        formNotFilledOut.length && !valuesServerData.email
                      )}
                      id="email"
                      label={t("E-Mail*")}
                      className={classes.textField}
                      fullWidth
                      value={valuesServerData.email || ""}
                      onChange={handleChangeServerData("email")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      error={Boolean(
                        formNotFilledOut.length && !valuesServerData.mobile
                      )}
                      id="mobile"
                      label={t("Whatsapp-Nummer*")}
                      className={classes.textField}
                      fullWidth
                      value={valuesServerData.mobile || ""}
                      onChange={handleChangeServerData("mobile")}
                      variant="filled"
                    />
                  </Grid>
                </Grid>
                <Typography
                  variant="h6"
                  className={classes.headingServerSettings}
                >
                  {t("In Begleitung von...")}{" "}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("Person 1")}
                      className={classes.textField}
                      fullWidth
                      value={valuesServerData.companion1 || ""}
                      onChange={handleChangeServerData("companion1")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("Person 2")}
                      className={classes.textField}
                      fullWidth
                      value={valuesServerData.companion2 || ""}
                      onChange={handleChangeServerData("companion2")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("Person 3")}
                      className={classes.textField}
                      fullWidth
                      value={valuesServerData.companion3 || ""}
                      onChange={handleChangeServerData("companion3")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("Person 4")}
                      className={classes.textField}
                      fullWidth
                      value={valuesServerData.companion4 || ""}
                      onChange={handleChangeServerData("companion4")}
                      variant="filled"
                    />
                  </Grid>
                </Grid>
              </form>
              <div className={classes.actionsContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.buttonStepper}
                >
                  {t("button.next")}
                </Button>
              </div>
            </StepContent>
          </Step>
          <Step key="choose-server">
            <StepLabel>{t("Bestätigung")}</StepLabel>
            <StepContent>
              <Typography variant="caption" paragraph>
                {t(`Soeben wurde dieser QR-Code an die E-Mail-Adresse `)}
                 <Box color="warning.dark" component="span" fontFamily="Monospace">{valuesServerData.email}</Box>
                {t(
                  ` gesendet. Bitte halten Sie diesen QR-Code für die Anmeldung im Eingangsbereich bereit.`
                )}
              </Typography>
              <Box display="flex" justifyContent="center">
                <img src={valuesServerData.qrCodeImageData} alt="image"></img>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </Container>
      <PmbFooter showDivider />
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  notifications: state.toastr.notifications
});

export default connect(
  mapStateToProps,
  actionCreators
)(Server);
