const { gql } = require('apollo-server');

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    dueDate: String
  }

  type Query {
    tasks: [Task]
    task(id: ID!): Task
    tasksByStatus(status: String!): [Task]
  }

  type Mutation {
    addTask(title: String!, description: String, status: String!, dueDate: String): Task
    updateTaskStatus(id: ID!, status: String!): Task
    deleteTask(id: ID!): String    # ✅ Added this line
  }
`;

module.exports = typeDefs;
