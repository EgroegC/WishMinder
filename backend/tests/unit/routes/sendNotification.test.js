require("dotenv").config();
const sendNotification = require('../../../src/utils/sendNotification');
const PushSubscription = require('../../../src/models/push_subscription');
const webpush = require('web-push');

jest.mock('../../../src/models/push_subscription');
jest.mock('web-push');

describe('sendNotification', () => {
  const fakePayload = JSON.stringify({
    title: 'Test',
    body: 'Body',
    data: {
      url: 'http://example/url'
    }
  });

  const fakeUserId = 123;
  const fakeEndpoint = 'https://example.com/endpoint';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete subscription on 410 error', async () => {
    PushSubscription.getByUser.mockResolvedValue([
      {
        endpoint: fakeEndpoint,
        expiration_time: null,
        keys: { p256dh: 'key1', auth: 'auth1' }
      }
    ]);

    const err = new Error('Gone');
    err.statusCode = 410;

    webpush.sendNotification.mockRejectedValueOnce(err);

    await sendNotification(fakeUserId, fakePayload);

    expect(PushSubscription.deleteSubByEndpointAndUser).toHaveBeenCalledWith(fakeEndpoint, fakeUserId);
  });

  it('should throw on other errors', async () => {
    PushSubscription.getByUser.mockResolvedValue([
      {
        endpoint: fakeEndpoint,
        expiration_time: null,
        keys: { p256dh: 'key1', auth: 'auth1' }
      }
    ]);

    const err = new Error('Something bad');
    err.statusCode = 500;

    webpush.sendNotification.mockRejectedValueOnce(err);

    await expect(sendNotification(fakeUserId, fakePayload)).rejects.toThrow('❌ Failed to send to');

    expect(PushSubscription.deleteSubByEndpointAndUser).not.toHaveBeenCalled();
  });
});
