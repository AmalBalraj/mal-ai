import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
    const [typingStatus, setTypingStatus] = useState("human1");

    return (
        <div className="homepage">
            <img src="/orbital.png" alt="" className="orbital" />
            <div className="left">
                <h1>MALAI</h1>
                <h2>New innovation in the AI space</h2>
                <h3>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Accusantium, repellendus, atque ex nisi ipsum quaerat ipsam
                    odio impedit minus ut voluptatem! Dignissimos incidunt
                    repudiandae sit reprehenderit nesciunt consequatur, magni
                    doloribus!
                </h3>
                <Link to="/dashboard">get started</Link>
            </div>
            <div className="right">
                <div className="imgContainer">
                    <div className="bgContainer">
                        <div className="bg"></div>
                    </div>
                    <img src="/bot.png" alt="" className="bot" />
                    <div className="chat">
                        <img
                            src={
                                typingStatus === "human1"
                                    ? "/human1.jpeg"
                                    : typingStatus === "human2"
                                    ? "/human2.jpeg"
                                    : "bot.png"
                            }
                            alt=""
                        />
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                "Human:We produce food for Mice",
                                2000,
                                () => {
                                    setTypingStatus("bot");
                                },
                                "Bot:We produce food for Hamsters",
                                2000,
                                () => {
                                    setTypingStatus("human2");
                                },
                                "Human:We produce food for Guinea Pigs",
                                2000,
                                () => {
                                    setTypingStatus("bot");
                                },
                                "Bot:We produce food for Chinchillas",
                                2000,
                                () => {
                                    setTypingStatus("human1");
                                },
                            ]}
                            wrapper="span"
                            repeat={Infinity}
                            cursor={true}
                            omitDeletionAnimation={true}
                        />
                    </div>
                </div>
            </div>
            <div className="terms">
                <img src="/logo.png" alt="" />
                <div className="links">
                    <Link to="/">Terms of services</Link>
                    <span>|</span>
                    <Link to="/">Privacy</Link>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
