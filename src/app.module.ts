import { mkdirSync } from 'fs';
import { dirname, isAbsolute, join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Supplier } from './suppliers/entities/supplier.entity';
import { SuppliersModule } from './suppliers/suppliers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const configured = config.get<string>(
          'SQLITE_DATABASE',
          'data/app.sqlite',
        );
        const database = isAbsolute(configured)
          ? configured
          : join(process.cwd(), configured);
        mkdirSync(dirname(database), { recursive: true });
        return {
          type: 'sqljs' as const,
          location: database,
          autoSave: true,
          entities: [Supplier],
          synchronize: config.get<string>('DB_SYNC') === 'true',
          logging: config.get<string>('DB_LOGGING') === 'true',
        };
      },
      inject: [ConfigService],
    }),
    SuppliersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
