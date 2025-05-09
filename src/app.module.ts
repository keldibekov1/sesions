import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, ProductModule, PrismaModule, CategoryModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}