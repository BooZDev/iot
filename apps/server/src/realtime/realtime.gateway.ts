import { WebSocketGateway } from '@nestjs/websockets';
import { RealtimeService } from './realtime.service';

@WebSocketGateway(5002, { namespace: 'realtime' })
export class RealtimeGateway {
  constructor(private readonly realtimeService: RealtimeService) {}
}
