import React, { useState } from "react";
import {
  Notifications as BellIcon,
  Home as HomeIcon,
  MenuBook as CourseIcon,
  Assignment as ExamIcon,
  Schedule as TimetableIcon,
  Settings as SettingsIcon,
  ExitToApp as LogOutIcon,
  ArrowDropDown as ChevronDownIcon,
  AccountCircle as UserIcon,
  NotificationsActive as NotificationActiveIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  ListAlt as ListIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  Slide,
  Fade,
  Zoom,
  InputBase,
  alpha,
  styled,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(to right, #1a2980, #26d0ce)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function ClientHeader({ isAdmin = false }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [activeNav, setActiveNav] = useState("Home");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const studentNavItems = [
    { name: "Home", icon: <HomeIcon />, path: "/Home" },
    { name: "Courses", icon: <CourseIcon />, path: "/courses" },
    { name: "TimeTable", icon: <TimetableIcon />, path: "/StudentTimetable" },
    { name: "Exams", icon: <ExamIcon />, path: "/ExamDetailsPage" },
    { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const adminNavItems = [
    { name: "DASHBOARD", icon: <DashboardIcon />, path: "/Adminpanel" },
    {
      name: "Generate New Timetable",
      icon: <AddIcon />,
      path: "/ScheduleTimetable",
    },
    {
      name: "All Generated Timetables",
      icon: <ListIcon />,
      path: "/AllTimetable",
    },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const dropdownItems = [
    { name: "Profile", icon: <UserIcon />, path: "/profile" },
    { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
    {
      name: "Notifications",
      icon: <NotificationActiveIcon />,
      path: "/notifications",
    },
  ];

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
      PaperProps={{
        elevation: 8,
        sx: {
          mt: 1.5,
          minWidth: 200,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
          overflow: "visible",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
    >
      <Box
        sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            animation: `${pulseAnimation} 2s infinite`,
          }}
        >
          <UserIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {isAdmin ? "Admin User" : "Thilina Hettiarachchci"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isAdmin ? "Administrator" : "Student"}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />

      {dropdownItems.map((item) => (
        <MenuItem
          key={item.name}
          onClick={handleMenuClose}
          component={Link}
          to={item.path}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.08)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: "rgba(25, 118, 210, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </Box>
            {item.name}
          </Box>
        </MenuItem>
      ))}
      <Divider sx={{ my: 1 }} />
      <MenuItem
        onClick={handleMenuClose}
        sx={{
          py: 1.5,
          px: 2,
          color: "error.main",
          "&:hover": {
            backgroundColor: "rgba(244, 67, 54, 0.08)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: "rgba(244, 67, 54, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOutIcon fontSize="small" />
          </Box>
          Log Out
        </Box>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      TransitionComponent={Slide}
      PaperProps={{
        sx: {
          width: 280,
          maxWidth: "100%",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      {navItems.map((item) => (
        <MenuItem
          key={item.name}
          selected={activeNav === item.name}
          onClick={() => {
            setActiveNav(item.name);
            handleMobileMenuClose();
          }}
          component={Link}
          to={item.path}
          sx={{
            py: 1.5,
            "&.Mui-selected": {
              backgroundColor: "rgba(25, 118, 210, 0.12)",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.16)",
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor:
                  activeNav === item.name
                    ? "rgba(25, 118, 210, 0.2)"
                    : "rgba(0, 0, 0, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {React.cloneElement(item.icon, {
                fontSize: "small",
                color: activeNav === item.name ? "primary" : "inherit",
              })}
            </Box>
            <Typography variant="body1">{item.name}</Typography>
          </Box>
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "white",
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1.5,
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    background: "linear-gradient(to right, #1a2980, #26d0ce)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  ES
                </Typography>
              </Box>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  display: { xs: "none", sm: "block" },
                }}
              >
                ExamSync
              </Typography>
            </Box>

            {/* Search bar - desktop */}
            <Search sx={{ display: { xs: "none", md: "block" } }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  startIcon={item.icon}
                  onClick={() => setActiveNav(item.name)}
                  component={Link}
                  to={item.path}
                  sx={{
                    px: 2,
                    color:
                      activeNav === item.name
                        ? "white"
                        : "rgba(255, 255, 255, 0.8)",
                    backgroundColor:
                      activeNav === item.name
                        ? "rgba(255, 255, 255, 0.15)"
                        : "transparent",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>

            {/* Right side icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
              <IconButton
                size="large"
                aria-label="show 3 new notifications"
                color="inherit"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                <Badge
                  badgeContent={3}
                  color="error"
                  variant="dot"
                  overlap="circular"
                >
                  <BellIcon />
                </Badge>
              </IconButton>

              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "white",
                      color: "primary.main",
                      fontWeight: "bold",
                      mr: 1,
                    }}
                  >
                    {isAdmin ? "AU" : "TH"}
                  </Avatar>
                  <ChevronDownIcon
                    sx={{
                      transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  />
                </IconButton>
              </Box>

              {/* Mobile menu button */}
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "white",
                    color: "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  {isAdmin ? "AU" : "TH"}
                </Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </ThemeProvider>
  );
}

export default ClientHeader;
