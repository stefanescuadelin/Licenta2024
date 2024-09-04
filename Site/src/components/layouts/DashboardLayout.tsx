import { IconButton, Theme, Typography, useMediaQuery } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import axios from "axios"

import { Hidden, Drawer } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
const drawerWidth = 200;


// "http://openweathermap.org/img/w/" + iconcode + ".png"
type OpenWeatherResult = {
    "coord": {
        "lon": number,
        "lat": number
    },
    "weather": {
        "id": number,
        "main": string,
        "description": string,
        "icon": string
    }[],
    "base": string,
    "main": {
        "temp": number,
        "feels_like": number,
        "temp_min": number,
        "temp_max": number,
        "pressure": number,
        "humidity": number
    },
    "visibility": number,
    "wind": {
        "speed": number,
        "deg": number
    },
    "clouds": {
        "all": number
    },
    "dt": number,
    "sys": {
        "type": number,
        "id": number,
        "country": string,
        "sunrise": number,
        "sunset": number
    },
    "timezone": number,
    "id": number,
    "name": string,
    "cod": number
}

const DashboardMenu = () => {
    const [currentWeather, setCurrentWeather] = useState<OpenWeatherResult>(null!);

    const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    useEffect(() => {
        (async () => {
            const req = await axios.get("https://api.openweathermap.org/data/2.5/weather?q=Timisoara,ro&appid=ecad73dd2ba0dc0218b66b01e661f780&units=metric");
            console.log(req.data);
            setCurrentWeather(req.data);
        })();
    }, []);
    const hasWeather = currentWeather && currentWeather.weather && currentWeather.weather.length > 0

    return <div style={{
        width: drawerWidth,
        maxWidth: drawerWidth,
        background: "lightblue",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        padding: "10px",
        color: "white",
        height: sm ? "100%" : "auto"
        // height: "calc(100% - 20px)",
        // height:"auto"
    }}>
        {currentWeather && <React.Fragment>
            <div>
                <h1>{Math.floor(currentWeather.main.temp)}&deg;C</h1>
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    {hasWeather && <img id="wicon" src={`https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`} alt="Weather icon" />}
                    <Typography variant="inherit" gutterBottom>
                        {hasWeather && currentWeather.weather[0].description}
                    </Typography>
                </div>

            </div>
        </React.Fragment>}
    </div>
}
const DrawerContainer = (p: {
    openState: [boolean, React.Dispatch<boolean>]
}) => {
    const [open, setOpen] = p.openState
    //   const [open, setOpen] = useContext(DrawerControllsContext);
    // const [open, setOpen] = useState(true);
    return <Fragment>
        <Hidden mdUp>
            <Drawer
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <DashboardMenu />
            </Drawer>
        </Hidden>
        <Hidden xsDown>
            <DashboardMenu />
        </Hidden>
    </Fragment>
}

const DashboardLayout: React.FC = ({ children }) => {
    const [open, setOpen] = useState(false);
    const md = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex"
        }}>
            <div style={{ position: "absolute", display: md ? "block" : "none" }}>
                <IconButton size="small"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <MenuIcon
                    />
                </IconButton>
            </div>

            <DrawerContainer openState={[open, setOpen]} />
            <div style={{
                width: md ? "100vw" : `calc(100vw - ${drawerWidth}px)`,
                // backgroundColor: "#e3efee",
            }}>
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout;
