import { useDispatch, useSelector } from "react-redux";
import { changeTheme } from "../../../Store/Slices/ThemeSlice";
import { IconButton } from "@mui/material";
import { LightMode, DarkMode, DarkModeRounded } from "@mui/icons-material";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  return (
    <IconButton onClick={() => dispatch(changeTheme())}>
      {mode === 'light' ? <DarkModeRounded /> : <LightMode />}
    </IconButton>
  );
};

export default ThemeToggle;
