// /controllers/passwordResetController.js - Solicitudes de reseteo de contraseña (simple file-store)

import fs from 'fs';
import path from 'path';

const REQUESTS_DIR = path.resolve(process.cwd(), 'requests');
const REQUESTS_FILE = path.join(REQUESTS_DIR, 'password_reset_requests.json');

function ensureStore() {
  try {
    if (!fs.existsSync(REQUESTS_DIR)) fs.mkdirSync(REQUESTS_DIR, { recursive: true });
    if (!fs.existsSync(REQUESTS_FILE)) fs.writeFileSync(REQUESTS_FILE, JSON.stringify([]), 'utf-8');
  } catch (e) {
    console.error('❌ No se pudo preparar el store de reset:', e);
  }
}

function readAll() {
  ensureStore();
  try {
    const raw = fs.readFileSync(REQUESTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeAll(data) {
  ensureStore();
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// POST /api/password-resets
export const createRequest = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email es requerido' });
    }

    const list = readAll();
    const existsOpen = list.find(r => r.email?.toLowerCase() === email.toLowerCase() && r.status === 'pending');
    if (existsOpen) {
      return res.status(200).json({ success: true, message: 'Ya existe una solicitud pendiente para este email' });
    }

    const now = new Date().toISOString();
    const id = Date.now();
    const item = { id, email, status: 'pending', created_at: now, processed_at: null, processed_by: null, note: null };
    list.push(item);
    writeAll(list);

    return res.status(201).json({ success: true, message: 'Solicitud registrada. Un administrador revisará tu caso.', data: item });
  } catch (e) {
    console.error('Error creando solicitud de reset:', e);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// GET /api/password-resets (admin)
export const listRequests = async (req, res) => {
  try {
    const list = readAll();
    // Orden descendente por fecha
    list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
    res.json({ success: true, data: list });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// PATCH /api/password-resets/:id/process (admin)
export const markProcessed = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body || {};
    const list = readAll();
    const idx = list.findIndex(r => String(r.id) === String(id));
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
    }
    if (list[idx].status === 'processed') {
      return res.status(200).json({ success: true, message: 'Solicitud ya estaba procesada', data: list[idx] });
    }
    const userId = req.user?.id || null;
    list[idx] = {
      ...list[idx],
      status: 'processed',
      processed_at: new Date().toISOString(),
      processed_by: userId,
      note: note || list[idx].note
    };
    writeAll(list);
    res.json({ success: true, message: 'Solicitud marcada como procesada', data: list[idx] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
