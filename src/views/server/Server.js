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
              key: "attendees.registration.complete",
              message: t(
                "attendees.registration.complete"
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
          key: "attendees.form.incomplete",
          message: t("notification.form.incomplete"),
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
    return notification.key.indexOf("attendees.form.incomplete") > -1;
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
      <Helmet title={t("attendees.browser.title")} />
      <PmbSnackbar />
      <PmbNavBar showNewButtons={false} />
      <Container maxWidth="lg">
        <Typography className={classes.heading} component="h1" variant="h4">
          {t("attendees.event.title")}
        </Typography>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical"
        >
          <Step key="event-registration">
            <StepLabel>{t("attendees.registration.section.name")}</StepLabel>
            <StepContent>
              <Typography variant="h6">
                {t(
                  "attendees.registration.section.title"
                )}
              </Typography>
              <Typography variant="caption">
                {t(
                  "attendees.registration.section.subtitle"
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
                      label={t("label.pre.and.last.name") + "*"}
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
                      label={t("label.email") + "*"}
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
                      label={t("label.mobile") + "*"}
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
                  {t("attendees.companions.section.title")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("attendees.companions.label.first.companion")}
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
                      label={t("attendees.companions.label.second.companion")}
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
                      label={t("attendees.companions.label.third.companion")}
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
                      label={t("attendees.companions.label.fourth.companion")}
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
          <Step key="event-registration-confirmation">
            <StepLabel>{t("attendees.confirmation.section.name")}</StepLabel>
            <StepContent>
              <Typography variant="caption" paragraph>
                {t(`attendees.confirmation.section.subtitle.beginning`)}
                 <Box color="warning.dark" component="span" fontFamily="Monospace">{valuesServerData.email}</Box>
                {t(
                  `attendees.confirmation.section.subtitle.end`
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
