import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/icons/Edit";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row"
  },
  icon: {
    verticalAlign: "top",
    marginLeft: theme.spacing(1)
  },
  selected: {
    color: theme.palette.secondary.contrastText
  }
}));

function PmbOperatingSystemVersionMenu({ amis, label, onChange, selected }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(
    amis.indexOf(amis.find(item => item.selected))
  );

  const open = Boolean(anchorEl);

  const handleClick = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index, ami) => {
    event.stopPropagation();
    setSelectedIndex(index);
    onChange && onChange(ami);
    handleClose(event);
  };

  const handleChange = ami => {
    amis.find(ami => ami.selected).selected = false;
    ami.selected = true;
    onChange && onChange();
  };

  const handleClose = event => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      {label ? (
        <Typography variant="subtitle1" component="span" noWrap>
          {label}
        </Typography>
      ) : null}
      <IconButton
        aria-haspopup="true"
        aria-label="Edit version of operating system"
        aria-owns={open ? "pmb-operating-system-version-menu" : undefined}
        component="span"
        className={clsx(classes.icon, {
          [classes.selected]: selected
        })}
        onClick={handleClick}
        size="small"
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <Menu
        id="pmb-operating-system-version-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={event => handleClose(event)}
      >
        {amis.map((ami, index) => (
          <MenuItem
            key={index}
            disabled={index === selectedIndex}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index, ami)}
          >
            <ListItemText primary={ami.version} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

PmbOperatingSystemVersionMenu.propTypes = {
  amis: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  onChange: PropTypes.func,
  selected: PropTypes.bool
};

export default PmbOperatingSystemVersionMenu;
