import React from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { red } from "@mui/material/colors";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import TimePicker from "@mui/lab/TimePicker";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import formatISO from "date-fns/formatISO";
import parseISO from "date-fns/parseISO";
import deLocale from "date-fns/locale/de";
import enLocale from "date-fns/locale/en-US";
import arSaLocale from "date-fns/locale/ar-SA";
import { Editor } from "@tinymce/tinymce-react";
import * as actionCreators from "./actions";
import { useAuth0 } from "@auth0/auth0-react";
import { authorized } from "../../services/http";
import i18nextInstance from "../../i18nextInstance";
import Notifications from "../../containers/Notifications";
import ImvAppBar from "../../components/ImvAppBar";
import ImvFooter from "../../components/ImvFooter";

const localeMap = {
  "en-US": enLocale,
  "de-DE": deLocale,
  "ar-PS": arSaLocale,
};

const maskMap = {
  "en-US": "__/__/____",
  "de-DE": "__.__.____",
  "ar-PS": "__.__.____",
};

const defaultEmailSubject = `QrCode für {{ eventTopic }} um {{ eventTime }} Uhr am {{ eventDate }} in der {{ eventLocation }}`;
const defaultEmailTemplate = `As-salāmu ʿalaikum wa-raḥmatu llāhi wa-barakātuhu {{ name }}!<br/><br/>Du hast Dich erfolgreich für {{ eventTopic }} am {{ eventDate }} um {{ eventTime }} Uhr registriert.<br/><br/>Veranstaltungsort ist {{ eventLocation }}.<br/><br/>Hier ist Dein QR-Code für den Anmeldeprozess am Eingang:<br/><br/><img src="cid:QrCode" /><br/><br/>Wir freuen uns schon auf Dich und BarakAllahu Feek(i)<br/><br/>Dein IMV-Landau e. V.`;

