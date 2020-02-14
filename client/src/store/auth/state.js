export const defaultState = () => {
  return {
    token: localStorage.getItem("auth") || null,
    status: ""
  };
};

export const state = defaultState();
