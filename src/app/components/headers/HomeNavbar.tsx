import React, { useEffect, useState } from "react";
import { Box, Button, Container, ListItemIcon, Menu, MenuItem, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";

interface HomeNavbarProps {
    cartItems: CartItem[];
    onAdd: (item: CartItem) => void;
    onRemove: (item: CartItem) => void;
    onDelete: (item: CartItem) => void;
    onDeleteAll: () => void;
    setSignupOpen: (isOpen: boolean) => void;
    setLoginOpen: (isOpen: boolean) => void;
    handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
    anchorEl: HTMLElement | null;
    handleCloseLogout: () => void;
    handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
    const { 
        cartItems, 
        onAdd, 
        onRemove, 
        onDelete, 
        onDeleteAll, 
        setSignupOpen, 
        setLoginOpen,
        handleLogoutClick,
        anchorEl,
        handleCloseLogout,
        handleLogoutRequest
    } = props;
    const { authMember } = useGlobals();
    
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });
      
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark-theme', newTheme === 'dark');
    };
      
    useEffect(() => {
        document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    }, [theme]);

    /* HANDLERS */
    
    return (
        <div className="home-navbar">
            <Container className="navbar-container">
                <Stack className="menu">
                    <Box>
                        <NavLink to="/">
                            {/* <img className="brand-logo" src="/icons/apple.svg"/>                     */}
                        </NavLink>
                    </Box>
                    <Stack className="links">
                        <Box className={"hover-line"}>
                            <NavLink to="/" activeClassName={"underline"}>
                                Home
                            </NavLink>
                        </Box>
                        <Box className={"hover-line"}>
                            <NavLink to="/products" activeClassName={"underline"}>
                                Products
                            </NavLink>
                        </Box>
                        { authMember ? (
                            <Box className={"hover-line"}>
                                <NavLink to="/orders" activeClassName={"underline"}>
                                    Orders
                                </NavLink>
                            </Box >
                        ) : null }
                        { authMember ? (
                            <Box className={"hover-line"}>
                                <NavLink to="/member-page" activeClassName={"underline"}>
                                    My Page
                                </NavLink>
                            </Box>
                        ) : null }
                        {/* { authMember ? (
                            <Box className={"hover-line"}>
                                <NavLink to="/about" activeClassName={"underline"}>
                                    About
                                </NavLink>
                            </Box>
                        ) : null } */}
                        <Box className={"hover-line"}>
                            <NavLink to="/help" activeClassName={"underline"}>
                                Help
                            </NavLink>
                        </Box>
                        <div className={"basket"}>
                            <Basket 
                                cartItems={cartItems} 
                                onAdd={onAdd} 
                                onRemove={onRemove} 
                                onDelete={onDelete} 
                                onDeleteAll={onDeleteAll}
                            />
                        </div>
                        <Box className="hover-line">
                            <button
                                className="theme-toggle"
                                onClick={toggleTheme}
                                aria-label="Toggle Dark/Light Mode"
                            >
                                {theme === "light" ? "🌙" : "☀️"}
                            </button>
                        </Box>
                        {!authMember ? (
                            <Box className={"hover-line"}>
                                <Button 
                                    className="login-button" 
                                    variant="contained"
                                    onClick={() => setLoginOpen(true)}
                                >
                                    Login
                                </Button>
                            </Box>
                        ) : (
                            <img className={"user-avatar"}
                                src={authMember?.memberImage 
                                    ? `${serverApi}/${authMember?.memberImage}` 
                                    : "/icons/default-user.svg"
                                }
                                aria-haspopup={"true"}
                                onClick={handleLogoutClick}
                            />
                        )}
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={Boolean(anchorEl)}
                            onClose={handleCloseLogout}
                            onClick={handleCloseLogout}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
		    		                        ml: -0.5,
			    	                        mr: 1,
			                            },
			                            '&:before': {
                                            content: '""',
                                            display: 'block',
				                            position: 'absolute',
				                            top: 0,
				                            right: 14,
    				                        width: 10,
	    			                        height: 10,
		    		                        bgcolor: 'background.paper',
			    	                        transform: 'translateY(-50%) rotate(45deg)',
				                            zIndex: 0,
			                            },
		                            },
	                            }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
	                        <MenuItem onClick={handleLogoutRequest}>
		                        <ListItemIcon>
			                        <Logout fontSize="small" style={{ color: 'blue' }} />
		                        </ListItemIcon>
		                            Logout
	                        </MenuItem>
                        </Menu>

                    </Stack>
                </Stack>
                <Stack className={"header-frame"}>
                    <Stack className={"detail"}>
                        <Box className={"head-main-txt"}>
                            Your Gateway to Premium Tech
                        </Box>
                        <Box className={"wel-txt"}>
                            Explore the latest devices with unbeatable deals
                        </Box>
                        <Box className={"service-txt"}>
                            Fast delivery & 24/7 customer support
                        </Box>
                        <Box className={"signup"}>
                            {!authMember ? ( 
                                <Button variant={"contained"} 
                                    className={"signup-button"} 
                                    onClick={() => setSignupOpen(true)}>
                                        Sign up
                                </Button>
                            ) : null}
                        </Box>
                    </Stack>
                    <Box className={"logo-frame"}>
                        <div className={"logo-img"}></div>
                    </Box>
                </Stack>
            </Container>
        </div>
    );
}
