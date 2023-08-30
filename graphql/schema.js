const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String
        posts: [Post!]!
    }
    input UserData {
        email: String!
        name: String!
        password: String!
    }

    type SourceMutation {
        createUser(userInput: UserData): User!
    }

    type SourceQuery {
        demo: String
    }
    schema {
        query: SourceQuery
        mutation: SourceMutation
    }
`)