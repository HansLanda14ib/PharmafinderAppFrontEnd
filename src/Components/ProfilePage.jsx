import React from "react";
import AuthService from "../Services/auth.service";
import { Container, Form, FormControl, FormGroup} from "react-bootstrap";

const Profile = () => {
    const currentUser = AuthService.getCurrentUser();
    console.log(currentUser)

    return (
        <Container className="col-xl-3 col-lg-5 col-md-5 col-xl-6 col-10 mt-5 p-4 border rounded shadow">

            <Form>
                <FormGroup>
                    <Form.Label>First name:</Form.Label>
                    <FormControl type="name" placeholder="" value={currentUser?.firstName} readOnly={true}
                              />
                </FormGroup>
                <FormGroup>
                    <Form.Label>Last name:</Form.Label>
                    <FormControl type="name" placeholder="" value={currentUser?.lastName} readOnly={true}
                    />
                </FormGroup>
                <FormGroup>
                    <Form.Label>Email:</Form.Label>
                    <FormControl type="name" placeholder="" value={currentUser?.email} readOnly={true}
                                />
                </FormGroup>

                <FormGroup>
                    <Form.Label>Role:</Form.Label>
                    <FormControl type="name" placeholder="" value={currentUser?.role} readOnly={true}
                               />
                </FormGroup>


            </Form>
        </Container>
    );
};

export default Profile;