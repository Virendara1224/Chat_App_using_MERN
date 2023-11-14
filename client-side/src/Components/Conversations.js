import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import "./myStyles.css";
import { useNavigate } from 'react-router-dom';
import { myContext } from './MainContainer';
// import { refreshSidebarFun } from '../Features/refreshSidebar';
import axios from 'axios';

function Conversations() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const lightTheme = useSelector((state) => state.themeKey);
    // const refresh = useSelector((state) => state.refreshKey);
    const { refresh, setRefresh } = useContext(myContext);
    // console.log("Context API : refresh : ", refresh);
    const [conversations, setConversations] = useState([]);
    // console.log("Conversations of Sidebar : ", conversations);
    const userData = JSON.parse(localStorage.getItem("userData"));
    // console.log("Data from LocalStorage : ", userData);
    const nav = useNavigate();
    if (!userData) {
      console.log("User not Authenticated");
      nav("/");
    }

    const user = userData.data;
    useEffect(() => {
      // console.log("Sidebar : ", user.token);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      axios.get("http://localhost:8080/chat/", config).then((response) => {
        console.log("Data refresh in sidebar ", response.data);
        setConversations(response.data);
        // setRefresh(!refresh);
      });
    }, [refresh]);
  
  return (
    <div className={"sb-conversations allConversation" + (lightTheme ? "" : " dark")}>
    {conversations.map((conversation, index) => {
      // console.log("current convo : ", conversation);
      if (conversation.users.length === 1) {
        return <div key={index}></div>;
      }
      if (conversation.latestMessage === undefined) {
        // console.log("No Latest Message with ", conversation.users[1]);
        return (
          <div
            key={index}
            onClick={() => {
            //   console.log("Refresh fired from sidebar");
            //   dispatch(refreshSidebarFun());
              setRefresh(!refresh);
            }}
          >
            <div
              key={index}
              className="conversation-container"
              onClick={() => {
                navigate(
                  "chat/" +
                    conversation._id +
                    "&" +
                    conversation.users[1].name
                );
              }}
              // dispatch change to refresh so as to update chatArea
            >
              <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                {conversation.users[1].name[0]}
              </p>
              <p className={"con-title" + (lightTheme ? "" : " dark")}>
                {conversation.users[1].name}
              </p>
              <p className={"con-lastMessage" + (lightTheme ? "" : " dark")}>
                No previous Messages, click here to start a new chat
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div
            key={index}
            className="conversation-container"
            onClick={() => {
              navigate(
                "chat/" +
                  conversation._id +
                  "&" +
                  conversation.users[1].name
              );
            }}
          >
            <p className={"con-icon" + (lightTheme ? "" : " dark")}>
              {conversation.users[1].name[0]}
            </p>
            <p className={"con-title" + (lightTheme ? "" : " dark")}>
              {conversation.users[1].name}
            </p>
            <p className={"con-lastMessage" + (lightTheme ? "" : " dark")}>
              {conversation.latestMessage.content}
            </p>
          </div>
        );
      }
    })}
  </div>
  )
}

export default Conversations