import React, { useState, useEffect } from "react";
import { Button, ListGroup, Badge } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { API } from "aws-amplify";
import Service from "../images/service.png";

const Services = () => {
  const { REACT_APP_API_URL } = process.env;
  const [ServiceList, setServiceList] = useState([]);
  useEffect(() => {
    getService();
  }, []);
  const deleteService = (id) => {
    API
      .post(REACT_APP_API_URL, `/service/deleteservice`, {
        body: {service_id: id,}
      })
      .then((res) => {
        getService();
      })
      .catch((e) => console.log(e));
  };
  const getService = () => {
    API
      .get(REACT_APP_API_URL, `/service/services`)
      .then((res) => {
        setServiceList(res.services || []);
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      <h3 className="mt-4 text-center">Service list</h3>
      <div class="d-flex" style={{ flexWrap: "wrap" }}>
        {ServiceList.map((ele) => (
          <Card style={{ width: "18rem", margin: "2%", padding: "15px" }}>
            <Card.Img variant="top" src={Service} />
            <div>
              <p className="mt-3">
                <b>{ele.service_type}</b>
              </p>
              <p>{ele.service_clientname}</p>
              <p>{ele.service_provider}</p>
              <p>{ele.service_tatus}</p>
              <p>{ele.service_charge}</p>
              <Badge pill bg="secondary">
                Status
              </Badge>{" "}
              <p className="text-center">
                <Button
                  onClick={() => deleteService(ele.service_id)}
                  variant="danger"
                >
                  Delete
                </Button>
              </p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Services;
