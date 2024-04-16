import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'
import { userResolver } from './resolvers/user-resolver'

const GenderEnum = new GraphQLEnumType({
  name: 'GenderEnum',
  values: {
    MALE: { value: 'male' },
    FEMALE: { value: 'female' }
  }
})

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(
          new GraphQLObjectType({
            name: 'Users',
            fields: {
              id: { type: GraphQLString },
              name: { type: GraphQLString },
              email: { type: GraphQLString }
            }
          })
        ),
        resolve: userResolver.Query.users
      },
      user: {
        type: new GraphQLObjectType({
          name: 'User',
          fields: {
            id: { type: GraphQLString },
            name: { type: GraphQLString },
            email: { type: GraphQLString }
          }
        }),
        args: {
          id: { type: GraphQLString }
        },
        resolve: userResolver.Query.user
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: {
      createUser: {
        type: new GraphQLObjectType({
          name: 'CreateUser',
          description: 'Create a new user',
          fields: {
            id: { type: GraphQLString },
            name: { type: GraphQLString },
            email: { type: GraphQLString },
            birthdate: { type: GraphQLString },
            password: {
              type: new GraphQLObjectType({
                name: 'Password',
                fields: {
                  hash: { type: GraphQLString },
                  salt: { type: GraphQLString }
                }
              })
            },
            taxId: { type: GraphQLString },
            gender: {
              type: GenderEnum
            },
            role: { type: GraphQLString }
          }
        }),
        args: {
          name: { type: GraphQLString },
          email: { type: GraphQLString },
          birthdate: { type: GraphQLString },
          password: { type: GraphQLString },
          taxId: { type: GraphQLString },
          gender: { type: GenderEnum }
        },
        resolve: userResolver.Mutation.createUser
      }
    }
  })
})
