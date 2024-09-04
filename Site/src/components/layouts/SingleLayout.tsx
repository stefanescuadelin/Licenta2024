import { Grid } from "@material-ui/core";

const SingleLayout: React.FC = ({ children }) => {
    return (
        <Grid container style={{
            padding: "25px"
        }}>
            <Grid item xs={12}>
                {children}
            </Grid>
        </Grid>
    )
}

export default SingleLayout;
