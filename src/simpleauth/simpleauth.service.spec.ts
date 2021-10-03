import { Test, TestingModule } from '@nestjs/testing';
import { SimpleauthService } from './simpleauth.service';

describe('SimpleauthService', () => {
  let service: SimpleauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimpleauthService],
    }).compile();

    service = module.get<SimpleauthService>(SimpleauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
