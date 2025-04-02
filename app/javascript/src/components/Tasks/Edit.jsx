import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import tasksApi from "apis/tasks";
import usersApi from "apis/users";
import { Container, PageLoader, PageTitle } from "components/commons";

import Form from "./Form";
import Logger from "js-logger";

const Edit = ({ history }) => {
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { slug } = useParams();

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await tasksApi.update({
        slug,
        payload: { title, assigned_user_id: userId },
      });
      setLoading(false);
      history.push("/dashboard");
    } catch (error) {
      setLoading(false);
      Logger.error(error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const {
        data: { users },
      } = await usersApi.fetch();
      setUsers(users);
    } catch (error) {
      Logger.error(error);
    }
  };

  const fetchTaskDetails = async () => {
    try {
      const {
        data: {
          task: { title, assigned_user },
        },
      } = await tasksApi.show(slug);
      setTitle(title);
      setAssignedUser(assigned_user);
      setUserId(assigned_user?.id);
    } catch (error) {
      Logger.error(error);
    }
  };

  const loadData = async () => {
    await Promise.all([fetchTaskDetails(), fetchUserDetails()]);
    setPageLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (pageLoading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Container>
      <div className="flex flex-col gap-y-8">
        <PageTitle title="Edit task" />
        <Form
          assignedUser={assignedUser}
          handleSubmit={handleSubmit}
          loading={loading}
          setTitle={setTitle}
          userId={userId}
          setUserId={setUserId}
          title={title}
          users={users}
        />
      </div>
    </Container>
  );
};

export default Edit;
