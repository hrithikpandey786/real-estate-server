const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

const getUsers = async (req, res)=>{
    try{
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get Users data"});
    }
}

const getUser = async (req, res)=>{
    const id = req.params.id;
    try{
        const users = await prisma.user.findUnique({
            where:{
                id: id
            }
        });
        return res.status(200).json(users);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get user data"});
    }
}

const updateUser = async (req, res)=>{
    const id = req.params.id;
    const tokenId = req.userId;
    const {password, avatar, ...newData} = req.body;
    
    if(id!==tokenId){
        return res.status(403).json({message: "Not Authorized"});
    }

    let hashedPassword = null;

    try{

        if(password){
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where:{
                id
            }, data: {
                ...newData,
                ...password && {password: hashedPassword},
                ...avatar && {avatar: avatar[0]}
            }
        });

        const {password: userPassword, ...rest} = updatedUser;

        return res.status(200).json(rest);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to update data"});
    }
}

const deleteUser = async (req, res)=>{
    const id = req.params.id;
    const tokenId = req.userId;

    if(id!==tokenId){
        return res.status(403).json({message: "Not Authorized"});
    }

    try{
        await prisma.user.delete({
            where:{
                id
            }
        });

        return res.status(200).json("successfully deleted");
    } catch(err){
        console.log(err);
        res.status(403).json({message: "Failed to delete the user"});
    }
}

const savedPost = async (req, res) => {
    const tokenUserId = req.userId;
    const postId = req.body.postId;

    try{
        const savedPost = await prisma.savedPost.findUnique({
            where:{
                userId_postId:{
                    userId: tokenUserId,
                    postId: postId
                }
            }
        });

        if(savedPost){
            await prisma.savedPost.delete({
                where:{
                    id: savedPost.id
                }
            })

            return res.status(200).json({message: "Post removed from saved list"});
        } else {
            await prisma.savedPost.create({
                data:{
                    userId: tokenUserId,
                    postId: postId
                }
            })

            return res.status(200).json({message: "Post Saved"});
        }
    } catch(err){
        console.log(err);
        res.status(500).json("Failed");
    }
}

const profilePosts = async (req, res) =>{
    const tokenUserId = req.userId;
    
    try{
        const userPosts = await prisma.post.findMany({
            where: {
                userId: tokenUserId
            }
        });

        const saved = await prisma.savedPost.findMany({
            where:{
                userId: tokenUserId,
            },
            include:{
                post: true
            }
        })
        
        const savedPosts = saved.map(item=>item.post);
        return res.status(200).json({userPosts, savedPosts});
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get profile posts"});
    }
}

const getNotification = async (req, res) =>{
    const tokenUserId = req.userId;
    
    try{
        const chats = await prisma.chat.findMany({
            where: {
                userIDs: {hasSome:[tokenUserId]} ,
                NOT: {
                    seenBy:{
                        hasSome: [tokenUserId]
                    } 
                }
            },
        })
        
        return res.status(200).json(chats.length);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get notification number"});
    }
}

module.exports = {getUsers, getUser, updateUser, deleteUser, savedPost, profilePosts, getNotification};