import { Request } from "express";
import { getLists } from "../getLists";
import List from "../../../../schemas/List";
import { createMockRes } from "../../../../utils/test";

jest.mock("../../../../schemas/List", () => ({
    __esModule: true,
    default: {
        find: jest.fn(),
    },
}));

const mockedList = List as unknown as {
    find: jest.Mock;
};

describe("getLists controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("filters by state=active when archived is not true", async () => {
        const dtoIn = { archived: false };
        const req = { dtoIn } as unknown as Request;

        const lists = [
            { _id: "list-1", listName: "Groceries", state: "active" },
            { _id: "list-2", listName: "Hardware", state: "active" },
        ];

        const sortMock = jest.fn().mockResolvedValueOnce(lists);
        mockedList.find.mockReturnValueOnce({ sort: sortMock });

        const { res, status, json } = createMockRes();
        await getLists(req, res);

        expect(mockedList.find).toHaveBeenCalledWith({ state: "active" });
        expect(sortMock).toHaveBeenCalledWith({ dateCreated: -1 });

        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
            data: lists,
            count: lists.length,
        });
    });

    it("does NOT filter by state when archived is true", async () => {
        const dtoIn = { archived: true };
        const req = { dtoIn } as unknown as Request;

        const lists = [
            { _id: "list-1", listName: "Groceries", state: "active" },
            { _id: "list-2", listName: "Old list", state: "archived" },
        ];

        const sortMock = jest.fn().mockResolvedValueOnce(lists);
        mockedList.find.mockReturnValueOnce({ sort: sortMock });

        const { res, status, json } = createMockRes();
        await getLists(req, res);

        expect(mockedList.find).toHaveBeenCalledWith({});
        expect(sortMock).toHaveBeenCalledWith({ dateCreated: -1 });

        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
            data: lists,
            count: lists.length,
        });
    });

    it("returns 500 on error", async () => {
        const dtoIn = { archived: false };
        const req = { dtoIn } as unknown as Request;

        const sortMock = jest
            .fn()
            .mockRejectedValueOnce(new Error("DB error"));

        mockedList.find.mockReturnValueOnce({ sort: sortMock });

        const { res, status, json } = createMockRes();
        await getLists(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
