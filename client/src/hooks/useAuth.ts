import { useEffect, useState } from 'react';

export default (): [string | null, React.Dispatch<React.SetStateAction<string | null>>] => {
  const storageKey = 'token';
  const [token, setToken] = useState<string | null>(localStorage.getItem(storageKey));

  useEffect(() => {
    if (!token) {
      return localStorage.removeItem(storageKey);
    }

    localStorage.setItem(storageKey, token);
  }, [token]);

  return [token, setToken];
};
