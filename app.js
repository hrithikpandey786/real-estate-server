const express = require("express");
const app = express();
const authRoute = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const testRoute = require("./routes/test.route");
const userRoute = require("./routes/user.route");
const postsRoute = require("./routes/post.route");
const chatsRoute = require("./routes/chat.route.js");
const messageRoute = require("./routes/message.route.js");
const PORT = process.env.PORT || 8800

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/message", messageRoute);



app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}...`);
})