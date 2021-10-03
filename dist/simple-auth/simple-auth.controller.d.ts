interface LoginDto {
    username: string;
    password: string;
}
export declare class SimpleAuthController {
    private readonly simpleAuthService;
    constructor(simpleAuthService: SimpleAuthController);
    createMessage(loginData: LoginDto): LoginDto;
}
export {};
