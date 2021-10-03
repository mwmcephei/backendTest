import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SimpleauthService } from './simpleauth.service';


export class UserDataDto {
    username: string;
    password: string;
}



@Controller('simpleauth')
export class SimpleauthController {
    constructor(private simpleauthService: SimpleauthService) { }



    @Post("login")
    async login(@Body() userData: UserDataDto) {
        const success = await this.simpleauthService.login(userData.username, userData.password)
        console.log(success)
        return {
            login: success
        }
    }


    @Get('adduser')
    parse() {
        return this.simpleauthService.addUser();
    }


}
