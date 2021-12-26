import { Themes } from "@geist-ui/react";

export const desktopBp = 900;
export const contentMaxWidth = 600;
export const treeDepthPadding = 30;
export const hoveredNodeBorderStyle = "1px solid purple";

export const palette = {
  success: "#176ecc",
  background: "#242526",
  secondary: "#ecf28c",
  alternative: "#303845",
};

export const fsTheme = Themes.createFromDark({
  type: "fs",
  palette,
});
