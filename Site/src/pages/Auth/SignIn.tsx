import { Helmet } from "react-helmet-async";
import { urls, useRouting } from "routes";
import { Typography, makeStyles, Button } from '@material-ui/core';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { AppForm } from 'components/surfaces/AppForm';
import { TextField } from 'components/inputs/TextField';
import { FormFeedback } from 'components/surfaces/FormFeedback';
import { User } from 'models/User';
import firebase from 'firebase/app';
import "firebase/auth";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    button: {
        // borderRadius: 16,
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(1),
    },
    form: {
        marginTop: theme.spacing(6),
    },
    feedback: {
        marginTop: theme.spacing(2),
    },
}));

function getKeys<T>(obj: Record<keyof T, 1>): { [P in keyof T]: P } {
    return Object.fromEntries(Object.entries(obj).map(([k]) => [k, k])) as any;
}

const SignIn = () => {
    type LoginUser = Pick<User, "email" | "password">;
    // const { setUser } = useContext(UserContext);
    const classes = useStyles();
    const { routeTo } = useRouting();
    const [user,] = useState<LoginUser>({ password: "", email: "" });
    const [error, setError] = useState(false);
    const [stringError, setStringError] = useState("");

    const keys = getKeys<LoginUser>({
        email: 1,
        password: 1,
    });

    const handleSubmit = async (o: LoginUser) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(o.email, o.password);
            //close pop-up
            routeTo(urls.dashboard);
        }
        catch (error) {
            setError(true);
            setStringError(error.message);
        }
    }

    const validate = (values: LoginUser) => {
        const errors = {} as LoginUser;
        if (!values.email) {
            errors.email = 'Required'
        }
        if (!values.password) {
            errors.password = 'Required'
        }
        return errors
    }
    return <AppForm>
        <Helmet
            title="Login"
        />
        <React.Fragment>
            <Typography variant="h3" gutterBottom align="center">
                Sign In
            </Typography>
            {/* <Typography variant="body2" align="center">
                {'Not a member yet? '}
                <Link align="center" underline="always" onClick={() => { routeTo(urls.register) }}>
                    Sign Up here
                </Link>
            </Typography> */}
        </React.Fragment>
        <Form onSubmit={handleSubmit} subscription={{ submitting: true }} initialValues={user} validate={validate} >
            {({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit} className={classes.form} noValidate>

                    <Field name={keys.email}>
                        {({ input, meta }) => (
                            <div>
                                <TextField {...input} label="Email" meta={meta} fullWidth required />
                            </div>
                        )}
                    </Field>
                    <Field name={keys.password}>
                        {({ input, meta }) => (
                            <>
                                <TextField {...input} label="Password" meta={meta} type="password" autoComplete="none" fullWidth />
                            </>
                        )}
                    </Field>

                    {error && <FormFeedback className={classes.feedback} error>
                        {/* {submitError} */}
                        {stringError}
                    </FormFeedback>}
                    <Button
                        className={classes.button}
                        disabled={submitting}
                        size="large"
                        color="primary"
                        variant="contained"
                        type="submit"
                        fullWidth
                    >

                        {submitting ? "Loading ..." : "Sign In"}


                    </Button>
                    {/*
                    <Typography variant="body2" gutterBottom align="center">
                        or join with the following
                    </Typography>
                     <div style={{ display: "flex", justifyContent: "space-evenly", paddingTop: "20px", paddingBottom: "20px" }}>
                        <IconButton
                            onClick={async () => {
                                const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                                try {

                                    const data = await firebase.auth().signInWithPopup(googleAuthProvider);

                                    const firstName = data.user?.displayName?.split(" ")[0];
                                    const lastName = data.user?.displayName?.split(" ")[1];
                                    const userDoc = firebase.firestore().collection("users").doc(data.user?.uid).get();
                                    const userDocRequest = await userDoc;
                                    if (!userDocRequest.exists) {
                                        firebase.firestore().collection("users").doc(data.user?.uid).set({
                                            firstName,
                                            lastName
                                        });
                                    }
                                    routeTo(urls.shop);
                                } catch (er) {
                                    console.log(er.message);
                                }
                            }}
                            style={{ backgroundColor: "#dd4b39" }} title="Google">
                            <SvgIcon fontSize="large" style={{ color: "white" }}>
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google icon</title><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" /></svg>
                            </SvgIcon>
                        </IconButton>
                        <IconButton
                            onClick={async () => {
                                const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
                                try {
                                    const data = await firebase.auth().signInWithPopup(facebookAuthProvider);
                                    const firstName = data.user?.displayName?.split(" ")[0];
                                    const lastName = data.user?.displayName?.split(" ")[1];
                                    const userDoc = firebase.firestore().collection("users").doc(data.user?.uid).get();
                                    const userDocRequest = await userDoc;
                                    if (!userDocRequest.exists) {
                                        firebase.firestore().collection("users").doc(data.user?.uid).set({
                                            firstName,
                                            lastName
                                        });
                                    }

                                    routeTo(urls.shop);
                                }
                                catch (er) {
                                    console.log(er.message);
                                }
                            }}
                            style={{ backgroundColor: "#3b5998" }} title="Facebook">
                            <FacebookIcon fontSize="large" style={{ color: "white" }} />
                        </IconButton>
                    </div> */}
                </form>
            )}
        </Form>
    </AppForm>
}
export default SignIn;