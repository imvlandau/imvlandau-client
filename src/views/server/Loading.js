import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import green from "@material-ui/core/colors/green";
import LinearProgress from "@material-ui/core/LinearProgress";
import PmbNavBar from "../../components/PmbNavBar";
import PmbFlag from "../../components/PmbFlag";

const useStyles = makeStyles(theme => ({
  "@global": {
    html: {
      height: "100%"
    },
    body: {
      height: "100%"
    },
    "#root": {
      height: "100%"
    }
  },
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center"
  },
  root: {
    flexGrow: 1
  }
}));

function Loading({ history }) {
  const classes = useStyles();
  const { t } = useTranslation(["server"]);
  const [completed, setCompleted] = React.useState(0);

  const progress = React.useRef(() => {});
  React.useEffect(() => {
    progress.current = () => {
      if (completed > 100) {
        setCompleted(0);
        history.push("/servers");
      } else {
        const diff = Math.random() * 90;
        setCompleted(completed + diff);
      }
    };
  });

  React.useEffect(() => {
    function tick() {
      progress.current();
    }
    const timer = setInterval(tick, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <React.Fragment>
      <Helmet title="Servers" />
      <PmbNavBar />
      <Container className={classes.container} maxWidth="xs">
        <div className={classes.root}>
          <Typography variant="h4" align="center" gutterBottom>
            {t("caption.server.starting")}
          </Typography>
          <LinearProgress value={completed} />
        </div>
      </Container>
    </React.Fragment>
  );
}

Loading.propTypes = {
  history: PropTypes.object.isRequired
};

export default Loading;
