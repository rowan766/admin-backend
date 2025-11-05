import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDictDataDto } from './dto/create-dict-data.dto';
import { UpdateDictDataDto } from './dto/update-dict-data.dto';

@Injectable()
export class DictDataService {
  constructor(private prisma: PrismaService) {}

  // 创建字典数据项
  async create(createDictDataDto: CreateDictDataDto) {
    // 检查字典类型是否存在
    const dictType = await this.prisma.dictType.findUnique({
      where: { id: createDictDataDto.dictTypeId },
    });

    if (!dictType) {
      throw new NotFoundException('字典类型不存在');
    }

    return await this.prisma.dictData.create({
      data: createDictDataDto,
      include: {
        dictType: true,
      },
    });
  }

  // 获取字典数据列表（支持按字典类型ID筛选）
  async findAll(dictTypeId?: number) {
    const where = dictTypeId ? { dictTypeId } : {};

    return await this.prisma.dictData.findMany({
      where,
      orderBy: { sort: 'asc' },
      include: {
        dictType: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
  }

  // 获取单个字典数据项
  async findOne(id: number) {
    const dictData = await this.prisma.dictData.findUnique({
      where: { id },
      include: {
        dictType: true,
      },
    });

    if (!dictData) {
      throw new NotFoundException('字典数据不存在');
    }

    return dictData;
  }

  // 根据字典类型编码获取字典数据项列表
  async findByTypeCode(code: string) {
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

    return dictType.items;
  }

  // 更新字典数据项
  async update(id: number, updateDictDataDto: UpdateDictDataDto) {
    await this.findOne(id); // 检查字典数据是否存在

    // 如果更新了字典类型ID，检查字典类型是否存在
    if (updateDictDataDto.dictTypeId) {
      const dictType = await this.prisma.dictType.findUnique({
        where: { id: updateDictDataDto.dictTypeId },
      });

      if (!dictType) {
        throw new NotFoundException('字典类型不存在');
      }
    }

    return await this.prisma.dictData.update({
      where: { id },
      data: updateDictDataDto,
      include: {
        dictType: true,
      },
    });
  }

  // 删除字典数据项
  async remove(id: number) {
    await this.findOne(id); // 检查字典数据是否存在

    await this.prisma.dictData.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }
}
