const { User, Thought } = require('../models');


module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const userData = await User.find({})
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });

      res.status(200).json(userData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // get user with id
  async getUserById(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.id })
        .populate({
          path: "thought",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");
      console.log(specificUser);


      if (!userData) {
        res.status(404).json({ message: "No user found with that ID." })
        return;
      }

      res.status(200).json(userData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // create new user
  async createUser(req, res) {
    try {
      const userData = await User.create(req.body)
      res.status(200).json(userData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // update user with id
  async updateUser(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!userData) {
        res.status(404).json({ message: "No user found with that ID." })
        return;
      }

      res.status(200).json(userData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // delete user
  async deleteUser(req, res) {
    try {
      const userData = await User.findOneAndDelete({ _id: req.params.id });

      if (!userData) {
        res.status(404).json({ message: "No user found with that ID." })
        return;
      }

      await User.updateMany(
        { _id: { $in: delUser.friends } },
        { $pull: { friends: params.id } }
      );

      await Thought.deleteMany({ username: delUser.username });

      res.status(200).json(userData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // add friend
  async addFriend(req, res) {
    try {
      const friendData = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!friendData) {
        res.status(404).json({ message: "No user found with that ID." })
        return;
      }

      res.status(200).json(friendData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // delete friend
  async deleteFriend(req, res) {
    try {
      const friendData = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!friendData) {
        res.status(404).json({ message: "No user found with that ID." })
        return;
      }

      res.status(200).json(friendData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },
};
