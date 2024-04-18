import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLScalarType,
  Kind,
  GraphQLScalarSerializer,
  GraphQLID,
  GraphQLInputObjectType
} from 'graphql'
import { userResolver } from './resolvers/user-resolver'

const GenderEnum = new GraphQLEnumType({
  name: 'GenderEnum',
  values: {
    MALE: { value: 'Male' },
    FEMALE: { value: 'Female' }
  }
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  }
})

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: userResolver.Query.users
      },
      user: {
        type: UserType,
        args: {
          _id: { type: GraphQLID }
        },
        resolve: userResolver.Query.user
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: {
      create: {
        type: new GraphQLObjectType({
          name: 'CreateUser',
          description: 'Create a new user',
          fields: {
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            birthdate: { type: GraphQLString },
            password: { type: GraphQLString },
            tax_id: { type: GraphQLString },
            gender: {
              type: GenderEnum
            },
            role: { type: GraphQLString }
          }
        }),
        args: {
          name: { type: GraphQLString },
          email: { type: GraphQLString, description: 'Email' },
          birthdate: { type: GraphQLString },
          password: { type: GraphQLString },
          tax_id: { type: GraphQLString },
          gender: { type: GenderEnum }
        },
        resolve: (_, input) => {
          userResolver.Mutation.createUser(null, { input })
        }
      }
    }
  })
})
