export interface StudioFromClient {
  title: string
  weekdays:
  {
    weekday: string,
    from: string,
    to: string,
    holiday: boolean
  }[]
}