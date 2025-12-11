import { Request } from "express";
import { getListById } from "../getListById";
import List from "../../../../schemas/List";
import { createMockRes } from "../../../../utils/test";

jest.mock("../../../../schemas/List", () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
    },
}));

const mockedList = List as unknown as {
    findById: jest.Mock;
};

describe("getListById controller", () => {
    it("returns 404 if list not found", async () => {
        const dtoIn = { id: "missing" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findById.mockResolvedValueOnce(null);

        const { res, status, json } = createMockRes();
        await getListById(req, res);

        expect(mockedList.findById).toHaveBeenCalledWith("missing");
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "List not found" });
    });

    it("returns 200 with list when found", async () => {
        const dtoIn = { id: "list-1" };
        const req = { dtoIn } as unknown as Request;

        const listObj = {
            _id: "list-1",
            listName: "Groceries",
            state: "active",
            items: [],
            members: [],
        };

        const fakeDoc = {
            toObject: jest.fn().mockReturnValue(listObj),
        };

        mockedList.findById.mockResolvedValueOnce(fakeDoc);

        const { res, status, json } = createMockRes();
        await getListById(req, res);

        expect(mockedList.findById).toHaveBeenCalledWith("list-1");
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith(listObj);
    });

    it("returns 500 on error", async () => {
        const dtoIn = { id: "list-1" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findById.mockRejectedValueOnce(new Error("DB error"));

        const { res, status, json } = createMockRes();
        await getListById(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
