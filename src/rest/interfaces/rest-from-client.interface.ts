import type { Table } from "./table.interface";

export interface RestFromClient {
  title: string
  alias: string
  phone: string
  socialMedia: string
  location: Location
  author: string
  tables?: Table[] 
  description: string
  schedule: string
}