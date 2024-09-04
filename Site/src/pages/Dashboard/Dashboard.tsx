import { Fragment, useContext, useState } from "react"
import { Helmet } from "react-helmet-async";
import { UserContext } from "../../contexts/UserContext"
import firebase from "firebase/app";
import { useEffect } from "react";
import { createStyles, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, LinearProgress, Switch, Theme, Typography, useMediaQuery, withStyles } from "@material-ui/core";
import { useMemo } from "react";
import { io } from "socket.io-client";
// import { Line } from "react-chartjs-2";

// import { LineChart, Line, CartesianGrid, YAxis, ResponsiveContainer, } from 'recharts';
import { useSizes } from "hooks/useSizes";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import Gauge from 'react-svg-gauge';
import axios from "axios";
import { raspberryUrl } from "services/config";
const barsColor = "#80ace4";
const speedometerWidth = 100;
const BorderLinearProgress = withStyles((theme) =>
    createStyles({
        root: {
            height: 10,
            // borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            // borderRadius: 5
            backgroundColor: barsColor,
        },
    }),
)(LinearProgress);

type SpeedometerDetailsProps = {
    name: string;
    percent: number;
}
const SpeedometerDetails = ({ name, percent }: SpeedometerDetailsProps) => {

    return <>
        <Typography component="h1" variant="body1" align="center" style={{
            fontWeight: "bold"
        }}>
            {name}
        </Typography>
        <BorderLinearProgress variant="determinate" value={percent} style={{
            width: `${speedometerWidth}px`
        }} />
        <Typography component="h1" variant="body1" align="center" >
            {percent}%
        </Typography>
    </>
}

type DatabaseType = {
    Distance: {
        key1: number;
    }
    Temperature: {
        key2: number;
    }
    "Gas Sensor": {
        key3: number;
    }
    "Soil Moisture": {
        key4: number;
    },
    Alarma: {
        key5: number;
    }
}
const ArraySize = 30;

const GaugeMeter = ({
    gaugeTitle,
    value,
    gaugeWidth,
    md, sm,
    max, min,
    unit
}: {
    gaugeTitle: string;
    unit: string;
    value: number;
    gaugeWidth: number;
    md: boolean
    sm: boolean
    max?: number;
    min?: number;
}) => {
    const Meter = useMemo(() => {
        if (value === null || value === undefined) {
            return <div />;
        }
        return <div className="speedometer">
            <Gauge
                value={value}
                width={md ? (
                    sm ? gaugeWidth - 100 : 320
                ) : 33 * gaugeWidth / 100}
                height={md ? 250 : 400}
                max={max}
                min={min}
                label={gaugeTitle}
                color={barsColor}
                valueLabelStyle={{
                    fontSize: "40px",
                }}
                valueFormatter={val => `${val} ${unit}`}
            />
        </div>;
    }, [value, unit, md, sm, gaugeWidth, max, min, gaugeTitle]); 

    return <Fragment>
        {Meter}
    </Fragment>
}

type Pin = {
    name: string;
    label: string;
    getValue?:(x:boolean) => boolean;
}

const pins: Pin[] = [{
    name: "led1",
    label: "Dormitor",
}, {
    name:"led2",
    label: "Living"
}, {
    name: "led3",
    label: "Bucatarie"
}, {
    name:"led4",
    label: "Ventilator",
    getValue: x => !x,
}, {
    name:"led5",
    label: "Stropitori",
    getValue: x => !x,
}];


function getPinByName(pin:string){
    return pins.find(x => x.name === pin)!;
}


