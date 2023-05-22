import React, {useState} from 'react';
import {Button, ButtonGroup, Container, Form, FormControl, FormGroup} from "react-bootstrap";
import {Notify} from "notiflix";
import {useNavigate} from "react-router-dom";
import AuthService from "../Services/auth.service";

function RegistrationForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [isUserType, setIsUserType] = useState(false);
    const [isOwnerType, setIsOwnerType] = useState(false);
    const [userTypeError, setUserTypeError] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleFirstnameChange = (event) => {
        setFirstname(event.target.value);
    };

    const handleLastnameChange = (event) => {
        setLastname(event.target.value);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isUserType && !isOwnerType) {
            setUserTypeError('This field is required.');
            return;
        }

        const role = (isUserType) ? 'USER' : 'OWNER';

        AuthService.register(role,
            email,
            password,
            firstname,
            lastname)
            .then((response) => {
            setEmail('');
            setPassword('');
            setFirstname('');
            setLastname('');
            Notify.success("Thank you for filling out our sign up form. We are glad that you joined us");
            navigate('/login');
        }).catch((error) => {
            console.error('Error:', error);

        });
    };


    return (
        <Container className="col-xl-3 col-lg-5 col-md-5 col-xl-6 col-10 mt-5 p-4 border rounded shadow">


            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Form.Label>First name:</Form.Label>
                    <FormControl type="name" placeholder="" value={firstname} required
                                 onChange={handleFirstnameChange}/>
                </FormGroup>
                <FormGroup>
                    <Form.Label>Last name:</Form.Label>
                    <FormControl type="name" placeholder="" value={lastname} required
                                 onChange={handleLastnameChange}/>
                </FormGroup>

                <FormGroup>
                    <Form.Label>Username:</Form.Label>
                    <FormControl type="name" placeholder="" value={username} required
                                 onChange={handleUsernameChange}/>
                </FormGroup>

                <FormGroup>
                    <Form.Label>Password:</Form.Label>
                    <FormControl type="password" placeholder="" value={password} required
                                 onChange={handlePasswordChange}/>
                </FormGroup>

                <FormGroup>
                    <Form.Label>Email:</Form.Label>
                    <FormControl type="email" placeholder="" value={email} required
                                 onChange={handleEmailChange}/>
                </FormGroup>
                <div className="mt-3">
                    <ButtonGroup aria-label="Type" className="d-flex">
                        <Button variant="light" active={isUserType} onClick={() => {
                            setIsUserType(true);
                            setIsOwnerType(false);
                        }}>User</Button>
                        <Button variant="light" active={isOwnerType} onClick={() => {
                            setIsOwnerType(true);
                            setIsUserType(false);
                        }}>Owner</Button>
                    </ButtonGroup>
                    <div className="text-danger">{userTypeError}</div>
                </div>

                <div className="d-grid gap-2 mt-3">
                    <Button variant={"primary"} size="lg" type="submit">Register</Button>
                </div>

            </Form>
        </Container>
    );
}

export default RegistrationForm;
