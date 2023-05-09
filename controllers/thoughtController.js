const { Thought, User } = require('../models');

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughtData = await Thought.find({})
        .populate({
          path: "reaction",
          select: "-__v",
        })
        .select("-__v");

      res.status(200).json(thoughtData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // get specific thought by ID
  async getThoughtById(req, res) {
    try {
      const thoughtData = await Thought.findOne({ _id: req.params.id })
        .populate({
          path: "reaction",
          select: "-__v",
        })
        .select("-__v");

      if (!thoughtData) {
        res.status(404).json({ message: "No thought found with that ID." })
        return;
      }

      res.status(200).json(thoughtData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // create thought
  async createThought(req, res) {
    try {
      const thoughtData = await Thought.create(req.body)

      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );

      if (!userData) {
        res.status(404).json({ message: "No user found with this ID" })
      }
      res.status(200).json(thoughtData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // update thought by id
  async updateThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thoughtData) {
        res.status(404).json({ message: "No user found with that ID." })
        return;
      }

      res.status(200).json(thoughtData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // delete thought
  async deleteThought(req, res) {
    try {
      const thoughtData = await User.findOneAndDelete(
        { _id: req.params.id }
      );
      if (!deleteThought) {
        return res.status(404).json({ message: "please try a diffrent id." });
      }

      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { thoughts: req.thoughtData.thoughtId } },
        { new: true }
      );

      if (!userData) {
        res.status(404).json({ message: "No user found with that ID." })
        return;
      }

      res.status(200).json(thoughtData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // add new reaction to thought
  async addReaction(req, res) {
    try {
      const reactionData = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { reactionId: req.params.reactionId } },
        { new: true }
      );

      if (!reactionData) {
        res.status(404).json({ message: "No user found with that ID." })
        return;
      }

      res.status(200).json(reactionData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  // delete reaction
  async deleteReaction(req, res) {
    try {
      const reactionData = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );

      if (!reactionData) {
        res.status(404).json({ message: "No user found with that ID." })
        return;
      }

      res.status(200).json(reactionData)
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },
};