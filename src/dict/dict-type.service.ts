import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDictTypeDto } from './dto/create-dict-type.dto';
import { UpdateDictTypeDto } from './dto/update-dict-type.dto';

@Injectable()
export class DictTypeService {
  constructor(private prisma: PrismaService) {}

  // 创建字典类型
  async create(createDictTypeDto: CreateDictTypeDto) {
    // 检查字典编码是否已存在
    const existDict = await this.prisma.dictType.findUnique({
      where: { code: createDictTypeDto.code },
    });

    if (existDict) {
      throw new ConflictException('字典编码已存在');
    }

    return await this.prisma.dictType.create({
      data: createDictTypeDto,
    });
  }

  // 获取字典类型列表
  async findAll() {
    return await this.prisma.dictType.findMany({
      orderBy: { sort: 'asc' },
      include: {
        items: {
          where: { status: 1 },
          orderBy: { sort: 'asc' },
        },
      },
    });
  }

  // 获取单个字典类型
  async findOne(id: number) {
    const dictType = await this.prisma.dictType.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { sort: 'asc' },
        },
      },
    });

    if (!dictType) {
      throw new NotFoundException('字典类型不存在');
    }

    return dictType;
  }

  // 根据字典编码获取字典类型及其数据项
  async findByCode(code: string) {
    const dictType = await this.prisma.dictType.findUnique({
      where: { code },
      include: {
        items: {
          where: { status: 1 },
          orderBy: { sort: 'asc' },
        },
      },
    });

    if (!dictType) {
      throw new NotFoundException('字典类型不存在');
    }

    return dictType;
  }

  // 更新字典类型
  async update(id: number, updateDictTypeDto: UpdateDictTypeDto) {
    await this.findOne(id); // 检查字典类型是否存在

    // 检查字典编码是否冲突
    if (updateDictTypeDto.code) {
      const existDict = await this.prisma.dictType.findUnique({
        where: { code: updateDictTypeDto.code },
      });

      if (existDict && existDict.id !== id) {
        throw new ConflictException('字典编码已存在');
      }
    }

    return await this.prisma.dictType.update({
      where: { id },
      data: updateDictTypeDto,
    });
  }

  // 删除字典类型
  async remove(id: number) {
    await this.findOne(id); // 检查字典类型是否存在

    // 检查是否有字典数据项
    const itemsCount = await this.prisma.dictData.count({
      where: { dictTypeId: id },
    });

    if (itemsCount > 0) {
      throw new ConflictException('该字典类型下有数据项，无法删除');
    }

    await this.prisma.dictType.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }
}
