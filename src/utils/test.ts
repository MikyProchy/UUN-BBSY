import { Response } from "express";

export const createMockRes = () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as Response;

    return { res, status, json };
};
