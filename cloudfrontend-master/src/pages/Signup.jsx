import React, { useEffect, useState } from "react";
import styles from "../styles/signup.module.css";
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import Axios from "axios";

const { REACT_APP_API_URL } = process.env

const Signup = (props) => {
  const [departmentList, setDepartmentList] = useState([])
  const [values, setValues] = useState({
    name: "",
    department: "",
    Email: "",
    Password: "",
    Username: "",
    ConfirmPassword: "",
    loginType: "ServiceProvider",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    Axios.get(`http://ec2-3-86-205-247.compute-1.amazonaws.com:3000/department/departments`).then(res => {
      setDepartmentList(res.data.departments || [])
    }).catch(e => console.log(e))
  }, [])

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSignup = () => {
    if (
      !values.Password||
      !values.Username ||
      !values.name ||
      !values.Email
    ) {
      setError("Email, username, name and password are mandatory to fill!");
      return;
    }
    if (values.Password !== values.ConfirmPassword) {
      setError("Password and confirm password should match!");
      return;
    }
    setLoading(true)
    Auth.signUp({
      username: values.Username,
      password: values.Password,
      attributes: {
        email: values.Email,
        name: values.name,
        "custom:userType": values.loginType,
      },
    }).then(async(res) => {
      let departmentObj = departmentList.find(ele => ele.department_id === values.department)
      await API.post(REACT_APP_API_URL, `/user/adduser`, {
        body: {user_id: res.userSub,
        user_type: values.loginType,
        user_name: values.name,
        user_email: values.Email,
        department_id: values.department,
        department_name: departmentObj?.department_name || "",}
      })
      setLoading(false)
      navigate("/login")
    }).catch((err) => {
      setLoading(false)
      setError(err.message)
    });
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.title}>Sign Up</div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.form}>
        <div>
          Username
          <br />
          <input
            type="text"
            name="Username"
            className={styles.input}
            onChange={handleChange}
          />
        </div>
        <div>
          Name
          <br />
          <input
            type="text"
            name="name"
            className={styles.input}
            onChange={handleChange}
          />
        </div>
        <div>
          Email
          <br />
          <input
            type="text"
            name="Email"
            className={styles.input}
            onChange={handleChange}
          />
        </div>
        <div>
          User type
          <br />
          <select
            name="loginType"
            className={`form-control mt-2 ${styles.input} ${styles.select}`}
            onChange={handleChange}
          >
            <option value="ServiceProvider">Service Provider</option>
            <option value="Client">Client</option>
          </select>
        </div>
        {values.loginType === "ServiceProvider" ? <div>
          Department
          <br />
          <select
            name="department"
            className={`form-control mt-2 ${styles.input} ${styles.select}`}
            onChange={handleChange}
          >
            <option value="">Select Option</option>
            {departmentList.map(ele => (
              <option key={ele.department_id} value={ele.department_id}>{ele.department_name}</option>
            ))}
          </select>
        </div> : <div />}
        <div />
        <div>
          Password
          <br />
          <input
            type="text"
            name="Password"
            className={styles.input}
            onChange={handleChange}
          />
        </div>
        <div>
          Confirm password
          <br />
          <input
            type="text"
            name="ConfirmPassword"
            className={styles.input}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.submitContainer}>
        <button className={styles.signUpButton} disabled={loading} onClick={handleSignup}>
          Sign Up
        </button>
      </div>
      <div className="text-center mt-4 w-100">Already a member ? <Link to="/login">Login here</Link></div>
    </div>
  );
};

export default Signup;
