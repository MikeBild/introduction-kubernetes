module.exports = {
  Query: {
    async products(
      parent,
      { filter: { category } = {} } = {},
      { fetch },
      info
    ) {
      const response = await fetch(
        `http://localhost:7000/api/products/_all_docs?include_docs=true`
      );
      const data = await response.json();
      return data.rows
        .map(x => ({ ...x.doc, id: x.doc._id, rev: x.doc._rev }))
        .filter(x => (category ? x.category === category : true));
    }
  },
  Mutation: {
    async likeIt(
      _,
      {
        input: { productId, productRev }
      },
      { fetch }
    ) {
      const oldDocResponse = await fetch(
        `http://localhost:7000/api/products/${productId}`
      );
      const oldDoc = await oldDocResponse.json();
      const updateDoc = {
        ...oldDoc,
        likes: oldDoc.likes + 1 || 1
      };

      const response = await fetch(
        `http://localhost:7000/api/products/${productId}?rev=${productRev ||
          oldDoc._rev}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updateDoc)
        }
      );
      const newDoc = await response.json();
      return { error: null, product: { ...updateDoc, ...newDoc } };
    }
  }
};
