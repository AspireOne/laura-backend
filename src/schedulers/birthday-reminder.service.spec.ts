import { Test, TestingModule } from '@nestjs/testing';
import { BirthdayReminderService } from './birthday-reminder.service';
import { SchedulerErrorHandlerService } from '../common/services/scheduler-error-handler.service';
import { GoogleOauthClientService } from '../common/services/google-oauth-client.service';
import { ContactsService } from '../common/services/contacts.service';
import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';
import Expo from 'expo-server-sdk';
import { OpenAI } from 'openai';

describe('BirthdayReminderService', () => {
  let service: BirthdayReminderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BirthdayReminderService,
        {
          provide: Expo,
          useValue: {
            sendPushNotificationsAsync: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: OpenAI,
          useValue: {},
        },
        {
          provide: Kysely,
          useValue: {},
        },
        {
          provide: SchedulerErrorHandlerService,
          useValue: {
            notifyOnError: jest.fn().mockImplementation((fn) => fn()),
          },
        },
        {
          provide: GoogleOauthClientService,
          useValue: {
            getOAuthClient: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: ContactsService,
          useValue: {
            retrieveContacts: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<BirthdayReminderService>(BirthdayReminderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('handleCron should not throw an error', async () => {
    await expect(service.handleCron()).resolves.not.toThrow();
  });
});
