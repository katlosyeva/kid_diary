const { buildSchema } = require('graphql');

module.exports = buildSchema(`


    type Skill {
        _id: ID!
        date: String
        skill: String

}
    type Word {
        _id: ID!
        date: String!
        word: String!

}
    type Baby {
        _id: ID!
        name: String!
        words: [Word!]!
        skills: [Skill]

}

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        babies: [Baby!]!
    }
    
    type AuthData {
        token: String!
        userId: String!
    }
    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type Answer {
        text: String
        numb: Int
    }
    type SkillsData {
        skills: [Skill!]!
    }

    type Mutation {
        createUser(userInput: UserInputData): User!
        addBaby(name:String!): Baby!
        addSkill(date:String!, skill:String!, _id: String!): Skill!
        addWord(date:String!, word:String!, _id: String!): Word!
    }

    type Query {
        login(email: String!, password: String!): AuthData!
        getSkills(_id:String!): SkillsData!
      }
`);
