
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';

import { UpdateFotoDto } from './dto/update-foto.dto.js';
import { CreateFotoDto } from './dto/create-foto.dto.js';
import { QueryFotosDto } from './dto/query-fotos.dto.js';
import { FotosService } from './fotos.service.js';

@Controller('fotos')
export class FotosController {
  constructor(
    @Inject(FotosService)
    private readonly fotosService: FotosService,
  ) {}

  // Consultar fotos con filtros y paginación
  @Get()
  findAll(@Query() filtro: QueryFotosDto) {
    return this.fotosService.findAll(filtro);
  }

  // Buscar una foto por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.fotosService.findOne(id);
  }

  // Crear una foto (201 Created por defecto)
  @Post()
  create(@Body() datos: CreateFotoDto) {
    return this.fotosService.create(datos);
  }

  // Actualizar una foto
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateFotoDto,
  ) {
    return this.fotosService.update(id, datos);
  }

  // Eliminar una foto (204 No Content)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.fotosService.remove(id);
  }
}
