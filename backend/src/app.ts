import cors from 'cors';
import express from 'express';
import protobuf from 'protobufjs';

const app = express();

// CORS Setting
const allowedOrigins = ['http://localhost:3000'];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
app.use(cors(options));

// JSON Request Body Parsing
app.use(express.json());

protobuf.load('todo.proto', (error, root) => {
  if (error) throw error;

  const Todo = root?.lookupType('todolist.Todo');
  const TodoList = root?.lookupType('todolist.TodoList');

  const datastore: Record<number, any> = {
    1: {
      id: 1,
      title: 'PWA 공부하기',
      description: 'PWA로 TODO LIST App 만들어보기',
      completed: true,
    },
    2: {
      id: 2,
      title: 'protobuf 공부하기',
      description: 'protobuf 공식문서 읽어보기',
      completed: false,
    },
  };

  // Create a todo
  app.post('/todo', (req, res) => {
    const todoId = Object.keys(datastore).length + 1;
    const todo = Todo?.create({
      id: todoId,
      ...req.body,
    });
    datastore[todoId] = todo;

    res.json(todo);
  });

  // Get all todos
  app.get('/todos', (_, res) => {
    const todos = Object.values(datastore);
    const todoList = TodoList?.create({ todos });
    const todoObject = TodoList?.toObject(todoList!);

    res.json(todoObject);
  });

  // Get a specific todo
  // app.get('/todo/:id', (req, res) => {
  //   const todo = datastore[+req.params.id];
  //   if (!todo) {
  //     return res.status(404).send('Todo not found');
  //   }

  //   res.json(todo);
  // });

  // Update a todo
  // app.put('/todo/:id', (req, res) => {
  //   const todo = datastore[+req.params.id];
  //   if (!todo) {
  //     return res.status(404).send('Todo not found');
  //   }
  //   Object.assign(todo, req.body);

  //   res.json(todo);
  // });

  // Delete a todo
  // app.delete('/todo/:id', (req, res) => {
  //   const todo = datastore[+req.params.id];
  //   if (!todo) {
  //     return res.status(404).send('Todo not found');
  //   }
  //   delete datastore[+req.params.id];

  //   res.status(204).end();
  // });

  app.listen(8081, () => {
    // eslint-disable-next-line no-console
    console.log('Server listening on port 8081');
  });
});