const Dashboard = () => {
    const database = firebase.database();
    const { user } = useContext(UserContext);
    const [rtDatabase, setRtDatabase] = useState<DatabaseType>(null!);
    const [cc, setCC] = useState<any[]>(new Array(ArraySize).fill({}))
    const [switchValues, setSwitchValues] = useState(
        Object.fromEntries(
            Object
                .entries(pins)
                .map(([k, v]) => [v.name, { ...v, value: false }])
        ));
    useEffect(() => {
        (async () => {
            const r = await axios.get(`${raspberryUrl}/api/led/status`);
            const data = r.data as Record<string, "on" | "off">;
            setSwitchValues(value => {
                const s = { ...value };
                Object.entries(data).forEach(([k, v]) => {
                    const valueGetter = getPinByName(k).getValue || function(x){return x};
                    s[k].value = valueGetter(v === "on");
                });
                return s;
            });


        })()
    }, []);

    useEffect(() => {
        (async () => {
            const dbRef = database.ref();
            console.log("dbRef", dbRef);
            const data = await dbRef.get();
            console.log("data", data.val());
            dbRef.on('value', (a) => {
                console.log(a.val());

                const val = a.val() as DatabaseType;
                setCC(value => {
                    const s = [...value]
                    s.shift();
                    return [...s, {
                        "uv": val.Temperature.key2,
                    }];
                })
                setRtDatabase(val);
            })
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const { width } = useSizes({
        elemId: "main-container",
        onResize: true,
    }, [rtDatabase]);

    const md = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const switchHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = getPinByName(e.target.name);
    const realValue = pin.getValue ? pin.getValue(e.target.checked) : e.target.checked;
        setSwitchValues(value => {
            const s = { ...value };
            s[e.target.name].value = e.target.checked;
            return s;
        });
        
        await axios.post(`${raspberryUrl}/api/led/${e.target.name}/`,{
            status: realValue ? "on" : "off"
        });


    }

    if (!rtDatabase) {
        return <div />;
    }
    return <div id="main-container" style={{
        padding: "30px",
        height: "calc(100% - 60px)",
    }}>
        <Helmet
            title="Dashboard"
        />
        <div style={{
            marginBottom: "10px"
        }}>
            Welcome {`${user?.firstName} ${user?.lastName}`}  to the Dashboard
        </div>

        <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "30px",
            width: width - 60,
            backgroundColor: "white",
            borderRadius: 5
        }}>
            <ResponsiveContainer width="100%" height={200} >
                <LineChart data={cc} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} throttleDelay={0}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" isAnimationActive={false} />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <YAxis />
                </LineChart>
            </ResponsiveContainer>
        </div>

        <div style={{
            backgroundColor: "white",
            borderRadius: 5,
            marginBottom: "30px",
            // display: "none",
        }}>
            <Typography variant="h5">
                {rtDatabase.Distance.key1 === 0 ? "Garaj Neocupat" : "Garaj Ocupat"}
            </Typography>
            
            <Typography variant="h5">
                {rtDatabase["Soil Moisture"].key4}
            </Typography>
            <Typography variant="h5">
                {rtDatabase["Gas Sensor"].key3 === 0 ? "Gaz Absent" : "Gaz Prezent"}
            </Typography>
            <Typography variant="h5">
                {rtDatabase.Alarma.key5 === 0 ? "Nicio persoana detectata": "Persoana detectata" }
            </Typography>
        
        </div>
        <div style={{
            backgroundColor: "white",
            borderRadius: 5,
            padding: "20px",
            marginBottom: "15px",
        }}>
            <FormControl component="fieldset">
                <FormLabel component="label">Luminiile sistemului</FormLabel>
                <FormGroup>
                    {pins.map(pin => <FormControlLabel key={pin.name}
                        control={<Switch color="primary" checked={switchValues[pin.name].value} onChange={switchHandler} name={pin.name} />}
                        label={pin.label}
                    />)}
                    {/* <FormControlLabel
                        control={<Switch color="primary" onChange={switchHandler} name="led1" />}
                        label="Hol"
                    />
                    <FormControlLabel
                        control={<Switch color="primary" onChange={switchHandler} name="led2" />}
                        label="Bucatarie"
                    />
                    <FormControlLabel
                        control={<Switch color="primary" onChange={switchHandler} name="led3" />}
                        label="Baie"
                    /> */}
                </FormGroup>
            </FormControl>
        </div>
    </div>
}
export default Dashboard
