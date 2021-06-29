import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";
import { FaRegQuestionCircle } from "react-icons/fa";
import {
  DiGit,
  DiNginx,
  DiNodejsSmall,
  DiPhp,
  DiPython,
  DiAngularSimple,
  DiReact,
  DiEmber,
  DiRuby,
  DiBootstrap,
  DiJqueryLogo,
  DiSymfonyBadge,
  DiWordpress,
  DiPostgresql,
  DiMongodb,
  DiMagento
} from "react-icons/di";
import { GiFeather } from "react-icons/gi";
import PmbNavBar from "../../components/PmbNavBar";
import PmbFooter from "../../components/PmbFooter";
import PmbTransferList from "../../components/PmbTransferList";
import PmbServerLocations from "./containers/PmbServerLocations";
import PmbHardwarePriceList from "./containers/PmbHardwarePriceList";
import PmbStartupScript from "./containers/PmbStartupScript";
import PmbKeyPair from "./containers/PmbKeyPair";
import PmbOperatingSystems from "./containers/PmbOperatingSystems";
import PmbSnackbar from "../../containers/PmbSnackbar";
import * as actionCreators from "./actions";

const useStyles = makeStyles(theme => ({
  heading: {
    margin: theme.spacing(3, 0)
  },
  stepper: {
    boxShadow: theme.shadows[10]
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
  rootVerticalTabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "auto",
    marginBottom: theme.spacing(3)
  },
  verticalTabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  appBar: {
    background: "transparent",
    boxShadow: "none"
  },
  buttonStepper: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  headingServerSettings: {
    marginTop: theme.spacing(5),
    "&:first-child": {
      marginTop: theme.spacing(3)
    }
  },
  formControl: {
    display: "flex",
    marginBottom: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  link: {
    textDecoration: "none",
    color: theme.palette.secondary.main
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
      id={`full-width-tabpanel-${index}`} // ` this inserted bec. chrome debugger
      aria-labelledby={`full-width-tab-${index}`} // ` this inserted bec. chrome debugger
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
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

// ########## transfer list
const transferList = [
  {
    key: "apache",
    icon: GiFeather,
    label: "Apache2 web server"
  },
  {
    key: "nginx",
    icon: DiNginx,
    label: "Nginx web server"
  },
  {
    key: "git",
    icon: DiGit,
    label: "Git"
  },
  {
    key: "python",
    icon: DiPython,
    label: "Python"
  },
  {
    key: "ruby",
    icon: DiRuby,
    label: "Ruby"
  },
  {
    key: "php",
    icon: DiPhp,
    label: "PHP"
  },
  {
    key: "nodejs",
    icon: DiNodejsSmall,
    label: "Node.js"
  },
  {
    key: "react",
    icon: DiReact,
    label: "React example app"
  },
  {
    key: "ember",
    icon: DiEmber,
    label: "Ember example app"
  },
  {
    key: "angularjs",
    icon: DiAngularSimple,
    label: "Angular"
  },
  {
    key: "jquery",
    icon: DiJqueryLogo,
    label: "JQuery"
  },
  {
    key: "bootstrap",
    icon: DiBootstrap,
    label: "Bootstrap"
  },
  {
    key: "symfony",
    icon: DiSymfonyBadge,
    label: "Symfony"
  },
  {
    key: "wordpress",
    icon: DiWordpress,
    label: "Wordpress"
  },
  {
    key: "magento",
    icon: DiMagento,
    label: "Magento"
  },
  {
    key: "postgresql",
    icon: DiPostgresql,
    label: "PostgreSQL"
  },
  {
    key: "mongodb",
    icon: DiMongodb,
    label: "MongoDB"
  }
];

const react = ["react", "nodejs", "nginx"];
var transferListReact = transferList.filter(
  item => react.indexOf(item.key) !== -1
);
var transferListReactNot = transferList.filter(
  item => react.indexOf(item.key) === -1
);

function Server({
  history,
  locations: locationsProps,
  startupScripts: startupScriptsProps,
  keyPairs: keyPairsProps,
  operatingSystems: operatingSystemsProps,
  hardwarePriceList: hardwarePriceListProps,
  ...props
}) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["server"]);
  const didMountRef = React.useRef(false);

  // ########## stepper
  const [activeStep, setActiveStep] = React.useState(3);
  const amountOfSteps = 4;

  // ########## server locations
  const [locations, setLocations] = React.useState(locationsProps);
  const selectedLocation = locations.find(item =>
    item.regions.find(region => region.selected)
  );
  const selectedRegion =
    selectedLocation &&
    selectedLocation.regions.find(region => region.selected);

  // ########## operating system
  const [operatingSystems, setOperatingSystems] = React.useState(
    operatingSystemsProps
  );
  const selectedOperatingSystem = operatingSystems.find(os => os.selected);
  const selectedAmi =
    selectedOperatingSystem &&
    selectedOperatingSystem.amis.find(
      ami => ami.selected && ami.region === selectedRegion.name
    );
  const [
    valueOperatingSystemSource,
    setValueOperatingSystemSource
  ] = React.useState(0);
  const handleChangeOperatingSystemSource = (event, newValue) => {
    setValueOperatingSystemSource(newValue);
  };
  const handleChangeIndexOperatingSystemSource = index => {
    setValueOperatingSystemSource(index);
  };

  // ########## server hardware and price list (products)
  const [hardwarePriceList, setHardwarePriceList] = React.useState(
    hardwarePriceListProps
  );
  const selectedHardwarePriceList = hardwarePriceList.find(
    product => product.selected
  );

  // ########## server software
  const [software, setSoftware] = React.useState(transferListReact);
  const [valueVerticalTabs, setValueVerticalTabs] = React.useState(1);
  const handleChangeVerticalTabs = (event, newValue) => {
    setValueVerticalTabs(newValue);
  };

  // ########## server settings
  const [stateServerSettings, setStateServerSettings] = React.useState({
    ip6: false,
    autoBackup: false,
    ddosProtection: false,
    networking: false
  });

  // ########## server data
  const [valuesServerData, setValuesServerData] = React.useState({
    hostname: null,
    title: null
  });

  const [startupScripts, setStartupScripts] = React.useState(
    startupScriptsProps
  );
  const [selectedStartupScript, setSelectedStartupScript] = React.useState(
    null
  );
  const [valueStartupScript, setValueStartupScript] = React.useState("");
  const [contentStartupScript, setContentStartupScript] = React.useState("");
  const handleChangeSelectedStartupScript = startupScript => {
    startupScript && setContentStartupScript(startupScript.content);
    setSelectedStartupScript(startupScript);
  };
  const handleCreateStartupScript = (name, content) => {
    props.createStartupScript(name, content).then(startupScript => {
      setValueStartupScript("");
      handleChangeSelectedStartupScript(startupScript);
    });
  };

  const [keyPairs, setKeyPairs] = React.useState(keyPairsProps);
  const [selectedKeyPair, setSelectedKeyPair] = React.useState(null);
  const [valueKeyPair, setValueKeyPair] = React.useState("");
  const handleCreateKeyPair = name => {
    props.createKeyPair(name).then(keyPair => {
      setValueKeyPair("");
      setSelectedKeyPair(keyPair);
    });
  };
  const [checkedKeyPairOwner, setCheckedKeyPairOwner] = React.useState(false);
  const [checkedWithoutKeyPair, setCheckedWithoutKeyPair] = React.useState(
    false
  );
  const uncheckKeyPairAcknowledgement = () => {
    setCheckedKeyPairOwner(false);
    setCheckedWithoutKeyPair(false);
  };
  const handleChangeSelectedKeyPair = keyPair => {
    setSelectedKeyPair(keyPair);
    uncheckKeyPairAcknowledgement();
  };
  const handleSetCheckedKeyPairOwner = checked => {
    setCheckedKeyPairOwner(checked);
    props.removeNotification("key_pair.agreement");
  };
  const handleSetCheckedWithoutKeyPair = checked => {
    setCheckedWithoutKeyPair(checked);
    props.removeNotification("key_pair.agreement");
  };

  // ########## stepper
  const handleNext = () => {
    if (activeStep === amountOfSteps - 1) {
      if (checkedKeyPairOwner || checkedWithoutKeyPair) {
        props
          .provisionServer(
            selectedRegion,
            selectedAmi,
            selectedHardwarePriceList,
            selectedStartupScript,
            selectedKeyPair,
            valuesServerData.hostname,
            valuesServerData.title,
            software.map(item => item.key)
          )
          .then(() => {
            // history.push("/loading");
          });
      } else {
        props.addNotification({
          key: "key_pair.agreement",
          message: t("notification.accept.keypair.agreement"),
          type: "error"
        });
      }
    } else if (activeStep === 1) {
      props.getHardwarePriceList(
        selectedRegion.name,
        selectedOperatingSystem.platform
      );
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  // ########## server settings
  const handleChangeServerSettings = name => event => {
    setStateServerSettings({
      ...stateServerSettings,
      [name]: event.target.checked
    });
  };
  const { ip6, autoBackup, ddosProtection, networking } = stateServerSettings;

  // ########## server data
  const handleChangeServerData = name => event => {
    if (
      (valuesServerData.title === null && valuesServerData.hostname !== null) ||
      valuesServerData.title === valuesServerData.hostname
    ) {
      setValuesServerData({
        ...valuesServerData,
        hostname: event.target.value,
        title: event.target.value
      });
    } else {
      setValuesServerData({ ...valuesServerData, [name]: event.target.value });
    }
  };

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      props.getInfrastructureOptions();
      didMountRef.current = true;
    } else {
      // updated
      setStartupScripts(startupScriptsProps);
      setKeyPairs(keyPairsProps);
      setLocations(locationsProps);
      setOperatingSystems(operatingSystemsProps);
      setHardwarePriceList(hardwarePriceListProps);
    }
  }, [
    hardwarePriceListProps,
    startupScriptsProps,
    keyPairsProps,
    locationsProps,
    operatingSystemsProps
  ]);

  return (
    <React.Fragment>
      <Helmet title="Server" />
      <PmbSnackbar />
      <PmbNavBar showNewButtons={false} />
      <Container maxWidth="lg">
        <Typography className={classes.heading} component="h1" variant="h4">
          {t("title.provision.server")}
        </Typography>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical"
        >
          <Step key="choose-server-location">
            <StepLabel>{t("heading.location")}</StepLabel>
            <StepContent>
              <Typography variant="caption" paragraph>
                {t("caption.location")}
              </Typography>
              <PmbServerLocations
                locations={locations}
                onChange={setLocations}
              />
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.buttonStepper}
                  >
                    {t("button.back")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!selectedRegion}
                    onClick={handleNext}
                    className={classes.buttonStepper}
                  >
                    {t("button.next")}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
          <Step key="choose-operating-system">
            <StepLabel>{t("heading.software")}</StepLabel>
            <StepContent>
              <Typography variant="caption" paragraph>
                {t("caption.software")}
              </Typography>
              <AppBar
                position="static"
                color="default"
                className={classes.appBar}
              >
                <Tabs
                  value={valueOperatingSystemSource}
                  onChange={handleChangeOperatingSystemSource}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="Operating system tabs"
                >
                  <Tab label={t("label.predefined")} {...a11yProps(0)} />
                  <Tab
                    label={t("label.64.bit.operating.system")}
                    {...a11yProps(1)}
                  />
                  <Tab
                    disabled
                    label={t("label.32.bit.operating.system")}
                    {...a11yProps(2)}
                  />
                  <Tab
                    disabled
                    label={t("label.upload.iso")}
                    {...a11yProps(3)}
                  />
                  <Tab
                    disabled
                    label={t("label.iso.library")}
                    {...a11yProps(4)}
                  />
                  <Tab disabled label={t("label.backups")} {...a11yProps(5)} />
                  <Tab
                    disabled
                    label={t("label.snapshots")}
                    {...a11yProps(6)}
                  />
                </Tabs>
              </AppBar>
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={valueOperatingSystemSource}
                onChangeIndex={handleChangeIndexOperatingSystemSource}
              >
                <TabPanel
                  value={valueOperatingSystemSource}
                  index={0}
                  dir={theme.direction}
                >
                  <div className={classes.rootVerticalTabs}>
                    <Tabs
                      orientation="vertical"
                      variant="scrollable"
                      value={valueVerticalTabs}
                      onChange={handleChangeVerticalTabs}
                      aria-label="Software tabs"
                      className={classes.verticalTabs}
                    >
                      <Tab label="Clean" {...a11yProps(0)} />
                      <Tab label="React" {...a11yProps(1)} />
                      <Tab label="Angular" {...a11yProps(2)} />
                      <Tab label="Vue" {...a11yProps(3)} />
                      <Tab label="Ember" {...a11yProps(4)} />
                      <Tab label="Symfony" {...a11yProps(5)} />
                      <Tab label="Rails" {...a11yProps(6)} />
                    </Tabs>
                    <TabPanel value={valueVerticalTabs} index={0}>
                      <PmbTransferList
                        left={[]}
                        right={transferList}
                        onChange={setSoftware}
                      />
                    </TabPanel>
                    <TabPanel value={valueVerticalTabs} index={1}>
                      <PmbTransferList
                        left={transferListReact}
                        right={transferListReactNot}
                        onChange={setSoftware}
                      />
                    </TabPanel>
                    <TabPanel value={valueVerticalTabs} index={2}>
                      Item Three
                    </TabPanel>
                    <TabPanel value={valueVerticalTabs} index={3}>
                      Item Four
                    </TabPanel>
                    <TabPanel value={valueVerticalTabs} index={4}>
                      Item Five
                    </TabPanel>
                    <TabPanel value={valueVerticalTabs} index={5}>
                      Item Six
                    </TabPanel>
                    <TabPanel value={valueVerticalTabs} index={6}>
                      Item Seven
                    </TabPanel>
                  </div>
                </TabPanel>
                <TabPanel
                  value={valueOperatingSystemSource}
                  index={1}
                  dir={theme.direction}
                >
                  <PmbOperatingSystems
                    operatingSystems={operatingSystems.map(os => {
                      return {
                        ...os,
                        amis: os.amis.filter(
                          ami => ami.region === selectedRegion.name
                        )
                      };
                    })}
                    onChange={selectedAmi => {
                      let selectedOperatingSystem = operatingSystems.find(
                        operatingSystem =>
                          operatingSystem.amis.find(
                            ami =>
                              ami.id === selectedAmi.id &&
                              ami.region === selectedRegion.name
                          )
                      );
                      operatingSystems.find(
                        operatingSystem =>
                          operatingSystem !== selectedOperatingSystem
                      ).selected = false;
                      selectedOperatingSystem.selected = true;
                      selectedOperatingSystem.amis
                        .filter(ami => ami !== selectedAmi)
                        .forEach(function(ami) {
                          ami.selected = false;
                        });
                      selectedAmi.selected = true;
                      setOperatingSystems([...operatingSystems]);
                    }}
                    region={selectedRegion}
                  />
                </TabPanel>
                <TabPanel
                  value={valueOperatingSystemSource}
                  index={2}
                  dir={theme.direction}
                >
                  32 bit OS
                </TabPanel>
                <TabPanel
                  value={valueOperatingSystemSource}
                  index={3}
                  dir={theme.direction}
                >
                  Upload ISO
                </TabPanel>
                <TabPanel
                  value={valueOperatingSystemSource}
                  index={4}
                  dir={theme.direction}
                >
                  ISO Library
                </TabPanel>
                <TabPanel
                  value={valueOperatingSystemSource}
                  index={5}
                  dir={theme.direction}
                >
                  Backup
                </TabPanel>
                <TabPanel
                  value={valueOperatingSystemSource}
                  index={6}
                  dir={theme.direction}
                >
                  Snapshot
                </TabPanel>
              </SwipeableViews>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.buttonStepper}
                  >
                    {t("button.back")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.buttonStepper}
                  >
                    {t("button.next")}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
          <Step key="choose-server">
            <StepLabel>{t("heading.hardware")}</StepLabel>
            <StepContent>
              <Typography variant="caption" paragraph>
                {t("caption.hardware")}
              </Typography>
              <PmbHardwarePriceList
                hardwarePriceList={hardwarePriceList}
                onChange={setHardwarePriceList}
              />
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.buttonStepper}
                  >
                    {t("button.back")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.buttonStepper}
                  >
                    {t("button.next")}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
          <Step key="server-settings">
            <StepLabel>{t("heading.settings")}</StepLabel>
            <StepContent>
              <Typography
                className={classes.headingServerSettings}
                variant="h6"
              >
                {t("heading.server.title")}
              </Typography>
              <Typography variant="caption">
                {t("caption.server.title")}
              </Typography>
              <form noValidate autoComplete="off">
                <Box mx={-1} display="flex" flexGrow={1}>
                  <TextField
                    autoFocus
                    id="hostname"
                    label={t("label.server.hostname")}
                    placeholder={t("placeholder.server.hostname")}
                    className={classes.textField}
                    fullWidth
                    value={valuesServerData.hostname || ""}
                    onChange={handleChangeServerData("hostname")}
                    variant="filled"
                  />
                  <TextField
                    id="label"
                    label={t("label.server.title")}
                    placeholder={t("placeholder.server.title")}
                    className={classes.textField}
                    fullWidth
                    value={
                      valuesServerData.title === null &&
                      valuesServerData.hostname !== null
                        ? valuesServerData.hostname || ""
                        : valuesServerData.title || ""
                    }
                    onChange={handleChangeServerData("title")}
                    variant="filled"
                  />
                </Box>
              </form>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Typography
                    className={classes.headingServerSettings}
                    variant="h6"
                  >
                    {t("heading.startup.script")}{" "}
                    <Link to="#!" rel="noopener" className={classes.link}>
                      ({t("link.manage")})
                    </Link>
                  </Typography>
                  <Typography variant="caption" paragraph>
                    {t("caption.no.startup.scripts.found")}{" "}
                    <Link to="#!" rel="noopener" className={classes.link}>
                      {t("link.click.here.to.add")}
                    </Link>
                  </Typography>
                  <PmbStartupScript
                    startupScripts={startupScripts}
                    selected={selectedStartupScript}
                    value={valueStartupScript}
                    content={contentStartupScript}
                    onChangeSelect={handleChangeSelectedStartupScript}
                    onChangeContent={setSelectedStartupScript}
                    onCreate={handleCreateStartupScript}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    className={classes.headingServerSettings}
                    variant="h6"
                  >
                    {t("heading.ssh.keys")}{" "}
                    <Link to="#!" rel="noopener" className={classes.link}>
                      ({t("link.manage")})
                    </Link>
                  </Typography>
                  <Typography variant="caption" component="div" paragraph>
                    {t("caption.select.or.create.keypair")}
                  </Typography>
                  <PmbKeyPair
                    checkedKeyPairOwner={checkedKeyPairOwner}
                    checkedWithoutKeyPair={checkedWithoutKeyPair}
                    keyPairs={keyPairs}
                    selected={selectedKeyPair}
                    setCheckedKeyPairOwner={handleSetCheckedKeyPairOwner}
                    setCheckedWithoutKeyPair={handleSetCheckedWithoutKeyPair}
                    value={valueKeyPair}
                    onChangeSelect={handleChangeSelectedKeyPair}
                    onChangeValue={uncheckKeyPairAcknowledgement}
                    onCreate={handleCreateKeyPair}
                  />
                </Grid>
              </Grid>
              <Typography
                className={classes.headingServerSettings}
                variant="h6"
              >
                {t("heading.additional.features")}
                <Tooltip title={t("caption.comming.soon")}>
                  <IconButton aria-label="Additional features info icon">
                    <InfoOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Typography variant="caption">
                {t("caption.additional.features")}
              </Typography>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    disabled
                    control={
                      <Checkbox
                        checked={ip6}
                        onChange={handleChangeServerSettings("ip6")}
                        value="ip6"
                      />
                    }
                    label={t("label.enable.ipv6")}
                  />
                  <FormControlLabel
                    disabled
                    control={
                      <Checkbox
                        checked={autoBackup}
                        onChange={handleChangeServerSettings("autoBackup")}
                        value="autoBackup"
                      />
                    }
                    label={
                      <React.Fragment>
                        <Typography display="inline" variant="body1">
                          <Link to="#!" rel="noopener" className={classes.link}>
                            {t("label.enable.auto.backups")}
                          </Link>
                          <Box
                            bgcolor="#d4e0fb"
                            color="#2196F3"
                            fontSize="caption.fontSize"
                            fontWeight="fontWeightLight"
                            component="span"
                            borderRadius={2}
                            px={0.7}
                            py={0.4}
                            ml={0.5}
                          >
                            $4.00/mo
                          </Box>
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <FormControlLabel
                    disabled
                    control={
                      <Checkbox
                        checked={ddosProtection}
                        onChange={handleChangeServerSettings("ddosProtection")}
                        value="ddosProtection"
                      />
                    }
                    label={
                      <React.Fragment>
                        <Typography display="inline" variant="body1">
                          <Link to="#!" rel="noopener" className={classes.link}>
                            {t("label.enable.ddos.protection")}
                          </Link>
                        </Typography>
                        <Tooltip title={t("caption.enable.ddos.protection")}>
                          <IconButton aria-label="DDOS protection info icon">
                            <FaRegQuestionCircle />
                          </IconButton>
                        </Tooltip>
                        <Box
                          bgcolor="#d4e0fb"
                          color="#2196F3"
                          fontSize="caption.fontSize"
                          fontWeight="fontWeightLight"
                          component="span"
                          borderRadius={2}
                          px={0.7}
                          py={0.4}
                          ml={0.5}
                        >
                          $10.00/mo
                        </Box>
                      </React.Fragment>
                    }
                  />
                  <FormControlLabel
                    disabled
                    control={
                      <Checkbox
                        checked={networking}
                        onChange={handleChangeServerSettings("networking")}
                        value="networking"
                      />
                    }
                    label={
                      <React.Fragment>
                        <Typography display="inline" variant="body1">
                          {t("label.enable.private.networking")}
                        </Typography>
                        <Tooltip title={t("caption.add.internal.ip")}>
                          <IconButton aria-label="Enable private networking info icon">
                            <FaRegQuestionCircle />
                          </IconButton>
                        </Tooltip>
                      </React.Fragment>
                    }
                  />
                </FormGroup>
              </FormControl>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.buttonStepper}
                  >
                    {t("button.back")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.buttonStepper}
                  >
                    {activeStep === amountOfSteps - 1
                      ? t("button.deploy.server")
                      : t("button.next")}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        </Stepper>
      </Container>
      <PmbFooter showDivider />
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  hardwarePriceList: state.server.hardwarePriceList,
  startupScripts: state.server.startupScripts,
  keyPairs: state.server.keyPairs,
  locations: state.server.locations,
  operatingSystems: state.server.operatingSystems
});

export default connect(
  mapStateToProps,
  actionCreators
)(Server);
