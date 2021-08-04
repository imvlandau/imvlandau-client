import React from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { red } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import TimePicker from "@material-ui/lab/TimePicker";
import DatePicker from "@material-ui/lab/DatePicker";
import deLocale from "date-fns/locale/de";
import enLocale from "date-fns/locale/en-US";
import arSaLocale from "date-fns/locale/ar-SA";
import { Editor } from "@tinymce/tinymce-react";
import * as actionCreators from "./actions";
import i18nextInstance from "../../i18nextInstance";
import Notifications from "../../containers/Notifications";
import ImvAppBar from "../../components/ImvAppBar";
import ImvFooter from "../../components/ImvFooter";

const localeMap = {
  "en-US": enLocale,
  "de-DE": deLocale,
  "ar-PS": arSaLocale
};

const maskMap = {
  "en-US": "__/__/____",
  "de-DE": "__.__.____",
  "ar-PS": "__.__.____"
};

function Settings({
  notifications,
  fetching,
  fetchSettings,
  saveSettings,
  saveSettingsFailure,
  ...props
}) {
  const { t } = useTranslation(["settings"]);
  const didMountRef = React.useRef(false);
  const editorRef = React.useRef(null);

  // ########## settings data
  const [settings, setSettings] = React.useState({
    eventMaximumAmount: null,
    eventTime1: null,
    eventTime2: null,
    eventDate: null,
    eventTopic: "",
    eventLocation: "",
    eventEmailSubject:
      "QrCode für {{ eventTopic }} um {{ eventTime }} Uhr am {{ eventDate }} in der {{ eventLocation }}",
    eventEmailTemplate: `As-salāmu ʿalaikum wa-raḥmatu llāhi wa-barakātuhu {{ name | title  }}!<br/><br/>Du hast Dich erfolgreich für {{ eventTopic }} am {{ eventDate }} um {{ eventTime }} Uhr registriert.<br/><br/>Veranstaltungsort ist {{ eventLocation }}.<br/><br/>Hier ist Dein QR-Code für den Anmeldeprozess am Eingang:<br/><br/><img src="cid:QrCode" /><br/><br/>Wir freuen uns schon auf Dich und BarakAllahu Feek(i)<br/><br/>Dein IMV-Landau e. V.`
  });

  // ########## stepper
  const handleSubmit = () => {
    if (
      settings.eventMaximumAmount &&
      settings.eventTime1 &&
      settings.eventDate &&
      settings.eventTopic &&
      settings.eventLocation &&
      settings.eventEmailSubject &&
      settings.eventEmailTemplate
    ) {
      saveSettings(
        {
          eventMaximumAmount: settings.eventMaximumAmount,
          eventTime1: settings.eventTime1,
          eventTime2: settings.eventTime2,
          eventDate: settings.eventDate,
          eventTopic: settings.eventTopic,
          eventLocation: settings.eventLocation,
          eventEmailSubject: settings.eventEmailSubject,
          eventEmailTemplate: settings.eventEmailTemplate
        },
        {
          key: "settings.saved",
          message: t("settings.saved"),
          type: "success"
        }
      );
    } else {
      saveSettingsFailure([
        {
          key: "settings.form.incomplete",
          message: t("notification.form.incomplete"),
          type: "error"
        }
      ]);
    }
  };

  // ########## settings data
  const handleChangeSettings = name => event => {
    setSettings({ ...settings, [name]: event.target.value });
  };
  const handleChangeEventDate = newValue => {
    settings.eventDate = newValue;
    setSettings({ ...settings });
  };
  const handleChangeEventTime1 = newValue => {
    settings.eventTime1 = newValue;
    setSettings({ ...settings });
  };
  const handleChangeEventTime2 = newValue => {
    settings.eventTime2 = newValue;
    setSettings({ ...settings });
  };

  const handleChangeEmailTemplate = () => {
    if (editorRef.current) {
      settings.eventEmailTemplate = editorRef.current.getContent();
      setSettings({ ...settings });
    }
  };

  const formNotFilledOut = notifications.filter(notification => {
    return notification.key.indexOf("settings.form.incomplete") > -1;
  });

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      didMountRef.current = true;
      // fetchSettings();
    } else {
      // updated
      // setSettings(settings => {
      //   settings.eventTime1 = eventTime1;
      //   return settings;
      //  });
    }
  }, [fetching, settings]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      locale={localeMap[i18nextInstance.language]}
    >
      <Helmet title={t("settings.title")} />
      <Notifications />
      <ImvAppBar />
      <Container maxWidth="lg">
        <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 1 }}>
          {t("settings.title")}
        </Typography>
        <Paper
          elevation={3}
          sx={{ display: "flex", flexDirection: "column", p: 2 }}
        >
          <form noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  error={Boolean(
                    formNotFilledOut.length && !settings.eventMaximumAmount
                  )}
                  autoFocus
                  id="eventMaximumAmount"
                  label={t("settings.label.eventMaximumAmount")}
                  fullWidth
                  value={settings.eventMaximumAmount || ""}
                  onChange={handleChangeSettings("eventMaximumAmount")}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  mask={maskMap[i18nextInstance.language]}
                  label={t("settings.label.eventDate")}
                  views={["year", "month", "day"]}
                  value={settings.eventDate || null}
                  onChange={handleChangeEventDate}
                  renderInput={params => (
                    <TextField
                      fullWidth
                      {...params}
                      error={Boolean(
                        formNotFilledOut.length && !settings.eventDate
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TimePicker
                  label={t("settings.label.eventTime1")}
                  value={settings.eventTime1 || null}
                  onChange={handleChangeEventTime1}
                  renderInput={params => (
                    <TextField
                      fullWidth
                      {...params}
                      error={Boolean(
                        formNotFilledOut.length && !settings.eventTime1
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TimePicker
                  label={t("settings.label.eventTime2")}
                  value={settings.eventTime2 || null}
                  onChange={handleChangeEventTime2}
                  renderInput={params => <TextField fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="eventTopic"
                  label={t("settings.label.eventTopic")}
                  fullWidth
                  value={settings.eventTopic || ""}
                  onChange={handleChangeSettings("eventTopic")}
                  variant="filled"
                  error={Boolean(
                    formNotFilledOut.length && !settings.eventTopic
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="eventLocation"
                  label={t("settings.label.eventLocation")}
                  fullWidth
                  value={settings.eventLocation || ""}
                  onChange={handleChangeSettings("eventLocation")}
                  variant="filled"
                  error={Boolean(
                    formNotFilledOut.length && !settings.eventLocation
                  )}
                />
              </Grid>
              <Grid item lg={12}>
                <TextField
                  id="eventEmailSubject"
                  label={t("settings.label.eventEmailSubject")}
                  fullWidth
                  value={settings.eventEmailSubject || ""}
                  onChange={handleChangeSettings("eventEmailSubject")}
                  variant="outlined"
                  error={Boolean(
                    formNotFilledOut.length && !settings.eventEmailSubject
                  )}
                />
              </Grid>
              <Grid item lg={12}>
                <React.Fragment>
                  <Typography
                    component="p"
                    variant="caption"
                    sx={{
                      ml: 2,
                      color: Boolean(
                        formNotFilledOut.length && !settings.eventEmailTemplate
                      )
                        ? red["700"]
                        : "rgba(0, 0, 0, 0.6)"
                    }}
                  >
                    {t("settings.label.eventEmailTemplate")}
                  </Typography>
                </React.Fragment>
                <Editor
                  apiKey="vri9rv2g9b7the2eisul7xwtgr3fhcd6d5dq3w71e5zp9znt"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={settings.eventEmailTemplate}
                  onEditorChange={handleChangeEmailTemplate}
                  init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount"
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                  }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={fetching}
              sx={{ mt: 2 }}
            >
              {t("button.next")}
              {fetching && <CircularProgress size={24} />}
            </Button>
          </form>
        </Paper>
      </Container>
      <ImvFooter showDivider />
    </LocalizationProvider>
  );
}

const mapStateToProps = (state, ownProps) => ({
  notifications: state.notifications.notifications,
  fetching: state.settings.fetching,
  settings: state.settings.data
});

export default connect(
  mapStateToProps,
  actionCreators
)(Settings);
