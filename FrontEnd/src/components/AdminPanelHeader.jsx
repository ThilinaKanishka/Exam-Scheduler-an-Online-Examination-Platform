import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  People as UsersIcon,
  Dashboard as DashboardIcon,
  School as InstructorIcon,
  Assessment as ReportsIcon,
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
  styled,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

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

const ToolbarOffset = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

function AdminPanelHeader() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [examAnchorEl, setExamAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navItems = [
    { name: "Dashboard", icon: <DashboardIcon /> },
    { name: "Courses", icon: <CourseIcon /> },
    { name: "Exams", icon: <ExamIcon />, isDropdown: true },
    { name: "Timetable", icon: <TimetableIcon /> },
    { name: "Users", icon: <UsersIcon /> },
    { name: "Instructors", icon: <InstructorIcon /> },
    { name: "Reports", icon: <ReportsIcon /> },
  ];

  const examMenuItems = [
    { name: "Schedule New Exam", path: "/AdminScheduleExa" },
    { name: "All Exams", path: "/AllExam" },
    { name: "Examination Results", path: "/ResultsPage" },
  ];

  const dropdownItems = [
    { name: "Profile", icon: <UserIcon /> },
    { name: "Settings", icon: <SettingsIcon /> },
    { name: "Notifications", icon: <NotificationActiveIcon /> },
  ];

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isExamMenuOpen = Boolean(examAnchorEl);

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

  const handleExamMenuOpen = (event) => {
    setExamAnchorEl(event.currentTarget);
  };

  const handleExamMenuClose = () => {
    setExamAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleExamMenuClose();
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
            Thilina Hettiarachchci
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administrator
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />

      {dropdownItems.map((item) => (
        <MenuItem
          key={item.name}
          onClick={handleMenuClose}
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

  const renderExamMenu = (
    <Menu
      anchorEl={examAnchorEl}
      open={isExamMenuOpen}
      onClose={handleExamMenuClose}
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
      {examMenuItems.map((item) => (
        <MenuItem
          key={item.name}
          onClick={() => {
            setActiveNav(item.name);
            handleNavigation(item.path);
          }}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.08)",
            },
          }}
        >
          {item.name}
        </MenuItem>
      ))}
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
        <AppBar position="fixed" elevation={0}>
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

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {navItems.map((item) => {
                if (item.isDropdown) {
                  return (
                    <Box key={item.name}>
                      <Button
                        startIcon={item.icon}
                        endIcon={<ChevronDownIcon />}
                        onClick={handleExamMenuOpen}
                        sx={{
                          px: 2,
                          color:
                            activeNav === item.name || isExamMenuOpen
                              ? "white"
                              : "rgba(255, 255, 255, 0.8)",
                          backgroundColor:
                            activeNav === item.name || isExamMenuOpen
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
                      {renderExamMenu}
                    </Box>
                  );
                }
                return (
                  <Button
                    key={item.name}
                    startIcon={item.icon}
                    onClick={() => setActiveNav(item.name)}
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
                );
              })}
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
                    TH
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
                  AU
                </Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <ToolbarOffset />
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </ThemeProvider>
  );
}

export default AdminPanelHeader;
