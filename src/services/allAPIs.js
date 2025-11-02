import commonAPI from "./commonAPI";
import { serverURL } from "./serverURL";

export const addBookAPI = async (bookDetails) =>
  await commonAPI("POST", `${serverURL}/books`, bookDetails);

export const getAllBooksAPI = async () =>
  await commonAPI("GET", `${serverURL}/books`);

export const updateBookAPI = async (id, updatedBook) =>
  await commonAPI("PUT", `${serverURL}/books/${id}`, updatedBook);

export const deleteBookAPI = async (id) =>
  await commonAPI("DELETE", `${serverURL}/books/${id}`);
