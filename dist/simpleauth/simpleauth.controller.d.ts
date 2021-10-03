import { SimpleauthService } from './simpleauth.service';
export declare class UserDataDto {
    username: string;
    password: string;
}
export declare class SimpleauthController {
    private simpleauthService;
    constructor(simpleauthService: SimpleauthService);
    login(userData: UserDataDto): Promise<{
        login: boolean;
    }>;
    parse(): void;
}
