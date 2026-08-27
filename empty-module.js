const win = typeof window !== 'undefined' ? window : {};
console.log('empty-module.js: using browser native implementations');
export const FormData = win.FormData;
export const Blob = win.Blob;
export const File = win.File;
export const fetch = win.fetch ? win.fetch.bind(win) : undefined;
export const Request = win.Request;
export const Response = win.Response;
export const Headers = win.Headers;

export default fetch || { FormData, Blob, File, Request, Response, Headers };
