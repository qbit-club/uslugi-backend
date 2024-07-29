import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  namespace: 'orders'
})
export class OrdersSocketService implements OnGatewayConnection {
  handleConnection(client: any) {
  }

  @SubscribeMessage('join-room')
  joinRoom(
    @ConnectedSocket() client: any,
    @MessageBody('room') room: any
  ) {
    console.log('joined room:', room);
    client.join(room)
  }

  @SubscribeMessage("create-order-to-server")
  handleEvent(
    @MessageBody('order') order: any,
    @ConnectedSocket() client: any
  ) {
    client.to(order.rest).emit("create-order-to-client", order)
  }
}