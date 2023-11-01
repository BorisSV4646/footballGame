const typeDefs = `#graphql
   type Query {
     name: String
     symbol: String
     decimals: Int
     totalSupply: Int
     balanceOf(address: String!): Int
     allowance(owner: String!, spender: String!): Int
     tokens: [String]
     contractAddress: String
     commission: String
     owner: String
   }
  type Mutation {
    renounceOwnership: String
    transferOwnership(newOwner: String!): String
    changeCommission(newCommission: Int!): String
  }
`;

exports.typeDefs = typeDefs;
