const express = require('express');
const { randomInt } = require('crypto');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

router.post('/generate', authMiddleware, async (req, res) => {
    let novaSenha = '';
    for (let i = 0; i < 12; i++) {
        novaSenha += CHARS[randomInt(CHARS.length)];
    }

    try {
        await db.query(
            'INSERT INTO passwords (user_id, password) VALUES ($1, $2)',
            [req.userId, novaSenha]
        );
        return res.json({ password: novaSenha });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao salvar senha' });
    }
});

router.post('/sync', authMiddleware, async (req, res) => {
    const { passwords } = req.body;
    if (!Array.isArray(passwords) || passwords.length === 0) {
        return res.status(400).json({ error: 'Nenhuma senha para sincronizar' });
    }
    const MAX_BATCH = 100;
    if (passwords.length > MAX_BATCH) {
        return res.status(400).json({ error: `Máximo de ${MAX_BATCH} senhas por sincronização` });
    }
    for (const p of passwords) {
        if (typeof p !== 'string' || p.length === 0 || p.length > 128) {
            return res.status(400).json({ error: 'Senha inválida na lista' });
        }
    }

    try {
        const placeholders = passwords.map((_, i) => `($1, $${i + 2})`).join(', ');
        await db.query(
            `INSERT INTO passwords (user_id, password) VALUES ${placeholders}`,
            [req.userId, ...passwords]
        );
        return res.json({ synced: passwords.length });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao sincronizar senhas' });
    }
});

router.get('/history', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, password FROM passwords WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC',
            [req.userId]
        );
        return res.json({ history: result.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(
            'UPDATE passwords SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
            [id, req.userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Senha não encontrada' });
        }
        return res.json({ message: 'Senha excluída' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao excluir senha' });
    }
});

router.delete('/history', authMiddleware, async (req, res) => {
    try {
        await db.query('DELETE FROM passwords WHERE user_id = $1', [req.userId]);
        return res.json({ message: 'Histórico limpo' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao limpar histórico' });
    }
});

module.exports = router;
