import { useQuery } from "react-query";
import "./chatList.css";

import { Link } from "react-router-dom";

const ChatList = () => {
  
    const { isLoading, error, data } = useQuery("userChats", () =>
        fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
            credentials: "include",
        }).then((res) => res.json())
    );

    console.log("inside chatlist")
    console.log(data)
    return (
        <div className="chatList">
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a new chat</Link>
            <Link to="/">Explore Mal-AI</Link>
            <Link to="/">Contact</Link>
            <hr />
            <span className="title">RECENT CHATS </span>
            <div className="list">
                <Link to='/'>home link</Link>
                {isLoading
                    ? "Loading..."
                    : error
                    ? "Something went wrong!"
                    : data?.map((chat) => (
                          <Link
                              to={`/dashboard/chats/${chat._id}`}
                              key={chat._id}
                          >
                              {chat.title}
                          </Link>
                      ))}
            </div>
            <hr />
            <div className="upgrade">
                <img src="/logo.png" alt="" />
                <div className="texts">
                    <span>Upgrade to Mal-AI pro</span>
                    <span>Get unlimited access to all features</span>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
