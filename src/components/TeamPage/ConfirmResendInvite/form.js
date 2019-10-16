import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Mutation, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import { Formik } from "formik";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  nameContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  button: {
    margin: theme.spacing(1)
  }
}));

export default function ConfirmDeleteForm(props) {
  const classes = useStyles();

  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={gql`
              mutation ResentPasswordRequest($email: String!) {
                resetPasswordRequest(email: $email) {
                  errors
                }
              }
            `}
          >
            {(resetPasswordRequest, { loading, error }) => {
              return (
                <Formik
                  onSubmit={(values, actions) => {
                    // call mutation here
                    resetPasswordRequest({
                      variables: {
                        email: props.user.email
                      }
                    }).then(
                      response => {
                        actions.setSubmitting(false);
                        // refetch users
                        client.query({
                          query: gql`
                            {
                              accountUsers {
                                id
                                firstName
                                lastName
                                email
                                thnxCredits
                                last7DaysGivingActivity
                                isAdmin
                                lastSignInAt
                                resetPasswordSentAt
                              }
                            }
                          `,
                          fetchPolicy: "network-only"
                        });
                        client.query({
                          query: gql`
                            {
                              unassignedThnx {
                                id
                              }
                            }
                          `,
                          fetchPolicy: "network-only"
                        });
                        props.handleClose();
                      },
                      error => {
                        console.log(error);
                        actions.setSubmitting(false);
                        actions.setErrors(error);
                      }
                    );
                  }}
                >
                  {formProps => {
                    const { handleSubmit } = formProps;

                    return (
                      <form
                        onSubmit={handleSubmit}
                        className={classes.form}
                        noValidate
                      >
                        <Typography>
                          Do you want to resend invite to {props.user.firstName}
                          ?
                        </Typography>

                        <div className={classes.nameContainer}>
                          <Button
                            variant="contained"
                            color="default"
                            fullWidth
                            onClick={props.handleClose}
                            className={classes.button}
                          >
                            Cancel
                          </Button>
                          <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                          >
                            Yes
                          </Button>
                        </div>
                      </form>
                    );
                  }}
                </Formik>
              );
            }}
          </Mutation>
        );
      }}
    </ApolloConsumer>
  );
}
