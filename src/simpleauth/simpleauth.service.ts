import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SimpleauthService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
    ) { }

    async login(username, password) {
        const user = await this.userModel.findOne({ username: username, password: password })
        if (user) {
            console.log(user)
            return true
        } else {
            console.log("no user")
            return false
        }
    }


    addUser() {
        const newUser = new this.userModel({
            username: "test",
            password: "pmo"
        });
        newUser.save().then(res => {
            console.log(res)
        }).catch(e => {
            console.log(e)
        })
    }
}
