"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRequest = exports.getBuyerRequests = void 0;
// Use a direct URL or create a config file
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; // Adjust port as needed
const getBuyerRequests = async (token) => {
    const response = await fetch(`${API_URL}/api/requests/buyer`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch requests');
    }
    const data = await response.json();
    return data.data;
};
exports.getBuyerRequests = getBuyerRequests;
const cancelRequest = async (requestId, token) => {
    const response = await fetch(`${API_URL}/api/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
    });
    if (!response.ok) {
        throw new Error('Failed to cancel request');
    }
};
exports.cancelRequest = cancelRequest;
