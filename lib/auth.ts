export const loginUser = async (identifier: string, password: string) => {
  const res = await fetch('https://cms-perpusku.widhimp.my.id/api/auth/local', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      identifier,
      password
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || 'Login gagal');
  }

  document.cookie = `token=${data.jwt}; path=/`;

  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await fetch(
    'https://cms-perpusku.widhimp.my.id/api/auth/local/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || 'Register gagal');
  }

  return data;
};

export const logoutUser = () => {
  document.cookie = 'token=; path=/; max-age=0';
  localStorage.removeItem('user');
};
