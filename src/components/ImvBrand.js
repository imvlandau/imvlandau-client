import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@material-ui/core/Box";
import Link from '@material-ui/core/Link';

function ImvBrand() {
  const { t } = useTranslation();
  return (
    <Box fontStyle="italic" fontWeight="fontWeightLight" style={{ whiteSpace: 'nowrap' }} mr={1} overflow="hidden" textOverflow="ellipsis">
      <Link href={"/"} variant="caption" color="inherit" underline="none">
        IMV-Landau e. V. - {t("brand.description")}
      </Link>
    </Box>
  );
}

export default ImvBrand;
