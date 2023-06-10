import User from "../models/user.js"

export const getUser = async (req,res) => {
    try{
        const { id }= req.params;
        console.log(id)
        const user = await User.findById(id);
        console.log(user)
        res.status(200).json(user);
    }
    catch(err) {
        res.status(404).json({msg : err.message});
    }
}

export const getUserFriends = async (req,res) => {
    try{
        const { id }= req.params;
        const user = await User.findById(id);
        
        const friends = await Promise.all(user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends;

        res.status(200).json(formattedFriends);
    }
    catch(err) {
        res.status(404).json({msg : err.message});
    }
}

export const addRemoveFriend = async (req,res) => {
    try{
        const { id }= req.params;
        const user = await User.findById(id);

        const { friendId }= req.params;
        const friend = await User.findById(friendId);
        
        if(user.friends.includes(friendId))
        {
            user.friends.pull(friendId);
            friend.friends.pull(id);
        }
        else 
        {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(user.friends.map((id) => User.findById(id))
        );
        console.log("f",friends)
        const formattedFriends = friends;

        res.status(200).json(formattedFriends);

    }
    catch(err) {
        res.status(404).json({msg : err.message});
    }
}

