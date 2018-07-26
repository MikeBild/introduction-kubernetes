module.exports = `
type Product {
  id: ID!
  rev: ID!
  name: String
  price: Float
  description: String
  category: String
  likes: Int
}


input ProductFilter {
  category: String
}

type Query {
  products(filter: ProductFilter): [Product]!
}

input LikeItInput {
  productId: ID!
  productRev: ID
}

type DomainError {
  message: String
}

type LikeItPayload {
  product: Product
  error: DomainError
}

type Mutation {
  likeIt(input: LikeItInput): LikeItPayload
}
`;
