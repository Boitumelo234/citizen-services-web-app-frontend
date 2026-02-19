import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function Login() {
    return (
        <section>
            <h2>Login</h2>
            <Input label="Username" />
            <Input label="Password" type="password" />
            <Button text="Login" />
        </section>
    );
}

export default Login;