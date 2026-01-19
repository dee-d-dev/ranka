import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';

@Controller('health')
export class HealthController {
    // constructor(private readonly groupsService: GroupsService) {}

    @Get()
    findAll() {
        return 'api is up'
    }
}
