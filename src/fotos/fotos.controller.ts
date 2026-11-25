
import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    ParseFloatPipe,
    DefaultValuePipe,
    Query,
    Post,
    Patch,
    Delete,
    HttpCode,
    HttpStatus,
    Inject
} from '@nestjs/common';

import { FotosService } from './fotos.service.js';
import { Foto } from './entities/foto.entity.js';

@Controller('fotos')
export class FotosController {
    constructor(
        @Inject(FotosService)
        private readonly fotosService: FotosService,
    ) {}

    @Get()
    findAll(
        @Query('min', new DefaultValuePipe(0), ParseFloatPipe) min: number,
        @Query('max', new DefaultValuePipe(5), ParseFloatPipe) max: number,
        @Query('q') q: string | undefined,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.fotosService.findAll({ min, max, q, page, limit });
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.fotosService.findOne(id);
    }

    @Post()
    create(@Body() datos: Partial<Foto>) {
        return this.fotosService.create(datos);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() datos: Partial<Foto>
    ) {
        return this.fotosService.update(id, datos);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.fotosService.remove(id);
    }
}
