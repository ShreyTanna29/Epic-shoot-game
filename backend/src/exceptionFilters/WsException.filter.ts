import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import WebSocket from 'ws';

@Catch(WsException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient() as WebSocket;
    const data = host.switchToWs().getData();
    const error = exception.getError();

    client.send(
      JSON.stringify({
        event: 'ERROR',
        data: {
          rid: data.rid,
          error: error,
        },
      }),
    );
  }
}
