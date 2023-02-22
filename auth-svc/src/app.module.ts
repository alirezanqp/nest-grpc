import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'micro-auth',
      username: 'myuser',
      password: '987654321',
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: [
        /*...*/
      ],
      migrationsTableName: 'custom_migration_table',
    }),
    AuthModule,
  ],
})
export class AppModule {}
