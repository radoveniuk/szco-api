import Hapi from '@hapi/hapi';

import list from './routes/list';
import extended from './routes/extended';
import listRPO from './routes/list-rpo';
import extendedRPO from './routes/extended-rpo';

const init = async () => {
  const server = Hapi.server({
    port: 3001
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      if (request.query.private_access_token !== '755e6dd8af690571fc0ed957dde2adc56ce823e6549c2286914295ffad427bd387b651eb3dc593e1') {
        return h.response('Access denied').code(401);
      }
      if (!request.query.search) {
        return h.response('Type your request with search param.').code(400);
      }
      if (request.query.type === 'parser') {
        return list(request.query.search).then((res) => res);
      }
      return listRPO(request.query.search).then((res) => res);
    }
  });

  server.route({
    method: 'GET',
    path: '/extended',
    handler: (request, h) => {
      if (request.query.private_access_token !== '755e6dd8af690571fc0ed957dde2adc56ce823e6549c2286914295ffad427bd387b651eb3dc593e1') {
        return h.response('Access denied').code(401);
      }
      if (!request.query.id) {
        return h.response('Type your request with id param.').code(400);
      }
      if (request.query.type === 'parser') {
        return extended(request.query.id).then((res) => {
          if (res) {
            return h.response(res).code(200);
          }
          return h.response('Not found').code(404);
        });
      }
      return extendedRPO(request.query.id).then((res) => {
        if (res) {
          return h.response(res).code(200);
        }
        return h.response('Not found').code(404);
      });
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
