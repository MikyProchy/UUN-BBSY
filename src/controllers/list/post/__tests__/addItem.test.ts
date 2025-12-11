import { Request } from "express";
import { addItem } from "../addItem";
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

describe("addItem controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("returns 404 if list not found", async () => {
        const dtoIn = {
            id: "missing",
            item: { itemName: "Milk" },
        };
        const req = { dtoIn } as unknown as Request;

        mockedList.findByIdAndUpdate.mockResolvedValueOnce(null);

        const { res, status, json } = createMockRes();
        await addItem(req, res);

        expect(mockedList.findByIdAndUpdate).toHaveBeenCalledWith(
            "missing",
            {
                $push: {
                    items: expect.objectContaining({
                        itemName: "Milk",
                        completed: false,
                    }),
                },
            },
            { new: true },
        );
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "List not found" });
    });

    it("adds item and returns 200 with updated list", async () => {
        const dtoIn = {
            id: "list-1",
            item: { itemName: "Bread" },
        };
        const req = { dtoIn } as unknown as Request;

        const updatedList = {
            _id: "list-1",
            listName: "Groceries",
            items: [
                { _id: "existing", itemName: "Milk", completed: false },
                { _id: "new-id", itemName: "Bread", completed: false },
            ],
        };

        const fakeDoc = {
            toObject: jest.fn().mockReturnValue(updatedList),
        };

        mockedList.findByIdAndUpdate.mockResolvedValueOnce(fakeDoc);

        const { res, status, json } = createMockRes();
        await addItem(req, res);

        expect(mockedList.findByIdAndUpdate).toHaveBeenCalledWith(
            "list-1",
            {
                $push: {
                    items: expect.objectContaining({
                        itemName: "Bread",
                        completed: false,
                    }),
                },
            },
            { new: true },
        );
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith(updatedList);
    });

    it("returns 500 on error", async () => {
        const dtoIn = {
            id: "list-1",
            item: { itemName: "Bread" },
        };
        const req = { dtoIn } as unknown as Request;

        mockedList.findByIdAndUpdate.mockRejectedValueOnce(new Error("DB error"));

        const { res, status, json } = createMockRes();
        await addItem(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
