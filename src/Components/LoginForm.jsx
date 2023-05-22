import {Button, Container, Form, FormControl, FormGroup} from "react-bootstrap";
import React, {useState} from "react";
import {Notify} from 'notiflix/build/notiflix-notify-aio';
import AuthService from "../Services/auth.service";


export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    function submit(event) {
        event.preventDefault();
        AuthService.login(email, password).then(() => {
            setEmail('');
            setPassword('');
            window.location.reload();
            Notify.success('Successful login', {
                position: 'center-bottom',
            });

        }).catch((error) => {
            if (error.response.status === 403) {
                Notify.failure('Your username or password is invalid');
            }
            const errors = error.response.data;
            setEmailError(errors['email']);
            setPasswordError(errors['password']);
            setPassword('');
        });
    }

    return (
        <>
            <Container className="col-xl-3 col-lg-4 col-md-5 col-sm-6 col-10 mt-5 p-4 border rounded shadow">
                <Form onSubmit={submit}>
                    <FormGroup>
                        <Form.Label>Email:</Form.Label>
                        <FormControl type="email" placeholder="" value={email} required
                                     onChange={(e) => setEmail(e.target.value.trim())}/>
                        <div className="text-danger">{emailError}</div>
                    </FormGroup>

                    <FormGroup>
                        <Form.Label>Password:</Form.Label>
                        <FormControl type="password" placeholder="" value={password} required
                                     onChange={(e) => setPassword(e.target.value.trim())}/>
                        <div className="text-danger">{passwordError}</div>
                    </FormGroup>


                    <div className="d-grid gap-2 mt-3">
                        <Button variant={"primary"} size="lg" type="submit">Login</Button>
                    </div>
                </Form>
            </Container>
        </>
    )
}