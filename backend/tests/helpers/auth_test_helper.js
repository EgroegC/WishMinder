const request = require('supertest');

function itShouldRequireAuth(getServer, path, method = 'get', body = null) {
  it(`should return 401 if no token is provided [${method.toUpperCase()} ${path}]`, async () => {
    let req = request(getServer())[method](path);
    if (body) req = req.send(body);

    const res = await req;
    expect(res.status).toBe(401);
  });
}

module.exports = {
  itShouldRequireAuth
};
