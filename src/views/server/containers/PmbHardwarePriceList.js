import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    minHeight: "200px",
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
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
      "& $priceMonthly": {
        color: theme.palette.primary.contrastText
      },
      "& $priceUnit": {
        color: theme.palette.secondary.contrastText
      }
    }
  },
  /* Pseudo-class applied to the root element if `selected={true}`. */
  selected: {},
  disabled: {},
  content: {
    flex: "1 0 auto"
  },
  contentProduct: {
    textAlign: "right",
    paddingRight: theme.spacing(1),
    "&:last-child": {
      textAlign: "left",
      paddingRight: theme.spacing(2),
      paddingLeft: 0,
      paddingBottom: theme.spacing(2)
    }
  },
  priceMonthly: {
    color: theme.palette.primary.main
  },
  priceUnit: {
    color: theme.palette.primary.light
  },
  noTextTransform: {
    textTransform: "none"
  },
  strong: {
    fontWeight: "bold"
  }
}));

function PmbHardwarePriceList({
  fetching,
  hardwarePriceList,
  onChange,
  ...props
}) {
  const classes = useStyles();
  const { t } = useTranslation(["server"]);
  const didMountRef = React.useRef(false);
  const handleProductClick = product => {
    hardwarePriceList.find(product => product.selected).selected = false;
    product.selected = true;
    onChange && onChange([...hardwarePriceList]);
  };

  React.useEffect(() => {
    if (!didMountRef.current) {
      // mounted
      didMountRef.current = true;
    }
  }, []);

  return (
    <Grid container spacing={2} className={classes.root}>
      {fetching ? (
        <div className={classes.loaderContainer}>
          <CircularProgress className={classes.loader} color="secondary" />
          <Typography component="h6">
            {t("caption.fetching.hardware")}
          </Typography>
        </div>
      ) : !hardwarePriceList.length ? (
        <div className={classes.loaderContainer}>
          <Typography component="h6">
            {t("caption.hardware.no.products.found")}
          </Typography>
        </div>
      ) : (
        hardwarePriceList.map((product, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
              className={clsx(classes.card, {
                [classes.selected]: product.selected,
                [classes.disabled]: product.disabled
              })}
            >
              <ToggleButton
                className={clsx(classes.toggleButton, {
                  [classes.selected]: product.selected
                })}
                value={product.instanceType}
                disabled={product.disabled}
                selected={product.selected}
                onChange={() => handleProductClick(product)}
              >
                <CardContent className={classes.content}>
                  <Typography
                    className={classes.priceMonthly}
                    component="h5"
                    variant="h5"
                  >
                    {product.priceMonthly}
                    <Typography
                      className={clsx(
                        classes.priceUnit,
                        classes.noTextTransform
                      )}
                      display="inline"
                      variant="caption"
                    >
                      /{t("caption.per.month")}
                    </Typography>
                  </Typography>
                  <Typography
                    className={classes.noTextTransform}
                    variant="caption"
                  >
                    {product.priceHourly}/{t("caption.per.hour")}
                  </Typography>
                </CardContent>
                <Divider orientation="vertical" />
                <CardContent
                  className={clsx(classes.content, classes.contentProduct)}
                >
                  <Typography
                    className={classes.strong}
                    component="h6"
                    variant="caption"
                  >
                    {product.diskSpace}
                  </Typography>
                  <Typography
                    className={classes.strong}
                    component="h6"
                    variant="caption"
                  >
                    {product.vcpu}
                  </Typography>
                  <Typography
                    className={classes.strong}
                    component="h6"
                    variant="caption"
                  >
                    {product.memory}
                  </Typography>
                  <Typography
                    className={classes.strong}
                    component="h6"
                    variant="caption"
                  >
                    {product.bandwidth}
                  </Typography>
                </CardContent>
                <CardContent
                  className={clsx(classes.content, classes.contentProduct)}
                >
                  <Typography component="h6" variant="caption">
                    SSD
                  </Typography>
                  <Typography component="h6" variant="caption">
                    CPU
                  </Typography>
                  <Typography component="h6" variant="caption">
                    {t("label.memory")}
                  </Typography>
                  <Typography component="h6" variant="caption">
                    {t("label.traffic")}
                  </Typography>
                </CardContent>
              </ToggleButton>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
}

PmbHardwarePriceList.propTypes = {
  hardwarePriceList: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  fetching: state.server.fetching
});

export default connect(mapStateToProps)(PmbHardwarePriceList);
