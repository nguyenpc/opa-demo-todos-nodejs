import axios from "axios";
import Config from "../config";
import { User } from "../models";

export const pdpCall = async (subject: any, data: any, resource: string, action: string) => {
  console.log(data);
  const result = await axios.post(`${Config.opaUri}v1/data/${resource}/${action}`, {
    input: {
      resource: data,
      subject: subject,
    }
  });
  console.log(result.data);
  return result?.data?.result;
};