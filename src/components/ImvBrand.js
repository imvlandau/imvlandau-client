import React from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Link from '@mui/material/Link';

function ImvBrand() {
  const { t } = useTranslation();
  return (
    <Box sx={{ fontStyle:"italic", fontWeight: 'light', whiteSpace: 'nowrap', mr:1, overflow: "hidden", textOverflow: "ellipsis", pr: 0.5 }}>
      <Link href={"/"} variant="caption" color="inherit" underline="none">
        IMV-Landau e. V. - {t("brand.description")}
      </Link>
    </Box>
  );
}

export default ImvBrand;
