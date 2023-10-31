const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    name: String
    symbol: String
    decimals: int
    totalSupply: int
  }
`;

module.exports = typeDefs;
