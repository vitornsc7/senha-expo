const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/signup', async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'Email inválido' });
    }

    if (password !== passwordConfirm) {
        return res.status(400).json({ error: 'As senhas não coincidem' });
    }

    try {
        const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        const hashed = await bcrypt.hash(password, 12);
        await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
            [name, email, hashed]
        );

        return res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
