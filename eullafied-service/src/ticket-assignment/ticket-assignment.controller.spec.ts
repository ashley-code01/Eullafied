import { Test, TestingModule } from '@nestjs/testing';
import { TicketAssignmentController } from './ticket-assignment.controller';
import { TicketAssignmentService } from './ticket-assignment.service';

describe('TicketAssignmentController', () => {
  let controller: TicketAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketAssignmentController],
      providers: [TicketAssignmentService],
    }).compile();

    controller = module.get<TicketAssignmentController>(TicketAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
