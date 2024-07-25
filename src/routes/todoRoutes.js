import express from 'express';
import Todo from '../models/todo.js';

const router = express.Router();

const validateTodo = (req, res, next) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).send('Title is required');
    }
    next();
};

router.post('/', validateTodo, async (req, res) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            completed: req.body.completed || false,
        });
        const savedTodo = await todo.save();
        res.json(savedTodo);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', validateTodo, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(todo);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
