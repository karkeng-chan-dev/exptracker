
import { createServer, Model } from 'miragejs';
import moment from 'moment';

export function makeServer() {
  return createServer({
    logging: __DEV__,
    models: {
      expense: Model,
    },

    seeds(server) {
      server.create('expense', { id: 1, name: 'Expense 1', amount: 100, createdAt: new Date() });
      server.create('expense', { id: 2, name: 'Expense 2', amount: 200, createdAt: new Date() });
      server.create('expense', { id: 3, name: 'Expense 3', amount: 300, createdAt: moment().subtract(1, 'days').toDate() });
      server.create('expense', { id: 3, name: 'Expense 3', amount: 300, createdAt: moment().subtract(1, 'days').toDate() });
      server.create('expense', { id: 3, name: 'Expense 3', amount: 300, createdAt: moment().subtract(1, 'days').toDate() });
      server.create('expense', { id: 4, name: 'Expense 4', amount: 400, createdAt: moment().subtract(2, 'days').toDate() });
      server.create('expense', { id: 5, name: 'Expense 5', amount: 500, createdAt: moment().subtract(2, 'days').toDate() });
      server.create('expense', { id: 6, name: 'Expense 6', amount: 600, createdAt: moment().subtract(2, 'days').toDate() });
      server.create('expense', { id: 7, name: 'Expense 7', amount: 700, createdAt: moment().subtract(2, 'days').toDate() });
      server.create('expense', { id: 8, name: 'Expense 8', amount: 800, createdAt: moment().subtract(3, 'days').toDate() });
      server.create('expense', { id: 9, name: 'Expense 9', amount: 900, createdAt: moment().subtract(3, 'days').toDate() });
      server.create('expense', { id: 10, name: 'Expense 10', amount: 1000, createdAt: moment().subtract(3, 'days').toDate() });
      server.create('expense', { id: 11, name: 'Expense 11', amount: 1100, createdAt: moment().subtract(4, 'days').toDate() });
    },

    routes() {
      this.namespace = 'api';
      this.get('/expenses', (schema) => {
        return schema.expenses.all();
      });

      this.post('/expenses', (schema, request) => {
        __DEV__ && console.log('request', request);
        const attrs = JSON.parse(request.requestBody);
        return schema.expenses.create({ ...attrs, createdAt: new Date() });
      });

      this.put('/expenses/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        delete attrs.createdAt;
        const expense = schema.expenses.find(id);
        return expense.update(attrs);
      });

      this.del('/expenses/:id', (schema, request) => {
        const id = request.params.id;
        const expense = schema.expenses.find(id);
        return expense.destroy();
      });

      this.post('/auth', (_, request) => {
        const attrs = JSON.parse(request.requestBody);
        // dummy login
        if ((attrs.username === 'Tester' && attrs.password === 'test') || attrs.token) {
          return { user: { name: 'Tester' }, token: 'test', success: true };
        } else {
          return { error: 'Invalid username or password', success: false };
        }
      });
    },
  });
}
