import { API } from "aws-amplify";
import { Card } from "react-bootstrap";
import ProviderImg from "../images/provider.png";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { REACT_APP_API_URL } = process.env;

const ListProvider = () => {
  const [userList, setUserList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate()

  const viewProvider = (ele) => {
    navigate(`/view_provider/${ele.user_id}`, {
      state: ele
    })
  }

  useEffect(() => {
    API
      .get(REACT_APP_API_URL, `/user/users`)
      .then((res) => {
        setUserList(res.users || []);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="mt-2 p-3">
      <h3>{location.state.name}</h3>
      <div className="d-flex mt-3">
        {userList?.map(
          (ele) =>
            ele.department_id == location.state.id && (
              <Card
                onClick={() => viewProvider(ele)}
                key={ele.department_id}
                style={{ width: "250px", marginRight: "15px" }}
              >
                <Card.Img variant="top" src={ProviderImg} />
                <Card.Body>
                  <Card.Title>{ele.user_name || "name"}</Card.Title>
                  <div className="text-secondary">{ele.user_email}</div>
                  <div className="text-primary" onClick={() => viewProvider(ele)}>View Details</div>
                </Card.Body>
              </Card>
            )
        )}
      </div>
    </div>
  );
};

export default ListProvider;
