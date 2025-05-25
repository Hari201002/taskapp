// module.exports = resolvers;
const { ObjectId } = require('mongodb');
const connectDB = require('./db');

const resolvers = {
  // QUERY OPERATIONS
  Query: {
    // Fetch all tasks
    tasks: async () => {
      const db = await connectDB();
      return db.collection('tasks').find().toArray();
    },

    // Fetch task by ID
    task: async (_, { id }) => {
      const db = await connectDB();
      return db.collection('tasks').findOne({ _id: new ObjectId(id) });
    },

    // Filter tasks by status (e.g., "Todo", "Done")
    tasksByStatus: async (_, { status }) => {
      const db = await connectDB();
      return db.collection('tasks').find({ status }).toArray();
    },
  },

  // MUTATION OPERATIONS
  Mutation: {
    // Add a new task
    addTask: async (_, { title, description, status, dueDate }) => {
      const db = await connectDB();
      const result = await db.collection('tasks').insertOne({
        title,
        description,
        status,
        dueDate,
      });

      return {
        _id: result.insertedId,
        title,
        description,
        status,
        dueDate,
      };
    },

    // Update task status
    updateTaskStatus: async (_, { id, status }) => {
      const db = await connectDB();
      await db.collection('tasks').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      return db.collection('tasks').findOne({ _id: new ObjectId(id) });
    },

    // ✅ Delete task by ID
    deleteTask: async (_, { id }) => {
      const db = await connectDB();
      const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        return 'Task deleted successfully';
      } else {
        throw new Error('Task not found');
      }
    },
  },

  // CUSTOM FIELD MAPPING: MongoDB _id → GraphQL id
  Task: {
    id: (parent) => parent._id.toString(),
  },
};

module.exports = resolvers;
