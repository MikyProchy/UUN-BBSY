import { Request } from "express";
import { removeItem } from "../removeItem";
import List from "../../../../schemas/List";
import { createMockRes } from "../../../../utils/test";

jest.mock("../../../../schemas/List", () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
    },
}));

type FakeItem = { _id: string; name: string };

type FakeList = {
    items: FakeItem[];
    save: jest.Mock;
    toObject: jest.Mock;
};

const mockedList = List as unknown as {
    findById: jest.Mock;
};

describe("removeItem controller", () => {
    it("returns 404 if list not found", async () => {
        const dtoIn = { id: "missing", itemId: "item-1" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findById.mockResolvedValueOnce(null);

        const { res, status, json } = createMockRes();
        await removeItem(req, res);

        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "List not found" });
    });

    it("returns 404 if item not found in list", async () => {
        const dtoIn = { id: "list-1", itemId: "missing" };
        const req = { dtoIn } as unknown as Request;

        const fakeList: FakeList = {
            items: [{ _id: "item-1", name: "Bread" }],
            save: jest.fn(),
            toObject: jest.fn(),
        };

        mockedList.findById.mockResolvedValueOnce(fakeList);

        const { res, status, json } = createMockRes();
        await removeItem(req, res);

        expect(fakeList.items).toHaveLength(1);
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "Item not found" });
        expect(fakeList.save).not.toHaveBeenCalled();
    });

    it("removes item, saves and returns updated list", async () => {
        const dtoIn = { id: "list-1", itemId: "item-1" };
        const req = { dtoIn } as unknown as Request;

        const listObj = {
            _id: "list-1",
            items: [{ _id: "item-2", name: "Milk" }],
        };

        const fakeList: FakeList = {
            items: [
                { _id: "item-1", name: "Bread" },
                { _id: "item-2", name: "Milk" },
            ],
            save: jest.fn().mockResolvedValue(undefined),
            toObject: jest.fn().mockReturnValue(listObj),
        };

        mockedList.findById.mockResolvedValueOnce(fakeList);

        const { res, status, json } = createMockRes();
        await removeItem(req, res);

        expect(fakeList.items).toHaveLength(1);
        expect(fakeList.items[0]._id).toBe("item-2");
        expect(fakeList.save).toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith(listObj);
    });

    it("returns 500 on error", async () => {
        const dtoIn = { id: "list-1", itemId: "item-1" };
        const req = { dtoIn } as unknown as Request;

        mockedList.findById.mockRejectedValueOnce(new Error("DB error"));

        const { res, status, json } = createMockRes();
        await removeItem(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
