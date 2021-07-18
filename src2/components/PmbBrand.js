import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Box from "@material-ui/core/Box";
import Link from '@material-ui/core/Link';

function PmbBrand({ rotating }) {
  const { t } = useTranslation();
  return (
    <Box fontStyle="italic" fontWeight="fontWeightLight" style={{ whiteSpace: 'nowrap' }} mr={1} overflow="hidden" textOverflow="ellipsis">
      <Link href={"/"} variant="caption" color="inherit" underline="none">
        IMV-Landau e. V. - {t("brand.description")}
      </Link>
    </Box>
  );
}

PmbBrand.defaultProps = {
  rotating: false
};

PmbBrand.propTypes = {
  rotating: PropTypes.bool
};

export default PmbBrand;
