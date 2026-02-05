import { createTheme, type ThemeOptions } from "@mui/material/styles";

export const createAppTheme = (options?: ThemeOptions) => createTheme(options ?? {});
