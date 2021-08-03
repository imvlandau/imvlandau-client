import React from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import { orange, grey } from '@material-ui/core/colors';
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
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
import * as actionCreators from "./actions";

const useStyles = makeStyles(theme => ({
  heading: {
    margin: theme.spacing(3, 0)
  },
  stepper: {
    boxShadow: theme.shadows[10],
    backgroundColor: grey[50]
  },
  buttonStepper: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  headingParticipantSettings: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  buttonProgress: {
    marginLeft: theme.spacing(1),
    color: orange[500]
  }
}));

function Participant({ notifications, activeStep: activeStepProp = 0, qrCodeImageData: qrCodeImageDataProp = null, fetching, createParticipant, createParticipantFailure, ...props }) {
  const classes = useStyles();
  const { t } = useTranslation(["participant"]);
  const didMountRef = React.useRef(false);

  // ########## stepper
  const [activeStep, setActiveStep] = React.useState(activeStepProp);
  const amountOfSteps = 1;

  // ########## participant data
  const [participant, setParticipant] = React.useState({
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
        participant.name &&
        participant.email &&
        participant.mobile
      ) {
        createParticipant({
            name: participant.name,
            email: participant.email,
            mobile: participant.mobile,
            companion1: participant.companion1,
            companion2: participant.companion2,
            companion3: participant.companion3,
            companion4: participant.companion4
          },{
            key: "attendees.registration.complete",
            message: t(
              "attendees.registration.complete"
            ),
            type: "success"
          });
      } else {
        createParticipantFailure([{
          key: "attendees.form.incomplete",
          message: t("notification.form.incomplete"),
          type: "error"
        }]);
      }
    }
  };

  // ########## participant data
  const handleChangeParticipant = name => event => {
    setParticipant({ ...participant, [name]: event.target.value });
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
      setActiveStep(activeStepProp);
      setParticipant(participant => {
        participant.qrCodeImageData = qrCodeImageDataProp;
        return participant;
       });
    }
  }, [fetching, activeStepProp, qrCodeImageDataProp]);

  return (
    <React.Fragment>
      <Helmet title={t("attendees.registration.section.name")} />
      <Notifications />
      <ImvAppBar />
      <Container maxWidth="lg">
        <Typography className={classes.heading} component="h1" variant="h5" sx={{mt: 1, mb:1}}>
          {t("attendees.event.title")}
        </Typography>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical"
          sx={{ p: 1 }}
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
                   sx={{mt: 1}}
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
                      value={participant.companion1 || ""}
                      onChange={handleChangeParticipant("companion1")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="label"
                      label={t("attendees.companions.label.second.companion")}
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
                      label={t("attendees.companions.label.third.companion")}
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
                      label={t("attendees.companions.label.fourth.companion")}
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
                  {t("button.next")}{fetching && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>
              </div>
            </StepContent>
          </Step>
          <Step key="event-registration-confirmation">
            <StepLabel>{t("attendees.confirmation.section.name")}</StepLabel>
            <StepContent>
              <Typography variant="caption" paragraph>
                {t(`attendees.confirmation.section.subtitle.beginning`)}
                 <Box color="warning.dark" component="span" fontFamily="Monospace">{participant.email}</Box>
                {t(
                  `attendees.confirmation.section.subtitle.end`
                )}
              </Typography>
              <Box display="flex" justifyContent="center">
                <img src={participant.qrCodeImageData} alt="qrcode"></img>
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
  activeStep: state.participant.activeStep
});

export default connect(
  mapStateToProps,
  actionCreators
)(Participant);
