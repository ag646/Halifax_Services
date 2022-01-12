import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify"
import styles from "../styles/viewUser.module.css";
import { useLocation, useNavigate } from "react-router";
import { Button, Card } from "react-bootstrap"
import { API } from "aws-amplify";
import Service from "../images/service.png";

const { REACT_APP_API_URL } = process.env

const ProviderDetails = () => {
  const [userData, setUserData] = useState({});
  const [works, setWorks] = useState([]);
  const [values, setValues] = useState({
    service_type: "",
    service_charge: ""
  })
  
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    getUserInfo()
  }, [])
  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  const addService = () => {
    let params = {
      service_id: `${Date.now()}`,
      service_type: values.service_type,
      service_charge: values.service_charge,
      service_status: "Requested",
      provider_id: location.state.user_id,
      provider_name: location.state.user_name,
      provider_email: location.state.user_email,
      client_id: userData.sub,
      client_name: userData.name,
      client_email: userData.email,
    }
    API.post(REACT_APP_API_URL, `/service/addservice`, {body: params}).then(res => {
      setValues({ service_charge: "", service_type: "" })
    })
  }

  const getUserInfo = async () => {
    try {
      let data = await Auth.currentAuthenticatedUser().catch(err => ({}))
      setUserData(data?.attributes || {});
      API
        .post(REACT_APP_API_URL, `/service/provider_services`, {
          body: {provider_id: location.state.user_id,
          service_status: "Finished"}
        })
        .then((res) => {
          setWorks(res.services || []);
        })
        .catch((e) => console.log(e));
    } catch (err) {
      console.log(err);
    }
  }

  const goBack = () => navigate("/client_home")

  return (
    <div>
      <div className={styles.userBanner}>
        <div className="mb-2 cursor-pointer" onClick={goBack}><b>&emsp;&lt;&emsp;Back</b></div>
        <div className="d-flex align-items-center">
          <img
            src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairDreads01&accessoriesType=Kurt&hairColor=Black&facialHairType=BeardMajestic&facialHairColor=Red&clotheType=ShirtVNeck&clotheColor=Heather&eyeType=Default&eyebrowType=AngryNatural&mouthType=Sad&skinColor=Tanned"
            alt="Avatar"
            className={styles.imageHeight}
          />
          <div>
            <b>{location.state.user_name}</b>
            <br />
            {location.state.user_email}
          </div>
        </div>
      </div>
      <div>
        <h3 className="mt-4 text-center">Propose new work</h3>
        <div className={styles.cardContainer}>
        <div>
          Service Type
          <br />
          <input
            type="text"
            name="service_type"
            value={values.service_type}
            // className={styles.input}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          Service Charge
          <br />
          <input
            type="text"
            name="service_charge"
            value={values.service_charge}
            // className={styles.input}
            onChange={handleChange}
          />
        </div>
        <br />
        <Button variant="primary" onClick={addService}>Propose a work</Button>
        </div>
        <br />
      <div className="d-flex my-3 px-5" style={{ flexWrap: "wrap" }}>
        {works.length > 0 ? works.map((ele) => (
          <Card
            key={ele.department_id}
            style={{ width: "250px", marginRight: "15px" }}
          >
            <Card.Img variant="top" src={Service} />
            <Card.Body>
              <Card.Title className="d-flex align-items-center justify-content-between">
                <div>{ele.service_type}</div>
                <div>{ele.service_charge}</div>
              </Card.Title>
            </Card.Body>
          </Card>
        )) : "Nothing to show."}
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;
