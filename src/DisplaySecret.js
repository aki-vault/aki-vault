import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import useSWR from 'swr';
import { decryptMessage } from './lib/secret';

const fetcher = async (url) => {
  const request = await fetch(url);
  if (!request.ok) {
    throw new Error('Failed to fetch secret');
  }
  const data = await request.json();
  return data.message;
};

export default function DisplaySecret() {
    const { key, password } = useParams();

  const [secret, setSecret] = useState('');
  const [invalidPassword, setInvalidPassword] = useState(false);
  const { data, error } = useSWR(
    `${process.env.REACT_APP_BACKEND_URL}/secret/${key}`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );


  const decrypt = async () => {
    if (!data || !password) {
      return '';
    }
    try {
      const r = await decryptMessage(data, password);

      setSecret(r.data);
    } catch (e) {
      setInvalidPassword(true);
      return false;
    }

    return true;
  };

  useAsync(async () => decrypt(), [password, data]);

  if (error || invalidPassword) {
    return <p>Le lien a expiré ou il est incorrect.</p>;
  }

  if (!data) {
    return <p>Récupération de votre message</p>;
  }

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="w-full max-w-lg">
        <div className="text-center">Le message décrypté :</div>
        <div className="flex items-stretch mt-2">
          <textarea
            rows="5"
            className="flex-1 w-full text-sm border-green-200 outline-none focus:ring-0 focus:border-green-200 active:outline-none"
            type="text"
            readOnly
            value={secret}
          />
        </div>
      </div>
    </div>
  );
}
