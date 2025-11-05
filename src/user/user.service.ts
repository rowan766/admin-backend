import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 创建用户
  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existUser) {
      throw new ConflictException('用户名已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户
      const { password, ...user } = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
    return user;
  }

  // 查询所有用户
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // 不返回密码
      },
    });
    return users;
  }

  // 查询单个用户
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  // 更新用户
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // 检查用户是否存在

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // 删除用户
  async remove(id: number) {
    await this.findOne(id); // 检查用户是否存在
    
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }
}