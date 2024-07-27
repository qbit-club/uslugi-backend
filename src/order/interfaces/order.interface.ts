export interface Order {
  items: [{
    price: number,
    count: number,
    menuItem: string
  }]
  rest: string,
  user: string
}