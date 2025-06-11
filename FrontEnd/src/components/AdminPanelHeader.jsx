import React, { useState } from "react";
import {
  Notifications as BellIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as ExamIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  ExitToApp as LogOutIcon,
  ArrowDropDown as ChevronDownIcon,
  AccountCircle as UserIcon,
  Email as EmailIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
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
  InputBase,
  alpha,
  styled,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  CssBaseline,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

// Animation
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(25, 118, 210, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
`;

// Styled components
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

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1a237e",
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

// Page components
const DashboardPage = () => (
  <Box p={3}>
    <Typography variant="h4">Dashboard</Typography>
    <Typography>Welcome to your admin dashboard</Typography>
  </Box>
);

const ExamsPage = () => (
  <Box p={3}>
    <Typography variant="h4">Exams</Typography>
    <Typography>Manage your exams here</Typography>
  </Box>
);

const StudentsPage = () => (
  <Box p={3}>
    <Typography variant="h4">Students</Typography>
    <Typography>View and manage students</Typography>
  </Box>
);

const ReportsPage = () => (
  <Box p={3}>
    <Typography variant="h4">Reports</Typography>
    <Typography>View system reports</Typography>
  </Box>
);

const ProfilePage = () => (
  <Box p={3}>
    <Typography variant="h4">Profile</Typography>
    <Typography>Manage your profile</Typography>
  </Box>
);

const SettingsPage = () => (
  <Box p={3}>
    <Typography variant="h4">Settings</Typography>
    <Typography>Configure system settings</Typography>
  </Box>
);

// Main Layout Component
function AdminLayout() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navItems = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { name: "Exams", icon: <ExamIcon />, path: "/exams" },
    { name: "Students", icon: <PeopleIcon />, path: "/students" },
    { name: "Reports", icon: <ReportIcon />, path: "/reports" },
  ];

  const dropdownItems = [
    { name: "Profile", icon: <UserIcon />, path: "/profile" },
    { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const notifications = [
    { id: 1, text: "New exam scheduled for tomorrow", time: "10 min ago" },
    { id: 2, text: "3 new student registrations", time: "1 hour ago" },
    { id: 3, text: "System maintenance scheduled", time: "2 days ago" },
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{ width: 250, height: "100%", bgcolor: "background.paper", pt: 1 }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.name}
            component={Link}
            to={item.path}
            selected={activeNav === item.name}
            onClick={() => {
              setActiveNav(item.name);
              setMobileOpen(false);
            }}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "rgba(25, 118, 210, 0.12)",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.16)",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: activeNav === item.name ? "primary.main" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

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
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: "white",
                textDecoration: "none",
                display: { xs: "none", sm: "block" },
              }}
            >
              ExamSync
            </Typography>
          </Box>

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
                component={Link}
                to={item.path}
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
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationMenuOpen}
              sx={{
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
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

            <IconButton
              size="large"
              color="inherit"
              sx={{
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
              }}
            >
              <Badge badgeContent={1} color="error">
                <EmailIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.15)" },
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
                  transform: Boolean(anchorEl)
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
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
              Admin User
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
            component={Link}
            to={item.path}
            sx={{
              py: 1.5,
              px: 2,
              "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
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
            "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.08)" },
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

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1.5,
            width: 350,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
            overflow: "visible",
            "&:before": {
              content: '""',
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
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" fontWeight="medium">
            Notifications
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleMenuClose}
              sx={{
                py: 2,
                px: 2,
                "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography variant="body1">{notification.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Box>

        <Divider />
        <Box sx={{ py: 1, textAlign: "center" }}>
          <Button color="primary">View all notifications</Button>
        </Box>
      </Menu>

      <Box component="main" sx={{ flexGrow: 1, pt: 8, px: 3 }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AdminLayout />
      </Router>
    </ThemeProvider>
  );
}

export default App;
