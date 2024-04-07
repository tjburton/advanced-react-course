import 'dotenv/config';
import {config, createSchema} from '@keystone-next/keystone/schema';
import {createAuth} from '@keystone-next/auth';
import {withItemData, statelessSessions} from '@keystone-next/keystone/session';
import {User} from './schemas/User';
import {Product} from './schemas/Product';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long should they stay signed in
  secret: process.env.COOKIE_SECRET,
};

const {withAuth} = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in initial roles
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // TODO: Add data seeding here
    },
    lists: createSchema({
      // TODO: Scheme items go in here
      User,
      Product,
    }),
    ui: {
      // TODO: Show the UI for only people who pass this test
      isAccessAllowed: ({session}) => !!session?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id',
    }),
  })
);
