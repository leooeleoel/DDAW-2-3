
import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
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
    findAll() {
        return this.fotosService.findAll();
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
