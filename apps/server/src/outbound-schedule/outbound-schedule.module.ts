import { Module } from '@nestjs/common';
import { OutboundScheduleService } from './outbound-schedule.service';
import { OutboundScheduleController } from './outbound-schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OutboundSchedule,
  OutboundScheduleSchema,
} from 'src/entities/outboundSchedule.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OutboundSchedule.name, schema: OutboundScheduleSchema },
    ]),
    ProductModule,
  ],
  controllers: [OutboundScheduleController],
  providers: [OutboundScheduleService],
  exports: [OutboundScheduleService],
})
export class OutboundScheduleModule {}
