export const defaultState = () => {
  return {
    projects: false,
    timeline: false,
    animations: window.localStorage.getItem("animations") || true
  };
};

export const state = defaultState();