function Settings({
  notifications,
  fetching,
  fetchSettings,
  settings: settingsProp,
  saveSettings,
  saveSettingsFailure,
  ...props
}) {
  const { t } = useTranslation(["settings"]);
  const didMountRef = React.useRef(false);
  const editorRef = React.useRef(null);
  const { getAccessTokenSilently } = useAuth0();

  // ########## settings data
  const [settings, setSettings] = React.useState(settingsProp);

  // ########## stepper
  const handleSubmit = () => {
    if (
      settings.eventMaximumAmount &&
      settings.eventDate &&
      settings.eventTime1 &&
      settings.eventTopic &&
      settings.eventLocation &&
      settings.eventEmailSubject &&
      settings.eventEmailTemplate
    ) {
      let eventDate;
      let eventTime1;
      let eventTime2;
      try {
        try {
          eventDate = formatISO(parseISO(settings.eventDate));
        } catch (e) {
          // eslint-disable-next-line
          throw "eventDate.invalid";
        }
        try {
          eventTime1 = formatISO(parseISO(settings.eventTime1));
        } catch (e) {
          // eslint-disable-next-line
          throw "eventTime1.invalid";
        }
        try {
          eventTime2 = settings.eventTime2
            ? formatISO(parseISO(settings.eventTime2))
            : "";
        } catch (e) {
          // eslint-disable-next-line
          throw "eventTime2.invalid";
        }

        if (window.confirm(t("settings.confirm.deletion.list.participants"))) {
          (async () => {
              const token = await getAccessTokenSilently();
              token && authorized(token);
              saveSettings(
                {
                  eventMaximumAmount: settings.eventMaximumAmount,
                  eventDate: eventDate,
                  eventTime1: eventTime1,
                  eventTime2: eventTime2,
                  eventTopic: settings.eventTopic,
                  eventLocation: settings.eventLocation,
                  eventEmailSubject: settings.eventEmailSubject,
                  eventEmailTemplate: settings.eventEmailTemplate,
                },
                {
                  key: "settings.saved",
                  message: t("settings.saved"),
                  type: "success",
                }
              );
          })();
        }
      } catch (e) {
        saveSettingsFailure([
          {
            key: `settings.form.${e}`,
            message: t(`settings.form.${e}`),
            type: "error",
          },
        ]);
      }
    } else {
      saveSettingsFailure([
        {
          key: "settings.form.incomplete",
          message: t("notification.form.incomplete"),
          type: "error",
        },
      ]);
    }
  };

  // ########## settings data
  const handleChangeSettings = (name) => (event) => {
    setSettings({ ...settings, [name]: event.target.value });
  };
  const handleChangeEventDate = (newValue) => {
    try {
      settings.eventDate = formatISO(newValue);
    } catch (e) {
      settings.eventDate = newValue;
    }
    setSettings({ ...settings });
  };
  const handleChangeEventTime1 = (newValue) => {
    try {
      settings.eventTime1 = formatISO(newValue);
    } catch (e) {
      settings.eventTime1 = newValue;
    }
    setSettings({ ...settings });
  };
  const handleChangeEventTime2 = (newValue) => {
    try {
      settings.eventTime2 = formatISO(newValue);
    } catch (e) {
      settings.eventTime2 = newValue;
    }
    setSettings({ ...settings });
  };
  const handleChangeEmailTemplate = () => {
    if (editorRef.current) {
      settings.eventEmailTemplate = editorRef.current.getContent();
      setSettings(settings);
    }
  };
  const handleResetEmailSubject = () => {
    settings.eventEmailSubject = defaultEmailSubject;
    setSettings({ ...settings });
  };
  const handleResetEmailTemplate = () => {
    if (editorRef.current) {
      settings.eventEmailTemplate = editorRef.current.setContent(
        defaultEmailTemplate
      );
      setSettings(settings);
    }
  };

  const formNotFilledOut = notifications.filter((notification) => {
    return notification.key.indexOf("settings.form.incomplete") > -1;
  });
  const eventTopicInvalid = notifications.filter((notification) => {
    return notification.key.indexOf("settings.eventTopic") > -1;
  });
  const eventLocationInvalid = notifications.filter((notification) => {
    return notification.key.indexOf("settings.eventLocation") > -1;
  });
  const eventEmailSubjectInvalid = notifications.filter((notification) => {
    return notification.key.indexOf("settings.eventEmailSubject") > -1;
  });
  const eventEmailTemplateInvalid = notifications.filter((notification) => {
    return notification.key.indexOf("settings.eventEmailTemplate") > -1;
  });

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      didMountRef.current = true;
      fetchSettings();
    } else {
      // updated
      setSettings({...settingsProp});
    }
  }, [settingsProp]);

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
                  required
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
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      error={Boolean(
                        (formNotFilledOut.length && !settings.eventDate) ||
                          notifications.filter(
                            (notification) =>
                              notification.key.indexOf("eventDate") > -1
                          ).length
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
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      error={Boolean(
                        (formNotFilledOut.length && !settings.eventTime1) ||
                          notifications.filter(
                            (notification) =>
                              notification.key.indexOf("eventTime1") > -1
                          ).length
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
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      error={Boolean(
                        notifications.filter(
                          (notification) =>
                            notification.key.indexOf("eventTime2") > -1
                        ).length
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="eventTopic"
                  label={t("settings.label.eventTopic")}
                  fullWidth
                  value={settings.eventTopic || ""}
                  onChange={handleChangeSettings("eventTopic")}
                  variant="filled"
                  error={Boolean(
                    (formNotFilledOut.length && !settings.eventTopic) ||
                      eventTopicInvalid.length
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="eventLocation"
                  label={t("settings.label.eventLocation")}
                  fullWidth
                  value={settings.eventLocation || ""}
                  onChange={handleChangeSettings("eventLocation")}
                  variant="filled"
                  error={Boolean(
                    (formNotFilledOut.length && !settings.eventLocation) ||
                      eventLocationInvalid.length
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    required
                    id="eventEmailSubject"
                    label={t("settings.label.eventEmailSubject")}
                    fullWidth
                    value={settings.eventEmailSubject || ""}
                    onChange={handleChangeSettings("eventEmailSubject")}
                    variant="outlined"
                    error={Boolean(
                      (formNotFilledOut.length &&
                        !settings.eventEmailSubject) ||
                        eventEmailSubjectInvalid.length
                    )}
                  />
                  <Button
                    onClick={handleResetEmailSubject}
                    variant="outlined"
                    sx={{
                      ml: 1
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <React.Fragment>
                  <Typography
                    component="p"
                    variant="caption"
                    sx={{
                      ml: 2,
                      color: Boolean(
                        (formNotFilledOut.length &&
                          !settings.eventEmailTemplate) ||
                          eventEmailTemplateInvalid.length
                      )
                        ? red["700"]
                        : "rgba(0, 0, 0, 0.6)",
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
                    entity_encoding: "raw",
                    forced_root_block: "",
                    height: 400,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 0.5,
                  }}
                >
                  <Button
                    onClick={handleResetEmailTemplate}
                    variant="outlined"
                    size="small"
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={fetching}
            >
              {t("button.next")}
              {fetching && <CircularProgress sx={{ ml: 1 }} size={24} />}
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
  settings: state.settings.data,
});

export default connect(mapStateToProps, actionCreators)(Settings);
