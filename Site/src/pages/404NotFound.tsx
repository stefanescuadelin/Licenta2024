import { Button, Grid } from "@material-ui/core";
import React from "react";
import { Helmet } from "react-helmet-async";
import { urls, useRouting } from "routes";

const NotFound = () => {
    const { routeTo } = useRouting();
    return <React.Fragment>
        <Helmet
            title="404 Not Found"
        />
        <Grid container alignItems="center" direction="column" justify="center" style={{ height: "100%" }}>
            <Grid item >
                <img src={process.env.PUBLIC_URL + "not_found.jpg"} alt="Not Found"></img>
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" onClick={() => {
                    routeTo(urls.dashboard);
                }}>Take me back</Button>
            </Grid>
        </Grid>
    </React.Fragment>
}
export default NotFound;