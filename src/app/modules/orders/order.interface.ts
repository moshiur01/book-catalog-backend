type OrderedBook = {
  bookId: string;
  quantity: number;
};

export type Order = {
  orderedBooks: OrderedBook[];
};
