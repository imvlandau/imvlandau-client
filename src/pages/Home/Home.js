import React from "react";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DesktopIcon from "@mui/icons-material/DesktopWindows";
import ShareIcon from "@mui/icons-material/Share";
import { FaGithub, FaTerminal } from "react-icons/fa";
import { GoFlame } from "react-icons/go";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ImvAppBar from "../../components/ImvAppBar";
import PmbFooter from "../../components/PmbFooter";

const useStyles = makeStyles(theme => ({
  teaserTitle: {
    fontWeight: 500
  },
  teaserButton: {
    borderRadius: 4,
    padding: theme.spacing(1, 3),
    // TODO: check alternative style
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    // background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    // boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)"
  },
  teaserImage: {
    boxShadow: theme.shadows[1],
    borderRadius: 4
  },
  videoSection: {
    backgroundColor: theme.palette.common.white,
    boxShadow: "0px 1px 14px 0px rgba(0,0,0,0.24)",
    padding: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  videoSection2: {
    padding: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  videoContainerWrapper: {
    width: "66%",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  videoContainer: {
    position: "relative",
    paddingBottom: "56.25%",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      marginTop: theme.spacing(3)
    },
    height: 0,
    overflow: "hidden",
    "& iframe, & object, & embed": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    },
    border: "1px solid #ddd"
  },
  featuresSection: {
    backgroundColor: theme.palette.common.white,
    boxShadow: "0px 1px 14px 0px rgba(0,0,0,0.24)",
    padding: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  features: {
    padding: theme.spacing(4, 4, 0, 4)
  },
  featureIcon: {
    fontSize: theme.typography.h4.fontSize,
    marginBottom: theme.spacing(1)
  },
  featureIconColor: {
    color: theme.palette.primary.main
  },
  footerSection: {
    backgroundColor: theme.palette.common.white
  }
}));

export default function Home() {
  const classes = useStyles();
  const { t } = useTranslation(["home"]);

  return (
    <React.Fragment>
      <Helmet title="Home" />
      <ImvAppBar />
      <Box p={4}>
        <Grid container spacing={5}>
          <Grid
            direction="column"
            justifyContent="center"
            alignItems="center"
            container
            item
            md={5}
            sm={6}
            xs={12}
          >
            <Typography
              align="center"
              className={classes.teaserTitle}
              color="inherit"
              component="h1"
              paragraph
              variant="h3"
            >
              {t("title")}
            </Typography>
            <Typography
              align="center"
              color="inherit"
              component="h2"
              paragraph
              variant="subtitle1"
            >
              {t("subtitle")}
            </Typography>
            <Button
              className={classes.teaserButton}
              color="primary"
              size="large"
              href="#!"
              variant="contained"
              style={{flexDirection:"column"}}
            >
              <Typography>
                {t("button.get.started")}
              </Typography>
              <Typography variant="caption">
                {t("button.coming.soon")}
              </Typography>
            </Button>
          </Grid>
          <Grid item md={7} sm={6} xs={12}>
            <CardMedia
              className={classes.teaserImage}
              component="img"
              src="/images/screenshot-editor.png"
              title="Playmobox editor"
            />
          </Grid>
        </Grid>
      </Box>
      <div className={classes.videoSection}>
        <Typography align="center" color="inherit" variant="h3">
          {t("heading.what.is.playmobox")}
        </Typography>
        <div className={classes.videoContainerWrapper}>
          <div className={classes.videoContainer}>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              width="100%"
              src="https://www.youtube-nocookie.com/embed/82rPcjkhYig?vq=hd1080"
              title="explanation video"
            />
          </div>
        </div>
      </div>
      <div className={classes.videoSection2}>
        <Typography align="center" color="inherit" variant="h3">
          {t("heading.provision.server")}
        </Typography>
        <div className={classes.videoContainerWrapper}>
          <div className={classes.videoContainer}>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              width="100%"
              src="https://www.youtube-nocookie.com/embed/OypRel_QYy0?vq=hd1080"
              title="provision server"
            />
          </div>
        </div>
      </div>
      <div className={classes.featuresSection}>
        <Container className={classes.features} maxWidth="md">
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <FavoriteIcon className={classes.featureIcon} color="primary" />
                <Typography
                  align="justify"
                  color="inherit"
                  paragraph
                  variant="subtitle1"
                >
                  {t("caption.tools.and.components")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <DesktopIcon className={classes.featureIcon} color="primary" />
                <Typography
                  align="justify"
                  color="inherit"
                  paragraph
                  variant="subtitle1"
                >
                  {t("caption.access.your.filesystem")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <FaTerminal
                  className={clsx(classes.featureIcon, classes.featureIconColor)}
                />
                <Typography
                  align="justify"
                  color="inherit"
                  paragraph
                  variant="subtitle1"
                >
                  {t("caption.execute.shell.commands")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <FaGithub
                  className={clsx(classes.featureIcon, classes.featureIconColor)}
                />
                <Typography align="justify" color="inherit" variant="subtitle1">
                  {t("caption.connect.with.github")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <GoFlame
                  className={clsx(classes.featureIcon, classes.featureIconColor)}
                />
                <Typography align="justify" color="inherit" variant="subtitle1">
                  {t("caption.use.hot.module.reloading")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <ShareIcon className={classes.featureIcon} color="primary" />
                <Typography align="justify" color="inherit" variant="subtitle1">
                  {t("caption.collaborate.by.using.diff.tools")}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </div>
      <PmbFooter showDivider className={classes.footerSection} />
    </React.Fragment>
  );
}
