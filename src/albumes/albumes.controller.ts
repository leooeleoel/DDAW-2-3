import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { AlbumesService } from './albumes.service.js';
import { CreateAlbumDto } from './dto/create-album.dto.js';
import { UpdateAlbumDto } from './dto/update-album.dto.js';

@Controller('albumes')
export class AlbumesController {
    constructor(private readonly albumesService: AlbumesService) {}

    @Get()
    findAll() {
        return this.albumesService.findAll();
    }

    @Post()
    create(@Body() datos: CreateAlbumDto) {
        return this.albumesService.create(datos);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() datos: UpdateAlbumDto,
    ) {
        return this.albumesService.update(id, datos);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.albumesService.remove(id);
    }

    // Parámetro de ruta: /api/albumes/2/fotos
    @Get(':id/fotos')
    findFotos(@Param('id', ParseIntPipe) id: number) {
        return this.albumesService.findFotos(id);
    }
}
