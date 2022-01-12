import React, { useState } from "react";
import { Auth } from "aws-amplify"
import styles from "../styles/login.module.css";
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"

const Login = (props) => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSignin = () => {
    if (
      !values.username||
      !values.password
    ) {
      setError("Username and password are mandatory to fill!");
      return;
    }
    setError("")
    setLoading(true)
    Auth.signIn({
      username: values.username,
      password: values.password,
    })
      .then((res) => {
        setLoading(false)
        let homePage = res?.attributes?.["custom:userType"] === "ServiceProvider" ? "/provider_home" : "/client_home";
        navigate(homePage)        
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        setError(err.message)
      });
  };

  return (
    <div className={styles.signinContainer}>
      <div className={styles.title}>Login</div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.form}>
        <div>
          <input type="text" name="username" placeholder="Username" className={styles.input} onChange={handleChange} />
        </div>
        <div>
          <input type="text" name="password" placeholder="Password" className={styles.input} onChange={handleChange} />
        </div>
      </div>
        <div className={styles.submitContainer}>
          <button className={styles.signinButton} disabled={loading} onClick={handleSignin}>Sign in</button>
        </div>
      <div className="text-center mt-4 w-100">Not a member ? Join us from <Link to="/signup">here</Link></div>
    </div>
  );
};

export default Login;
