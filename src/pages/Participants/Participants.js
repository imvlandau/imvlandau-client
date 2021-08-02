import React, { forwardRef, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import * as actionCreators from "./actions";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Notifications from "../../containers/Notifications";
import ImvAppBar from "../../components/ImvAppBar";
import ImvFooter from "../../components/ImvFooter";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

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
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function Participants({ participants: participantsProp, fetchParticipants, fetching, ...props }) {
  const didMountRef = useRef(false);
  const theme = useTheme();
  const { t } = useTranslation(["participant"]);

  const [participants, setParticipants] = React.useState(participantsProp);

  const columns = [
    {
      readonly: false,
      export: true,
      field: "hasBeenScanned",
      title: t("attendees.has.been.scanned"),
      lookup: { false: "no", true: "yes" }
    },
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
    }
  ];

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      fetchParticipants();
      didMountRef.current = true;
    } else {
      // updated
      setParticipants(participantsProp);
    }
  }, [fetchParticipants, participantsProp]);

  return (
    <React.Fragment>
      <Helmet title={t("attendees.registration.section.name")} />
      <Notifications />
      <ImvAppBar />
      <Container maxWidth="lg">
        <Typography component="h1" variant="h5" sx={{mt: 1, mb:1}}>
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
          search: false,
          exportMenu: [{
            label: 'Export PDF',
            exportFunc: (cols, datas) => ExportPdf(cols, datas, 'myPdfFileName')
          }, {
            label: 'Export CSV',
            exportFunc: (cols, datas) => ExportCsv(cols, datas, 'myCsvFileName', ";")
          }],
          pageSizeOptions: [5, 10, 50, 100, 300, 1000],
          pageSize: 50,
          padding: "dense",
          searchFieldAlignment: "left",
          searchFieldStyle: {
            marginLeft: theme.spacing(-3)
          },
          actionsColumnIndex: 0
        }}
        icons={tableIcons}
        /*
        actions={[
          rowData => ({
            icon: tableIcons.Delete,
            tooltip: t("attendees.delete.tooltip"),
            onClick: (event, rowData) => {
              if (
                window.confirm(t("attendees.delete.dialog.message") + rowData.name)
              ) {
                props.deleteAttendee(rowData.id);
              }
            }
          })
        ]}
        */
        title=""
        columns={columns}
        data={participants}
        cellEditable={{
          onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
            return new Promise((resolve, reject) => {
              if (
                columnDef.field === "hasBeenScanned" &&
                oldValue !== newValue
              ) {
                props.setHasBeenScanned(rowData.id, newValue);
                resolve();
              } else {
                resolve();
              }
            });
          }
        }}
      />
      <ImvFooter showDivider />
    </Container>
    </React.Fragment>
  );
}

const mapStateToProps = (state, ownProps) => ({
  participants: state.participants.data,
  fetching: state.participants.fetching
});

export default connect(
  mapStateToProps,
  actionCreators
)(Participants);
