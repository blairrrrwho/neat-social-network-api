const { Thought, User } = require('../models');

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughtData = await Thought.find()

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
        { _id: req.body.userId },
        { $push: { thoughts: thoughtData._id } },
        { runValidators: true, new: true }
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
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this ID!' })
          : User.deleteMany({ _id: { $in: thought.users } })
      )
      .then(() => res.status(200).json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this ID!!' })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // add new reaction to thought
  async addReaction(req, res) {
    try {
      const reactionData = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { reactions: req.body } },
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
      const reactionData = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { reactions: { _id: req.params.reactionId } } },
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