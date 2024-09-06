import express, { text } from "express";
import ImageKit from "imagekit";
import cors from "cors";
import mongoose from "mongoose";
import UserChats from "./models/userChats.js";
import Chat from "./models/chat.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const port = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());

const connect = async () => {
    try {
        console.log(process.env.MONGO);
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MONOGODB");
    } catch (e) {
        console.log(e);
    }
};

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});

app.get("/api/test", ClerkExpressRequireAuth({}), (req, res) => {
    const userId = req.auth.userId;
    console.log(userId);
    res.send("successfulll!!");
});

app.post("/api/chats", ClerkExpressRequireAuth({}), async (req, res) => {
    const userId = req.auth.userId;
    const { text } = req.body;

    try {
        //Create a new chat
        const newChat = new Chat({
            userId: userId,
            history: [
                {
                    role: "user",
                    parts: [{ text }],
                },
            ],
        });

        const savedChat = await newChat.save();

        //Check if the user chat exist
        const userChats = await UserChats.find({ userId: userId });

        //if doesnt exist create chat in array
        if (!userChats.length) {
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat.id,
                        title: text.substring(0, 40),
                    },
                ],
            });

            await newUserChats.save();
        } else {
            //push chat in existing array
            await UserChats.updateOne(
                {
                    userId: userId,
                },
                {
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 40),
                        },
                    },
                }
            );

            res.status(201).send(newChat._id);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating chat!");
    }
    console.log(text);
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChats.find({ userId });
        res.status(200).send(userChats[0].chats);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching userchats!!");
    }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;

    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId });
        //console.log(chat)
        res.status(200).send(chat);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching userchats!!");
    }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const { question, answer, img } = req.body;
    const newItems = [
        ...(question
            ? [
                  {
                      role: "user",
                      parts: [{ text: question }],
                      ...(img && { img }),
                  },
              ]
            : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chat.updateOne(
            { _id: req.params.id, userId },
            {
                $push: {
                    history: {
                        $each: newItems,
                    },
                },
            }
        );

        res.status(200).send(updatedChat);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error adding userchats!!");
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
    connect();
    console.log(`server running... on port ${port}`);
});

console.log("test1");
