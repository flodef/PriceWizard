export const cls = (...classes: (string | undefined)[]) =>
  classes
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .reverse()
    .reduce((acc: string[], curr) => {
      const [prefix] = curr.split('-');
      if (!acc.some((c) => c.startsWith(prefix)) || !curr.includes('-')) acc.push(curr);
      return acc;
    }, [])
    .join(' ');

export const inputClassNames = {
  input: ['border-none', 'focus:ring-transparent', 'p-0'],
};
