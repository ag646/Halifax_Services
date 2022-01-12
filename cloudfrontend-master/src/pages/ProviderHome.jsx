import React, { useEffect, useState } from "react";
import Service from "../images/service.png";
import { Card, Badge, Button } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";

const { REACT_APP_API_URL } = process.env;

const ProviderHome = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    getServiceInfo();
  }, []);

  const getServiceInfo = async () => {
    let data = await Auth.currentAuthenticatedUser().catch((err) => ({}));
    if (data?.attributes.sub) {
      API
        .post(REACT_APP_API_URL, `/service/provider_services`, {
          body: {provider_id: data?.attributes.sub,}
        })
        .then((res) => {
          setWorks(res.services || []);
        })
        .catch((e) => console.log(e));
    }
  };

  const changeStatus = (ele, status) => {
    API
      .patch(REACT_APP_API_URL, `/service/modifyservice`, {
        service_id: ele.service_id,
        updateKey: "service_status",
        updateValue: status,
        service_type: ele.service_type,
      })
      .then((res) => {
        getServiceInfo();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="mt-2 p-3">
      <h3>Your works</h3>
      <div className="d-flex mt-3" style={{ flexWrap: "wrap" }}>
        {works.map((ele) => (
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
              <div className="mt-4">
                Client details:
                <br />
                <p>
                  {ele.client_name}
                  <br />
                  <span className="text-secondary">{ele.client_email}</span>
                  <Badge pill bg="secondary">
                    {ele.service_status}
                  </Badge>
                </p>
              </div>
              <div className="text-primary">
                {ele.service_status === "Requested" ? (
                  <>
                    <Button
                      variant="outline-primary"
                      onClick={() => changeStatus(ele, "InProgress")}
                    >
                      Accept
                    </Button>
                    &emsp;
                    <Button
                      variant="outline-primary"
                      onClick={() => changeStatus(ele, "Rejected")}
                    >
                      Reject
                    </Button>
                  </>
                ) : ele.service_status === "InProgress" ? (
                  <Button
                    variant="outline-primary"
                    onClick={() => changeStatus(ele, "Finished")}
                  >
                    Mark as Finish
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderHome;
