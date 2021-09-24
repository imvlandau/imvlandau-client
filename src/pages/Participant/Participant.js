import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import { orange, grey } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import TextField from "@material-ui/core/TextField";
import Notifications from "../../containers/Notifications";
import ImvAppBar from "../../components/ImvAppBar";
import ImvFooter from "../../components/ImvFooter";
import i18nextInstance from "../../i18nextInstance";
import * as actionCreators from "./actions";

const useStyles = makeStyles((theme) => ({
  heading: {
    margin: theme.spacing(3, 0),
  },
  stepper: {
    boxShadow: theme.shadows[10],
    backgroundColor: grey[50],
  },
  buttonStepper: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  headingParticipantSettings: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  buttonProgress: {
    marginLeft: theme.spacing(1),
    color: orange[500],
  },
}));

function Participant({
  notifications,
  activeStep = 0,
  qrCodeImageData = null,
  fetching,
  fetchSettings,
  createParticipant,
  createParticipantFailure,
  settings,
  ...props
}) {
  const classes = useStyles();
  const { t } = useTranslation(["participant"]);

  // ########## participant data
  const [participant, setParticipant] = React.useState({
    name: "",
    email: "",
    mobile: "",
    companion1: "",
    companion2: "",
    companion3: "",
    companion4: "",
  });

  // ########## stepper
  const handleNext = () => {
    if (participant.name && participant.email && participant.mobile) {
      createParticipant(
        {
          name: participant.name,
          email: participant.email,
          mobile: participant.mobile,
          companion1: participant.companion1,
          companion2: participant.companion2,
          companion3: participant.companion3,
          companion4: participant.companion4,
        },
        {
          key: "participant.registration.complete",
          message: t("participant.registration.complete"),
          type: "success",
        }
      );
    } else {
      createParticipantFailure([
        {
          key: "participant.form.incomplete",
          message: t("notification.form.incomplete"),
          type: "error",
        },
      ]);
    }
  };

  // ########## participant data
  const handleChangeParticipant = (name) => (event) => {
    setParticipant({ ...participant, [name]: event.target.value });
  };

  const formNotFilledOut = notifications.filter((notification) => {
    return notification.key.indexOf("participant.form.incomplete") > -1;
  });

  React.useEffect(() => {
    fetchSettings();
  }, []);

  let eventTime = useMemo(() => {
    return (
      new Date(settings.eventTime1).toLocaleTimeString(
        i18nextInstance.language,
        { hour: "2-digit", minute: "2-digit" }
      ) +
      (settings.eventTime2 && settings.eventTime1 !== settings.eventTime2
        ? "/" +
          new Date(settings.eventTime2).toLocaleTimeString(
            i18nextInstance.language,
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
        : "")
    );
  }, [settings]);
  let eventDate = useMemo(() => {
    return new Date(settings.eventDate).toLocaleDateString(
      i18nextInstance.language,
      {
        weekday: "long",
        month: "long",
        day: "numeric",
      }
    );
  }, [settings]);

  return (
    <React.Fragment>
      <Helmet title={t("participant.registration.section.name")} />
      <Notifications />
      <ImvAppBar />
      <Container maxWidth="lg">
        <Typography
          className={classes.heading}
          component="h1"
          variant="h5"
          sx={{ mt: 1, mb: 1 }}
        >
          {t("participant.event.subject", {
            eventTopic: settings.eventTopic || "...",
            eventTime,
            eventDate,
            eventLocation: settings.eventLocation || "...",
          })}
        </Typography>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical"
          sx={{ p: 1 }}
        >
          <Step key="event-registration">
            <StepLabel>{t("participant.registration.section.name")}</StepLabel>
            <StepContent>
              <Typography variant="h6">
                {t("participant.registration.section.title")}
              </Typography>
              <Typography variant="caption" paragraph>
                {t("participant.registration.section.subtitle")}
              </Typography>
              <form noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      error={Boolean(
                        formNotFilledOut.length && !participant.name
                      )}
                      autoFocus
                      id="name"
                      label={t("label.pre.and.last.name") + "*"}
                      className={classes.textField}
                      fullWidth
                      value={participant.name || ""}
                      onChange={handleChangeParticipant("name")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      error={Boolean(
                        formNotFilledOut.length && !participant.email
                      )}
                      id="email"
                      label={t("label.email") + "*"}
                      className={classes.textField}
                      fullWidth
                      value={participant.email || ""}
                      onChange={handleChangeParticipant("email")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      error={Boolean(
                        formNotFilledOut.length && !participant.mobile
                      )}
                      id="mobile"
                      label={t("label.mobile") + "*"}
                      className={classes.textField}
                      fullWidth
                      value={participant.mobile || ""}
                      onChange={handleChangeParticipant("mobile")}
                      variant="filled"
                    />
                  </Grid>
                </Grid>
                <Typography
                  variant="h6"
                  className={classes.headingParticipantSettings}
                  sx={{ mt: 1 }}
                >
                  {t("participant.companions.section.title")}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("participant.companions.label.first.companion")}
                      className={classes.textField}
                      fullWidth
                      value={participant.companion1 || ""}
                      onChange={handleChangeParticipant("companion1")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("participant.companions.label.second.companion")}
                      className={classes.textField}
                      fullWidth
                      value={participant.companion2 || ""}
                      onChange={handleChangeParticipant("companion2")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("participant.companions.label.third.companion")}
                      className={classes.textField}
                      fullWidth
                      value={participant.companion3 || ""}
                      onChange={handleChangeParticipant("companion3")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("participant.companions.label.fourth.companion")}
                      className={classes.textField}
                      fullWidth
                      value={participant.companion4 || ""}
                      onChange={handleChangeParticipant("companion4")}
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
                  disabled={fetching}
                >
                  {t("button.next")}
                  {fetching && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </div>
            </StepContent>
          </Step>
          <Step key="event-registration-confirmation">
            <StepLabel>{t("participant.confirmation.section.name")}</StepLabel>
            <StepContent>
              <Typography variant="caption" paragraph>
                {t(`participant.confirmation.section.subtitle.beginning`)}
                <Box
                  color="warning.dark"
                  component="span"
                  fontFamily="Monospace"
                >
                  {participant.email}
                </Box>
                {t(`participant.confirmation.section.subtitle.end`)}
              </Typography>
              <Box display="flex" justifyContent="center">
                <img src={qrCodeImageData} alt="qrcode"></img>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </Container>
      <ImvFooter showDivider />
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  notifications: state.notifications.notifications,
  fetching: state.participant.fetching,
  qrCodeImageData: state.participant.qrCodeImageData,
  activeStep: state.participant.activeStep,
  settings: state.settings.data,
});

export default connect(mapStateToProps, actionCreators)(Participant);
