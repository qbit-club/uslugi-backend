import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private connection: Connection
  ) {
    this.connection.db.createIndex('rests', { 'location': '2dsphere' })
  }
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
