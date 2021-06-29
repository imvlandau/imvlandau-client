import React, { forwardRef } from "react";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import MaterialTable from "material-table";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import green from "@material-ui/core/colors/green";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import * as actionCreators from "./actions";
import PmbNavBar from "../../components/PmbNavBar";
import PmbNewButton from "../../components/PmbNewButton";
import PmbFooter from "../../components/PmbFooter";
import PmbFlag from "../../components/PmbFlag";
import PmbSnackbar from "../../containers/PmbSnackbar";
import {
  Add,
  AddBox,
  ArrowUpward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from "@material-ui/icons";
import {
  FaUbuntu,
  FaCentos,
  FaWindows,
  FaFedora,
  FaFreebsd
} from "react-icons/fa";

const useStyles = makeStyles(theme => ({
  heading: {
    margin: theme.spacing(3, 0)
  },
  card: {
    border: `1px dashed ${theme.palette.grey[500]}`,
    color: theme.palette.primary.main
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    display: "inline-block"
  },
  addIcon: {
    color: theme.palette.primary.main
  },
  operatingSystemIcon: {
    fontSize: theme.typography.h3.fontSize,
    marginRight: theme.spacing(1)
  },
  flagIcon: {
    marginRight: theme.spacing(1)
  },
  status: {
    color: theme.palette.error.main,
    "&$running": {
      color: green[500]
    }
  },
  running: {},
  statusIcon: {
    marginRight: theme.spacing(0.5)
  }
}));

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const sampleData = [
  {
    label: "myClient",
    operatingSystem: "Ubuntu 18.04",
    operatingSystemIcon: FaUbuntu,
    location: "Frankfurt",
    locationCCA3: "DE",
    charges: "$1.51",
    running: true,
    status: "Running",
    ram: "1024MB",
    ip: "192.0.2.3"
  },
  {
    label: "myDatabase",
    operatingSystem: "Ubuntu 18.04",
    operatingSystemIcon: FaUbuntu,
    location: "Ohio",
    locationCCA3: "US",
    charges: "$6.48",
    running: true,
    status: "Running",
    ram: "4096MB",
    ip: "192.0.2.2"
  },
  {
    label: "myAPI",
    operatingSystem: "Server 2019",
    operatingSystemIcon: FaWindows,
    location: "Paris",
    locationCCA3: "FR",
    charges: "$3.24",
    running: true,
    status: "Running",
    ram: "2048MB",
    ip: "192.0.2.1"
  }
];

function Servers({ servers: serversProps = [], ...props }) {
  const classes = useStyles();
  const theme = useTheme();
  const didMountRef = React.useRef(false);

  const [servers, setServers] = React.useState(serversProps);

  const columns = [
    {
      readonly: true,
      field: "server",
      title: "Server",
      render: rowData => (
        <React.Fragment>
          <Typography variant="body2" gutterBottom>
            {rowData.label}
          </Typography>
          <Typography display="block" variant="caption">
            {rowData.ram} -
            <Link to="#!" rel="noopener" className={classes.link}>
              {rowData.ip}
            </Link>
          </Typography>
        </React.Fragment>
      )
    },
    {
      readonly: true,
      field: "operatingSystem",
      title: "OS",
      render: rowData => (
        <React.Fragment>
          <Box display="flex" alignItems="center">
            {
              <rowData.operatingSystemIcon
                className={classes.operatingSystemIcon}
              />
            }
            {rowData.operatingSystem}
          </Box>
        </React.Fragment>
      )
    },
    {
      readonly: true,
      field: "location",
      title: "Location",
      render: rowData => (
        <React.Fragment>
          <Box display="flex" alignItems="center">
            <PmbFlag
              alt={`Flag of ${rowData.location}`}
              format="png"
              name={rowData.locationCCA3}
              pngSize={32}
              shiny={true}
              className={classes.flagIcon}
            />
            {rowData.location}
          </Box>
        </React.Fragment>
      )
    },
    {
      readonly: true,
      field: "charges",
      title: "Charges"
    },
    {
      readonly: true,
      field: "status",
      title: "Status",
      render: rowData => (
        <React.Fragment>
          <Box
            display="flex"
            alignItems="center"
            className={clsx(classes.status, {
              [classes.running]: rowData.running
            })}
          >
            <FiberManualRecordIcon
              className={classes.statusIcon}
              fontSize="small"
            />
            {rowData.status}
          </Box>
        </React.Fragment>
      )
    }
  ];

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      props.getServers();
      didMountRef.current = true;
    } else {
      // updated
      setServers(serversProps);
    }
  }, [servers]);

  return (
    <React.Fragment>
      <Helmet title="Servers" />
      <PmbSnackbar />
      <PmbNavBar />
      <Container maxWidth="lg">
        <Typography className={classes.heading} component="h1" variant="h4">
          Servers
        </Typography>
        <MaterialTable
          localization={{
            body: {
              emptyDataSourceMessage: (
                <React.Fragment>
                  <Typography variant="h4" color="primary" gutterBottom>
                    No servers created
                  </Typography>
                  <Link to={"/server"} rel="noopener" className={classes.link}>
                    <Card className={classes.card}>
                      <CardActionArea>
                        <CardContent>
                          <IconButton
                            component="span"
                            aria-label="Deploy server"
                          >
                            <Add className={classes.addIcon} fontSize="large" />
                          </IconButton>
                          <Typography component="h5" variant="h5">
                            Deploy new server
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Link>
                </React.Fragment>
              )
            }
          }}
          actions={[
            rowData => ({
              icon: () => <MoreHorizIcon />
            })
          ]}
          options={{
            actionsColumnIndex: 5,
            searchFieldAlignment: "left",
            searchFieldStyle: {
              marginLeft: theme.spacing(-3)
            }
          }}
          icons={tableIcons}
          title=""
          columns={columns}
          data={servers || sampleData}
        />
        <PmbFooter showDivider />
      </Container>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  servers: state.server.servers
});

export default connect(
  mapStateToProps,
  actionCreators
)(Servers);
