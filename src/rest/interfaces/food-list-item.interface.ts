export interface FoodListItem {
  name: string
  category: string
  health: {
    protein: number
    carb: number
    fat: number
    energy: string
  }
  price:  string
}