const bankResolver = {
  Query: {
    async banks() {
      return await Bank.find()
    },
    async bank(_, { id }) {
      return await Bank.findById(id)
    }
  },
  Mutation: {
    async createBank(_, { input }) {
      return await Bank.create(input)
    },
    async updateBank(_, { id, input }) {
      return await Bank.findByIdAndUpdate(id, input, { new: true })
    },
    async deleteBank(_, { id }) {
      return await Bank.findByIdAndDelete(id)
    }
  }
}

export default bankResolver
