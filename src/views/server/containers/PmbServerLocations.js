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
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SwipeableViews from "react-swipeable-views";
import CircularProgress from "@material-ui/core/CircularProgress";
import PmbFlag from "../../../components/PmbFlag";

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
  appBar: {
    background: "transparent",
    boxShadow: "none"
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
  }
}));

// ########## tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      component="div"
      flexGrow={1}
      role="tabpanel"
      hidden={value !== index}
      id={`server-location-tabpanel-${index}`} // ` this inserted bec. chrome debugger
      aria-labelledby={`server-location-tab-${index}`} // ` this inserted bec. chrome debugger
      {...other}
      p={3}
    >
      {children}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `server-location-tab-${index}`,
    "aria-controls": `server-location-tabpanel-${index}`
  };
}

function PmbServerLocations({ locations, onChange, fetching, ...props }) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["server"]);
  const didMountRef = React.useRef(false);
  const selectedLocation = locations.find(item =>
    item.regions.find(region => region.selected)
  );
  const selectedRegion =
    selectedLocation &&
    selectedLocation.regions.find(region => region.selected);
  const selectedLocationIndex = Math.max(
    locations.indexOf(selectedLocation),
    0
  );
  const [tabIndex, setTabIndex] = React.useState(selectedLocationIndex);
  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  const handleChangeIndex = index => {
    setTabIndex(index);
  };
  const handleRegionClick = region => {
    selectedRegion.selected = false;
    region.selected = true;
    onChange && onChange([...locations]);
  };

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      didMountRef.current = true;
    } else {
      // updated
      setTabIndex(selectedLocationIndex);
    }
  }, [locations]);

  return fetching ? (
    <div className={classes.root}>
      <div className={classes.loaderContainer}>
        <CircularProgress className={classes.loader} color="secondary" />
        <Typography component="h6">
          {t("caption.fetching.locations")}
        </Typography>
      </div>
    </div>
  ) : !locations.length ? (
    <div className={classes.root}>
      <div className={classes.loaderContainer}>
        <Typography component="h6">
          {t("caption.location.no.regions.available")}
        </Typography>
      </div>
    </div>
  ) : (
    <React.Fragment>
      <AppBar position="static" color="default" className={classes.appBar}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Server location tabs"
        >
          {locations.map((location, index) => (
            <Tab label={t(location.label)} key={index} {...a11yProps(index)} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={tabIndex}
        onChangeIndex={handleChangeIndex}
      >
        {locations.map((location, index) => (
          <TabPanel
            value={tabIndex}
            key={index}
            index={index}
            dir={theme.direction}
          >
            <Grid container spacing={2}>
              {location.regions.map((region, regionIndex) => (
                <Grid item key={regionIndex} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    className={clsx(classes.card, {
                      [classes.selected]: selectedRegion.name === region.name,
                      [classes.disabled]: region.disabled
                    })}
                  >
                    <ToggleButton
                      className={clsx(classes.toggleButton, {
                        [classes.selected]: selectedRegion.name === region.name
                      })}
                      value={region.label}
                      disabled={region.disabled}
                      selected={selectedRegion.name === region.name}
                      onChange={() => handleRegionClick(region)}
                    >
                      <div className={classes.symbol}>
                        <PmbFlag
                          alt={`Flag of ${region.locale}`}
                          format="png"
                          name={region.cca3}
                          pngSize={64}
                          shiny={true}
                        />
                      </div>
                      <CardContent className={classes.content}>
                        <Typography
                          component="h5"
                          variant="h5"
                          noWrap
                          title={`${t(region.label)} (${region.name})`}
                        >
                          {t(region.label)}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          noWrap
                          title={`${t(region.locale)} (${region.name})`}
                        >
                          {t(region.locale)}
                        </Typography>
                      </CardContent>
                    </ToggleButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        ))}
      </SwipeableViews>
    </React.Fragment>
  );
}

PmbServerLocations.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  fetching: state.server.fetching
});

export default connect(mapStateToProps)(PmbServerLocations);
