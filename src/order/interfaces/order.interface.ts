export interface Order {
  items: [{
    price: number,
    count: number,
    menuItem: string
  }]
  rest: string,
  user: {
    name: string,
    phone: string,
    address: string,
    _id: string | undefined
  },
  date: string
}