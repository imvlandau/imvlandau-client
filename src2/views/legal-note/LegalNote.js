import React from "react";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation, Trans } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Obfuscate from "react-obfuscate";
import PmbNavBar from "../../components/PmbNavBar";

const useStyles = makeStyles(theme => ({
  underline: {
    width: "100%",
    border: 0,
    height: "1px",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    marginTop: 0,
    marginBottom: theme.spacing(1)
  },
  link: {
    textDecoration: "none",
    color: theme.palette.secondary.main
  }
}));

function LegalNote() {
  const classes = useStyles();
  const { t } = useTranslation(["legal-note"]);

  return (
    <React.Fragment>
      <Helmet title="Legal notes" />
      <PmbNavBar />
      <Box p={4}>
        <Container maxWidth="md">
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <Typography color="inherit" variant="h5">
                {t("heading.legal.note")}
              </Typography>

              <hr className={classes.underline} />
              <Typography color="inherit" variant="caption">
                <strong>{t("subheading.founder.and.ceo")}</strong>
              </Typography>
              <Typography color="inherit" variant="body1">
                Sufian Abu-Rab
              </Typography>
              <Typography color="inherit" paragraph variant="caption">
                {t("caption.diplomated.computer.scientist")}
              </Typography>

              <Typography color="inherit" variant="caption">
                <strong>{t(`subheading.scientific.director.and.coo`)}</strong>
              </Typography>
              <Typography color="inherit" variant="body1">
                Dr. Anastasiya Sokolova
              </Typography>
              <Typography color="inherit" paragraph variant="caption">
                {t("caption.doctor.of.medicine")}
              </Typography>

              <Typography color="inherit" variant="caption">
                <strong>{t("subheading.email")}</strong>
              </Typography>
              <Typography color="inherit" paragraph variant="body1">
                <Obfuscate email="s.aburab@gmail.com" element="span" />
              </Typography>
              <Typography color="inherit" variant="caption">
                <strong>{t("subheading.fon")}</strong>
              </Typography>
              <Typography color="inherit" paragraph variant="body1">
                <Obfuscate tel="+49 (0) 176 45 86 67 29" element="span" />
              </Typography>
              <Typography color="inherit" variant="caption">
                <strong>{t("subheading.fax")}</strong>
              </Typography>
              <Typography color="inherit" paragraph variant="body1">
                <Obfuscate tel="+49 (0) 3222 33 86 98 0" element="span" />
              </Typography>
            </Grid>
            <Grid className={classes.gridColumn} item xs={6}>
              <Typography color="inherit" variant="h5">
                {t("heading.about.playmobox")}
              </Typography>
              <hr className={classes.underline} />
              <Typography color="inherit" paragraph variant="body1">
                {t("caption.about.playmobox")}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid className={classes.gridColumn} item xs={6}>
              <Typography color="inherit" variant="h5">
                {t("heading.contributing")}
              </Typography>
              <hr className={classes.underline} />
              <Typography color="inherit" paragraph variant="body1">
                {t("caption.contributing")}
              </Typography>
            </Grid>
            <Grid className={classes.gridColumn} item xs={6}>
              <Typography color="inherit" variant="h5">
                {t("heading.bypass")}
              </Typography>
              <hr className={classes.underline} />
              <Typography color="inherit" paragraph variant="body1">
                <Trans i18nKey="legal-note:caption.bypass">
                  Link to
                  <a
                    href="https://www.bountysource.com/teams/playmobox"
                    rel="noopener noreferrer"
                    className={classes.link}
                    target="_blank"
                  >
                    our bounty page
                  </a>
                </Trans>
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={5}>
            <Grid className={classes.gridColumn} item xs={12}>
              <Typography color="inherit" variant="h5">
                {t("heading.donate")}
              </Typography>
              <hr className={classes.underline} />
              <Typography color="inherit" paragraph variant="body1">
                {t("caption.donate")}
              </Typography>
              <Typography color="inherit" variant="caption">
                <strong>{t("subheading.account")}</strong>
              </Typography>
              <Typography color="inherit" paragraph variant="body1">
                Sufian Abu-Rab
              </Typography>
              <Typography color="inherit" variant="caption">
                <Obfuscate email={t("subheading.iban")} element="strong" />
              </Typography>
              <Typography color="inherit" paragraph variant="body1">
                <Obfuscate tel="DE66548500100135480523" element="span" />
              </Typography>
              <Typography color="inherit" variant="caption">
                <Obfuscate email={t("subheading.bank")} element="strong" />
              </Typography>
              <Typography color="inherit" paragraph variant="body1">
                <Obfuscate email="Sparkasse südl. Weinstraße" element="span" />
              </Typography>
              <Typography color="inherit" variant="caption">
                <Obfuscate email={t("subheading.swift.bic")} element="strong" />
              </Typography>
              <Typography color="inherit" paragraph variant="body1">
                <Obfuscate tel="SOLADES1SUW" element="span" />
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
}

export default LegalNote;
