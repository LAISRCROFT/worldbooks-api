import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagsSchema } from './interfaces/tags.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ 
    MongooseModule.forFeature([
      { name: 'Tag', schema: TagsSchema },
    ]),
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
