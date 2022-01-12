import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom"
import Choice from "../images/choice.png"
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom"

const { REACT_APP_API_URL } = process.env;

const ClientHome = () => {
  const [departmentList, setDepartmentList] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    API
      .get(REACT_APP_API_URL, `/department/departments`)
      .then((res) => {
        setDepartmentList(res.departments || []);
      })
      .catch((e) => console.log(e));
  }, []);

  const goToProviderList = (ele) => {
    navigate(`/list_provider/${ele.department_id}`, {
      state: { name: ele.department_name, id: ele.department_id }
    })
  }

  return (
    <div className="mt-2 p-3">
      <h3>Please select department</h3>
      <div className="d-flex mt-3">

      {departmentList.map((ele) => (
        <Card key={ele.department_id} style={{ width: "250px", marginRight: '15px' }}>
          <Card.Img variant="top" src={Choice} />
          <Card.Body>
            <Card.Title>{ele.department_name}</Card.Title>
            <div onClick={() => goToProviderList(ele)} className="text-primary">
              View providers
            </div>
          </Card.Body>
        </Card>
      ))}
      </div>
    </div>
  );
};

export default ClientHome;
