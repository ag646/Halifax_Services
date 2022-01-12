// import React from "react"
import React, { useState, useEffect } from "react";
import { Button, ListGroup, Badge } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { API } from "aws-amplify";
import ProviderImg from "../images/provider.png";

const AdminHome = () => {
  const { REACT_APP_API_URL } = process.env;
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = (id) => {
    API
      .post(REACT_APP_API_URL, `/user/deleteuser`, {
        body: {user_id: id,}
      })
      .then((res) => {
        getUsers();
      })
      .catch((e) => console.log(e));
  };

  const getUsers = () => {
    API
      .get(REACT_APP_API_URL, `/user/users`)
      .then((res) => {
        setUserList(res.users || []);
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <h3 className="mt-4 text-center">Site user list</h3>
      <div class="d-flex" style={{ flexWrap: "wrap" }}>
        {userList.length > 0
          ? userList.map((ele) => (
              <Card style={{ width: "250px", margin: "2%", padding: "15px" }}>
                <div>
                  <Card.Img
                    variant="top"
                    src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortRound&accessoriesType=Prescription02&hairColor=Blonde&facialHairType=BeardLight&facialHairColor=Blonde&clotheType=GraphicShirt&clotheColor=Black&graphicType=Diamond&eyeType=Default&eyebrowType=UpDownNatural&mouthType=Twinkle&skinColor=Yellow"
                  />
                  <p className="mt-3">
                    <b>{ele.user_name} </b> ({ele.user_type})
                  </p>
                  <p class="text-secondary">{ele.user_email}</p>
                  <p className="text-center">
                    <Button
                      onClick={() => deleteUser(ele.user_id)}
                      style={{ backgroundColor: "red" }}
                    >
                      Remove User
                    </Button>
                  </p>
                </div>
              </Card>
            ))
          : "Nothing to show"}
      </div>
    </>
  );
};

export default AdminHome;
