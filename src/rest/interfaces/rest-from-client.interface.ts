import type { Table } from "./table.interface";

export interface RestFromClient {
  title: string,
  alias: string,
  phone: string,
  socialMedia: string,
  schedule: string,
  description: string,
  author: string,
  // menu:[],
  tables?: Table[]
}