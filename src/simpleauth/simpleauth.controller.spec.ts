import { Test, TestingModule } from '@nestjs/testing';
import { SimpleauthController } from './simpleauth.controller';

describe('SimpleauthController', () => {
  let controller: SimpleauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimpleauthController],
    }).compile();

    controller = module.get<SimpleauthController>(SimpleauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
