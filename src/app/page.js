'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { saveSubmission, getSubmissions, clearSubmissions } from '../lib/db';

const Container = styled.div`
  padding: 2rem;
  font-family: sans-serif;
`;

const Input = styled.input`
  display: block;
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 300px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
`;

const Status = styled.div`
  margin-top: 1rem;
  color: blue;
`;

export default function Home() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name, message, timestamp: new Date().toISOString() };

    if (navigator.onLine) {
      setStatus('Online: Sending to server...');
      await fakeSendToServer(data);
    } else {
      setStatus('Offline: Saving to local DB');
      await saveSubmission(data);
    }

    setName('');
    setMessage('');
  };

  const syncOfflineData = async () => {
    const stored = await getSubmissions();
    if (stored.length > 0) {
      setStatus(`Syncing ${stored.length} saved form(s)...`);
      for (let entry of stored) {
        await fakeSendToServer(entry);
      }
      await clearSubmissions();
      setStatus('All offline forms synced.');
    }
  };

  useEffect(() => {
    window.addEventListener('online', syncOfflineData);
    if (navigator.onLine) syncOfflineData();
    return () => window.removeEventListener('online', syncOfflineData);
  }, []);

  const fakeSendToServer = async (data) => {
    console.log('Mock sending to server...', data);
    return new Promise((res) => setTimeout(res, 1000));
  };

  return (
    <Container>
      <h1>Offline Form</h1>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
      <Status>{status}</Status>
    </Container>
  );
}
