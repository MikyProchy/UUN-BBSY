import { Request } from "express";
import { archiveList } from "../archiveList";
import List from "../../../../schemas/List";
import { createMockRes } from "../../../../utils/test";

jest.mock("../../../../schemas/List", () => ({
    __esModule: true,
    default: {
        findByIdAndUpdate: jest.fn(),
    },
}));

const mockedList = List as unknown as {
    findByIdAndUpdate: jest.Mock;
};

describe("archiveList controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns 404 if list not found", async () => {
        const dtoIn = { id: "missing" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findByIdAndUpdate.mockResolvedValueOnce(null);

        const { res, status, json } = createMockRes();
        await archiveList(req, res);

        expect(mockedList.findByIdAndUpdate).toHaveBeenCalledWith(
            "missing",
            { state: "archived" },
            { new: true },
        );
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "List not found" });
    });

    it("archives list and returns 200 with updated list", async () => {
        const dtoIn = { id: "list-1" };
        const req = { dtoIn } as unknown as Request;

        const listObj = {
            _id: "list-1",
            listName: "Groceries",
            state: "archived",
            items: [],
            members: [],
        };

        const fakeDoc = {
            toObject: jest.fn().mockReturnValue(listObj),
        };

        mockedList.findByIdAndUpdate.mockResolvedValueOnce(fakeDoc);

        const { res, status, json } = createMockRes();
        await archiveList(req, res);

        expect(mockedList.findByIdAndUpdate).toHaveBeenCalledWith(
            "list-1",
            { state: "archived" },
            { new: true },
        );
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith(listObj);
    });

    it("returns 500 on error", async () => {
        const dtoIn = { id: "list-1" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findByIdAndUpdate.mockRejectedValueOnce(new Error("DB error"));

        const { res, status, json } = createMockRes();
        await archiveList(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
