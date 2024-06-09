const prisma = require("../lib/prisma.js");
const jwt = require("jsonwebtoken");

const getPosts = async (req, res) =>{
    const query = req.query;
    
    try{
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: (query.type==="any")?undefined:query.type,
                property: (query.property==="any")?undefined:query.property,
                price: {
                    gte: parseInt(query.minprice) || 0,
                    lte: parseInt(query.maxprice) || 10000000
                },
                bedroom: parseInt(query.bedroom) || undefined
            }
        }); 
        res.status(200).json(posts);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get Posts"});
    }
}

const getPost = async (req, res) =>{
    const id = req.params.id;
    const token = req.cookies.token;
    
    try{
        const post = await prisma.post.findUnique({
            where: {id},
            include:{
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                }
            }
        })

        if(!token){{
            return res.status(200).json({...post, isSaved: false}); 
        }
        } else {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async(error, payload)=>{
                if(!error){
                    const saved = await prisma.savedPost.findUnique({
                        where:{
                            userId_postId: {
                                postId: id,
                                userId: payload.id
                            }
                        }
                    })
                    
                    return res.status(200).json({...post, isSaved: saved?true:false});
                } else {
                    console.log(error);
                    return res.status(500).json({message: "Error while verifying token"});
                }
            })
        }
        
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to get the Post"});
    }
}

const addPost = async (req, res) =>{
    const tokenId = req.userId;
    const body = req.body;
    
    try{
        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenId,
                postDetail: {
                    create: body.postDetail,
                    // postId: tokenId
                }
            }
        })
        return res.status(200).json(newPost);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to add Post"});
    }
}

const updatePost = (req, res) =>{
    try{

    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to update the Post"});
    }
}

const deletePost = async (req, res) =>{
    const tokenId = req.userId;
    const id = req.params.id;

    try{
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        })

        if(post.userId!==tokenId){
            return res.status(403).json({message: "Not Authorized"});
        }

        await prisma.postDetail.delete({
            where: {
                postId: id
            }
        })

        await prisma.post.delete({
            where: {
                id
            }
        })
        res.status(200).json({message: "Post deleted"});
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to delete the Post"});
    }
}

module.exports = {getPosts, getPost, addPost, updatePost, deletePost};