import { Request } from "express";

export interface RequestCustom extends Request {
  user?: {
    id: string;
    email: string;
  };
  query: {
    page?: string;
    limit?: string;
    search?: string;
    startLetter?: string;
  };
  params: {
    word?: string;
  };
}

export {};
