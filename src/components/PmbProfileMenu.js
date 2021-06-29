import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import PersonIcon from "@material-ui/icons/Person";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import { useAuth0 } from "../react-auth0-spa";

const useStyles = makeStyles(theme => ({
  button: {
    fontStyle: "italic",
    padding: theme.spacing(1, 2),
    lineHeight: 1.5
  },
  loader: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(0.5)
  }
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      },
      "&:first-child": {
        backgroundColor: theme.palette.grey[200],
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
          color: theme.palette.text.hint
        }
      }
    },
    "&:first-child": {
      fontStyle: "italic",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.text.hint
      }
    }
  }
}))(MenuItem);

export default function PmbProfileMenu() {
  const classes = useStyles();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    loading,
    user
  } = useAuth0();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return loading ? (
    <Button classes={{ root: classes.button }} color="inherit">
      <CircularProgress
        className={classes.loader}
        color="primary"
        size={24}
        thickness={4}
      />
      {t("button.label.loading")}
    </Button>
  ) : !isAuthenticated || !user ? (
    <Button
      classes={{ root: classes.button }}
      color="inherit"
      onClick={() => loginWithRedirect({})}
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
      <StyledMenu
        id="pmb-profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem component={Link} to="/profile">
          <ListItemText
            primary={`${t("button.label.signed.in.as")} ${user.nickname}`}
          />
        </StyledMenuItem>
        <StyledMenuItem component={Link} to="/profile">
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("button.label.your.profile")} />
        </StyledMenuItem>
        <StyledMenuItem>
          <ListItemText inset primary="Drafts" />
        </StyledMenuItem>
        <Divider />
        <StyledMenuItem onClick={handleLogout}>
          <ListItemIcon>
            <MeetingRoomIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("button.label.sign.out")} />
        </StyledMenuItem>
      </StyledMenu>
    </React.Fragment>
  );
}
