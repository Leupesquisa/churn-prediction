import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "./../../services/authServices";
import { ACCESS_TOKEN } from "../../services/constants"; // Importando a constante
import "./Login.css";
import LoadingIndicator from "./../LoadingIndicator";
import logo from "./../../assets/logo.png";

function Form({ method }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // Adiciona o campo de email
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // Novo estado para a notificação de sucesso
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null); // Resetar a mensagem de sucesso ao submeter o formulário

        if (!username || !password || (method === "register" && !email)) {
            setErrorMessage("All fields are required.");
            setLoading(false);
            return;
        }

        try {
            const data = { username, password };
            if (method === "register") {
                data.email = email;
                await authService.register(data); // Usando authService para registro
                setSuccessMessage("User registered successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1000); // Redireciona para o login após 3 segundos
            } else {
                const res = await authService.login(data); // Usando authService para login
                localStorage.setItem(ACCESS_TOKEN, res.token);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Invalid username or password.");
            } else if (error.response && error.response.status === 400) {
                setErrorMessage("Validation error. Please check your input.");
            } else {
                setErrorMessage("An error occurred during the submission. Please try again.");
            }
            console.error('Failed to process the form', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit} className="form-container">
                <Link to='/login'>
                    <img
                        className="login__logo"
                        src={logo}
                        alt="Logo"
                    />
                </Link>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>} {/* Exibe a notificação de sucesso */}

                <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    autoComplete="off" 
                />
                {method === "register" && (
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        autoComplete="off" 
                    />
                )}
                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    autoComplete="off" 
                />
                {loading && <LoadingIndicator />}
                <button className="form-button" type="submit">
                    {name}
                </button>

                <p style={{ textAlign: 'justify', wordBreak: 'break-word' }}>This project was developed by <b>Leu Manuel</b> for educational purposes. All data used is solely for demonstration.</p>

                {method === "login" && (
                    <Link to="/register">
                        <button type="button" className="form-buttonreg">
                            Create your Account
                        </button>
                    </Link>
                )}
            </form>
        </div>
    );
}

export default Form;