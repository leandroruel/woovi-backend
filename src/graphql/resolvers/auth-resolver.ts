const authResolver = {
  Query: {
    login: async (_, { email, password }, { dataSources }) => {
      return dataSources.authAPI.login({ email, password })
    }
  },
  Mutation: {
    register: async (_, { email, password }, { dataSources }) => {
      return dataSources.authAPI.register({ email, password })
    }
  }
}

export default authResolver
