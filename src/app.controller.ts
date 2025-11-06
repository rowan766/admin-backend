import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redis/test')
  async testRedis() {
    const testKey = 'test:key';
    const testValue = { message: 'Hello Redis!', timestamp: Date.now() };

    await this.redisService.set(testKey, testValue, 60000);

    const retrievedValue = await this.redisService.get(testKey);

    return {
      success: true,
      data: {
        stored: testValue,
        retrieved: retrievedValue,
        match: JSON.stringify(testValue) === JSON.stringify(retrievedValue),
      },
    };
  }

  @Get('redis/set')
  async setCache(@Query('key') key: string, @Query('value') value: string) {
    if (!key || !value) {
      return {
        success: false,
        message: '请提供 key 和 value 参数',
      };
    }
    await this.redisService.set(key, value, 60000);
    return {
      success: true,
      message: '缓存设置成功',
      data: { key, value },
    };
  }

  @Get('redis/get')
  async getCache(@Query('key') key: string) {
    if (!key) {
      return {
        success: false,
        message: '请提供 key 参数',
      };
    }
    const value = await this.redisService.get(key);
    return {
      success: true,
      data: { key, value },
    };
  }

  @Get('redis/del')
  async delCache(@Query('key') key: string) {
    if (!key) {
      return {
        success: false,
        message: '请提供 key 参数',
      };
    }
    await this.redisService.del(key);
    return {
      success: true,
      message: '缓存删除成功',
      data: { key },
    };
  }
}
