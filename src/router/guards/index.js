import userStore from "../../storage/user.js";

export const isAuthorized = () => {
  return userStore.isAuthorized();
};
