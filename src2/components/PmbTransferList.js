import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  cardHeader: {
    padding: theme.spacing(1, 2)
  },
  list: {
    width: "100%",
    height: 230,
    overflow: "auto"
  },
  direction: {
    margin: "auto"
  },
  buttonTransferList: {
    margin: theme.spacing(0.5, 0)
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
  icon: {
    fontSize: theme.typography.h2.fontSize
  }
}));

// ########## transfer list
function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function PmbTransferList({ left: leftProps, onChange, right: rightProps }) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(leftProps);
  const [right, setRight] = React.useState(rightProps);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  const numberOfChecked = items => intersection(checked, items).length;
  const handleToggleAll = items => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };
  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    onChange && onChange(not(left, leftChecked));
  };
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    onChange && onChange(left.concat(rightChecked));
  };
  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "All items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map(value => {
          const labelId = `transfer-list-all-item-${value.key}-label`;

          return (
            <ListItem
              key={value.key}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemIcon edge="end" aria-label="Comments">
                {<value.icon className={classes.icon} />}
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.label} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={5}>
        {customList("Chosen", left)}
      </Grid>
      <Grid className={classes.direction} item xs={2}>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            fullWidth
            className={classes.buttonTransferList}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="Move selected right"
          >
            <Typography component="span" variant="h5">
              &gt;
            </Typography>
          </Button>
          <Button
            variant="outlined"
            fullWidth
            className={classes.buttonTransferList}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="Move selected left"
          >
            <Typography component="span" variant="h5">
              &lt;
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        {customList("Available", right)}
      </Grid>
    </Grid>
  );
}

PmbTransferList.propTypes = {
  onChange: PropTypes.func
};

export default PmbTransferList;
