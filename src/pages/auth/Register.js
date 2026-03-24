import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function Register() {
    return (
        <section>
            <h2>Register</h2>
            <Input label="Username" />
            <Input label="Password" type="password" />
            <Button text="Register" />
        </section>
    );
}

export default Register;