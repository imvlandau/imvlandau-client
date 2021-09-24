import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import PersonIcon from "@material-ui/icons/Person";
import EventAvailable from "@material-ui/icons/EventAvailable";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ListIcon from '@material-ui/icons/List';
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import SettingsIcon from '@material-ui/icons/Settings';
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";

export default function PmbProfileMenu() {
  const { t } = useTranslation(["participant"]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    isLoading,
    user
  } = useAuth0();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout({
      returnTo: window.location.origin,
    });
    handleClose();
  };

  return isLoading ? (
    <Button sx={{ fontStyle:"italic", fontWeight: 'light' }} color="inherit">
      {t("button.label.loading")}
      <CircularProgress
        sx={{ ml: 1 }}
        color="inherit"
        size={24}
        thickness={4}
      />
    </Button>
  ) : !isAuthenticated || !user ? (
    <Button
      sx={{ fontStyle: "italic", fontWeight: "light", mr: 1 }}
      color="inherit"
      onClick={() => {
        loginWithRedirect({
          appState: {
            returnTo: window.location.pathname,
          },
        });
      }}
    >
      <PersonIcon fontSize="small" />
      {t("button.label.sign.in")}
    </Button>
  ) : (
    <React.Fragment>
      <Button
        aria-controls="pmb-profile-menu"
        aria-haspopup="true"
        color="inherit"
        onClick={handleClick}
      >
        <Avatar alt={`${user.nickname} (${user.email})`} src={user.picture} />
        <ArrowDropDownIcon fontSize="small" />
      </Button>
      <Menu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        id="pmb-profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <ListItemText
            primary={`${t("button.label.signed.in.as")} ${user.nickname}`}
          />
        </MenuItem>

        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("button.label.your.profile")} />
        </MenuItem>

        <MenuItem component={Link} to="/participant">
          <ListItemIcon>
            <EventAvailable fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("participant.registration.section.name")} />
        </MenuItem>

        <MenuItem component={Link} to="/participants">
          <ListItemIcon>
            <ListIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("button.label.participant")} />
        </MenuItem>

        <MenuItem component={Link} to="/settings">
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("button.label.settings")} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <MeetingRoomIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("button.label.sign.out")} />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
