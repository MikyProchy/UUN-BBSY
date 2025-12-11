import { Request } from "express";
import { deleteList } from "../deleteList";
import List from "../../../../schemas/List";
import { createMockRes } from "../../../../utils/test";

jest.mock("../../../../schemas/List", () => ({
    __esModule: true,
    default: {
        findByIdAndDelete: jest.fn(),
    },
}));

const mockedList = List as unknown as {
    findByIdAndDelete: jest.Mock;
};

describe("deleteList controller", () => {
    it("returns 404 if list not found", async () => {
        const dtoIn = { id: "missing" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findByIdAndDelete.mockResolvedValueOnce(null);

        const { res, status, json } = createMockRes();
        await deleteList(req, res);

        expect(mockedList.findByIdAndDelete).toHaveBeenCalledWith("missing");
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "List not found" });
    });

    it("deletes list and returns 200 with message + id", async () => {
        const dtoIn = { id: "list-1" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findByIdAndDelete.mockResolvedValueOnce({ _id: "list-1" });

        const { res, status, json } = createMockRes();
        await deleteList(req, res);

        expect(mockedList.findByIdAndDelete).toHaveBeenCalledWith("list-1");
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
            message: "List deleted",
            id: "list-1",
        });
    });

    it("returns 500 on error", async () => {
        const dtoIn = { id: "list-1" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findByIdAndDelete.mockRejectedValueOnce(new Error("DB error"));

        const { res, status, json } = createMockRes();
        await deleteList(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
