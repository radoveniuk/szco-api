import Hapi from '@hapi/hapi';
import list from './routes/list';
import extended from './routes/extended';

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request) => {
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
