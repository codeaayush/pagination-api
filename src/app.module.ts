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

        const nodeEnv = config.get<string>('NODE_ENV', 'development');
        const dbSync = config.get<string>('DB_SYNC')?.toLowerCase();
        /** Create/update tables from entities (never rely on this in production). */
        const synchronize =
          dbSync === 'true' ||
          dbSync === '1' ||
          (dbSync !== 'false' && nodeEnv !== 'production');

        return {
          type: 'sqljs' as const,
          location: database,
          autoSave: true,
          entities: [Supplier],
          synchronize,
          logging: config.get<string>('DB_LOGGING')?.toLowerCase() === 'true',
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
