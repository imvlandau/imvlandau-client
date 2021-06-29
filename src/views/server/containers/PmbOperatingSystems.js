import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import PmbFlag from "../../../components/PmbFlag";
import PmbOperatingSystemVersionMenu from "../components/PmbOperatingSystemVersionMenu";
import {
  FaUbuntu,
  FaCentos,
  FaWindows,
  FaFedora,
  FaFreebsd
} from "react-icons/fa";
import { DiDebian } from "react-icons/di";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    minHeight: "173px",
    alignItems: "center",
    marginBottom: theme.spacing(3)
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  loader: {
    marginBottom: theme.spacing(1)
  },
  card: {
    display: "flex",
    flexDirection: "row",
    "&$selected": {
      boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)"
    },
    "&$disabled": {
      background: theme.palette.grey[200],
      filter: "saturate(0)"
    }
  },
  toggleButton: {
    flex: 1,
    height: "inherit",
    "&$selected": {
      color: theme.palette.primary.contrastText,
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
    }
  },
  /* Pseudo-class applied to the root element if `selected={true}`. */
  selected: {},
  disabled: {},
  content: {
    display: "grid",
    flex: "inherit"
  },
  contentServer: {
    textAlign: "right",
    paddingRight: theme.spacing(1),
    "&:last-child": {
      textAlign: "left",
      paddingRight: theme.spacing(2),
      paddingLeft: 0,
      paddingBottom: theme.spacing(2)
    }
  },
  icon: {
    fontSize: theme.typography.h2.fontSize
  },
  symbol: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}));

function PmbOperatingSystems({
  fetching,
  operatingSystems,
  onChange,
  region,
  ...props
}) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["server"]);
  const didMountRef = React.useRef(false);
  const handleOperatingSystemClick = (operatingSystem, ami) => {
    onChange &&
      onChange(
        ami ||
          operatingSystem.amis.find(
            ami => ami.selected && ami.region === region.name
          )
      );
  };
  const getVersion = operatingSystem => {
    const ami = operatingSystem.amis.find(item => item.selected);
    return (ami && ami.version) || "";
  };
  const getOperatingSystemIcon = name => {
    return {
      FaUbuntu: <FaUbuntu className={classes.icon} />,
      FaCentos: <FaCentos className={classes.icon} />,
      FaWindows: <FaWindows className={classes.icon} />,
      FaFedora: <FaFedora className={classes.icon} />,
      FaFreebsd: <FaFreebsd className={classes.icon} />,
      DiDebian: <DiDebian className={classes.icon} />
    }[name];
  };

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      didMountRef.current = true;
    }
  }, []);

  return fetching ? (
    <div className={classes.root}>
      <div className={classes.loaderContainer}>
        <CircularProgress className={classes.loader} color="secondary" />
        <Typography component="h6">
          {t("caption.fetching.software")}
        </Typography>
      </div>
    </div>
  ) : !operatingSystems.length ? (
    <div className={classes.root}>
      <div className={classes.loaderContainer}>
        <Typography component="h6">
          {t("caption.software.no.operating.systems.found")}
        </Typography>
      </div>
    </div>
  ) : (
    <Grid container spacing={2}>
      {operatingSystems.map((operatingSystem, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card
            className={clsx(classes.card, {
              [classes.selected]: operatingSystem.selected,
              [classes.disabled]: operatingSystem.disabled
            })}
          >
            <ToggleButton
              className={clsx(classes.toggleButton, {
                [classes.selected]: operatingSystem.selected
              })}
              value={operatingSystem.title}
              disabled={operatingSystem.disabled}
              selected={operatingSystem.selected}
              onChange={() => handleOperatingSystemClick(operatingSystem)}
            >
              <div className={classes.symbol}>
                {getOperatingSystemIcon(operatingSystem.icon)}
              </div>
              <CardContent className={classes.content}>
                <Typography
                  component="h5"
                  variant="h5"
                  noWrap
                  title={operatingSystem.title}
                >
                  {operatingSystem.title}
                </Typography>

                {operatingSystem.amis.length ? (
                  <PmbOperatingSystemVersionMenu
                    label={getVersion(operatingSystem)}
                    selected={operatingSystem.selected}
                    amis={operatingSystem.amis}
                    onChange={ami =>
                      handleOperatingSystemClick(operatingSystem, ami)
                    }
                  />
                ) : (
                  <Typography variant="subtitle1" component="span" noWrap>
                    {t("caption.comming.soon")}
                  </Typography>
                )}
              </CardContent>
            </ToggleButton>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

PmbOperatingSystems.propTypes = {
  operatingSystems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  region: PropTypes.object
};

const mapStateToProps = (state, ownProps) => ({
  fetching: state.server.fetching
});

export default connect(mapStateToProps)(PmbOperatingSystems);
