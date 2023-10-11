import Hapi from '@hapi/hapi';
// import fs from 'fs';
// import path from 'path';

import list from './routes/list';
import extended from './routes/extended';

const init = async () => {
  // const tls = {
  //   key: fs.readFileSync(path.join(__dirname, '/../certs/private.key')),
  //   cert: fs.readFileSync(path.join(__dirname, '/../certs/certificate.crt'))
  // };
  const server = Hapi.server({
    port: 5000,
    host: 'localhost'
    // tls
  });

  server.ext('onRequest', function (request, reply) {
    if (request.query.private_access_token !== '755e6dd8af690571fc0ed957dde2adc56ce823e6549c2286914295ffad427bd387b651eb3dc593e1') {
      return Error('You are not authorizated');
    }
    return reply.continue;
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request) => {
      if (!request.query.search) {
        return 'Type your request with search param.';
      }
      return list(request.query.search).then((res) => res);
    }
  });

  server.route({
    method: 'GET',
    path: '/extended',
    handler: (request) => {
      return extended(request.query.id).then((res) => res);
    }
  });
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
