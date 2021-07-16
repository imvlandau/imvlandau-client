import React, { forwardRef, useRef } from "react";
import clsx from "clsx";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
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
    token: "12345",
    name: "Sufian Abu-Rab",
    email: "service@imv-landau.de",
    mobile: "017612341234",
    companion1: "Achmed",
    companion2: "Mohammed",
    companion3: "Amir",
    companion4: "Karim",
    hasBeenScanned: true
  }
];


function Servers({ servers: serversProps = [], fetching, ...props }) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation(["server"]);
  const didMountRef = useRef(false);

  const [servers, setServers] = React.useState(serversProps);

  const columns = [
    {
      readonly: true,
      export: true,
      field: "token",
      title: t("label.token")
    },
    {
      readonly: true,
      export: true,
      field: "name",
      title: t("label.pre.and.last.name")
    },
    {
      readonly: true,
      export: true,
      field: "email",
      title: t("label.email")
    },
    {
      readonly: true,
      export: true,
      field: "mobile",
      title: t("label.mobile")
    },
    {
      readonly: true,
      export: false,
      field: "companions",
      title: t("attendees.companions.section.title"),
      render: rowData => (
        <React.Fragment>
          <Box display="flex">
            {rowData.companion1 && (
              <React.Fragment>{rowData.companion1}</React.Fragment>
            )}
            {rowData.companion1 && rowData.companion2 ? (
              <React.Fragment>, {rowData.companion2}</React.Fragment>
            ) : rowData.companion2 ? (
              <React.Fragment>{rowData.companion2}</React.Fragment>
            ) : null}
            {rowData.companion2 && rowData.companion3 ? (
              <React.Fragment>, {rowData.companion3}</React.Fragment>
            ) : rowData.companion3 ? (
              <React.Fragment>{rowData.companion3}</React.Fragment>
            ) : null}
            {rowData.companion3 && rowData.companion4 ? (
              <React.Fragment>, {rowData.companion4}</React.Fragment>
            ) : rowData.companion4 ? (
              <React.Fragment>{rowData.companion4}</React.Fragment>
            ) : null}
          </Box>
        </React.Fragment>
      )
    },
    {
      readonly: true,
      title: t("attendees.companions.section.title.abbr"),
      hidden: true,
      export: true,
      field: "companion1",
      width: 50
    },
    {
      readonly: true,
      hidden: true,
      export: true,
      field: "companion2",
      width: 50
    },
    {
      readonly: true,
      hidden: true,
      export: true,
      field: "companion3",
      width: 50
    },
    {
      readonly: true,
      hidden: true,
      export: true,
      field: "companion4",
      width: 50
    },
    {
      defaultSort: 'asc',
      readonly: false,
      export: true,
      field: "hasBeenScanned",
      title: t("attendees.has.been.scanned"),
      lookup: { false: 'no', true: 'yes' }
    }
  ];

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      props.fetchServers();
      didMountRef.current = true;
    } else {
      // updated
      setServers(serversProps);
    }
  }, [servers, fetching]);

  return (
    <React.Fragment>
      <Helmet title="Servers" />
      <PmbSnackbar />
      <PmbNavBar showNewButtons={false} />
      <Container maxWidth="lg">
        <Typography className={classes.heading} component="h1" variant="h4">
          {t("attendees.registration.title")}
        </Typography>
        <MaterialTable
          isLoading={fetching}
          localization={{
            body: {
              emptyDataSourceMessage: (
                <React.Fragment>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {t("attendees.no.attendees.registered.yet")}
                  </Typography>
                </React.Fragment>
              )
            },
            header: {
                actions: t("label.actions")
            }
          }}
          options={{
            sorting: true,
            exportButton: { csv: false, pdf: true },
            pageSizeOptions: [5, 10, 50, 100, 300, 1000],
            pageSize: 10,
            padding: "dense",
            searchFieldAlignment: "left",
            searchFieldStyle: {
              marginLeft: theme.spacing(-3)
            },
            actionsColumnIndex: -1
          }}
          icons={tableIcons}
          actions={[
            rowData => ({
              icon: tableIcons.Delete,
              tooltip: t("attendees.delete.tooltip"),
              onClick: (event, rowData) => {
                if(confirm(t("attendees.delete.dialog.message") + rowData.name)) {
                  props.deleteAttendee(rowData.id);
                }
              }
            })
          ]}
          title=""
          columns={columns}
          data={serversProps || sampleData}
          cellEditable={{
            onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
              return new Promise((resolve, reject) => {
                if (columnDef.field == "hasBeenScanned" && oldValue !== newValue) {
                  props.setHasBeenScanned(rowData.id, newValue);
                  resolve();
                } else {
                  resolve();
                }
              });
            }
          }}
        />
        <PmbFooter showDivider />
      </Container>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  servers: state.servers.data,
  fetching: state.servers.fetching
});

export default connect(
  mapStateToProps,
  actionCreators
)(Servers);
