import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SocketService implements OnGatewayConnection {
  handleConnection(client: any) {
  }

  @SubscribeMessage("server-create-order")
  handleEvent(
    @MessageBody('order') order: any,
    @ConnectedSocket() client: any
  ) {    
    client.emit("client-create-order", order)
  }
}