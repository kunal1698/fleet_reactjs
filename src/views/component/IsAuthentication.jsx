export const isAuthenticated = () => {
  const user = sessionStorage.getItem('userData');
  return !!user;
};
