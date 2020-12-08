export const defaultState = () => {
  return {
    projects: false,
    timeline: false,
    animations: window.localStorage.getItem("animations") || !false
  };
};

export const state = defaultState();
