import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
export declare class SimpleauthService {
    private userModel;
    constructor(userModel: Model<User>);
    login(username: any, password: any): Promise<boolean>;
    addUser(): void;
}
