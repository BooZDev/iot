import { Module } from '@nestjs/common';
import { ThresholdService } from './threshold.service';
import { ThresholdController } from './threshold.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Threshold, ThresholdSchema } from 'src/entities/threshold.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Threshold.name, schema: ThresholdSchema },
    ]),
  ],
  controllers: [ThresholdController],
  providers: [ThresholdService],
  exports: [ThresholdService],
})
export class ThresholdModule {}
