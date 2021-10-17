import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailable from "@mui/icons-material/EventAvailable";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ListIcon from '@mui/icons-material/List';
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SettingsIcon from '@mui/icons-material/Settings';
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

export default function PmbProfileMenu() {
  const { t } = useTranslation(["participant"]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  let user, isAuthenticated, isLoading;

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
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
