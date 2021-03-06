"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const xlsx_parser_module_1 = require("./xlsx-parser/xlsx-parser.module");
const mongoose_1 = require("@nestjs/mongoose");
const api_module_1 = require("./api/api.module");
const simpleauth_module_1 = require("./simpleauth/simpleauth.module");
const platform_express_1 = require("@nestjs/platform-express");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
            mongoose_1.MongooseModule.forRoot('mongodb+srv://mwm:mwm@cluster0.drn93.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
            xlsx_parser_module_1.XlsxParserModule,
            api_module_1.ApiModule,
            simpleauth_module_1.SimpleauthModule
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map