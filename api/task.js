import axios from "axios";

const instance = axios.create({
  baseURL: "https://parseapi.back4app.com/classes/",
  headers: {
    "X-Parse-Application-Id": "HcIdVNdpQ09HVB9DyPV5JN00yfQ98w5v69KvQmMC",
    "X-Parse-REST-API-Key": "rADEZBBVDxBgLUtcdGiuwGLz5h0vJ1TRssWkOi8v",
  },
});

export const getTasks = () => instance.get("Task").then((res) => res.data);

export const updateTask = (task) => {
  return instance.put(`/Task/${task.objectId}`, task, {
    headers: { "Content-Type": "application/json" },
  });
};
