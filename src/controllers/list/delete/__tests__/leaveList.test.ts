import { Request } from "express";
import { leaveList } from "../leaveList";
import List from "../../../../schemas/List";
import { createMockRes } from "../../../../utils/test";

jest.mock("../../../../schemas/List", () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
    },
}));

type FakeList = {
    members: string[];
    save: jest.Mock;
};

const mockedList = List as unknown as {
    findById: jest.Mock;
};

describe("leaveList controller", () => {
    const userId = "current-user";

    const createReq = (dtoIn: any): Request =>
        ({
            dtoIn,
            user: { id: userId },
        } as unknown as Request);

    it("returns 404 if list not found", async () => {
        const req = createReq({ id: "missing" });

        mockedList.findById.mockResolvedValueOnce(null);

        const { res, status, json } = createMockRes();
        await leaveList(req, res);

        expect(mockedList.findById).toHaveBeenCalledWith("missing");
        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: "List not found" });
    });

    it("returns 400 if user is not a member of the list", async () => {
        const req = createReq({ id: "list-1" });

        const fakeList: FakeList = {
            members: ["user-1", "user-2"],
            save: jest.fn(),
        };

        mockedList.findById.mockResolvedValueOnce(fakeList);

        const { res, status, json } = createMockRes();
        await leaveList(req, res);

        expect(status).toHaveBeenCalledWith(400);
        expect(json).toHaveBeenCalledWith({
            message: "User is not a member of this list",
            userId,
        });
        expect(fakeList.save).not.toHaveBeenCalled();
    });

    it("removes the current user and returns 200", async () => {
        const req = createReq({ id: "list-1" });

        const fakeList: FakeList = {
            members: ["user-1", userId, "user-2"],
            save: jest.fn().mockResolvedValue(undefined),
        };

        mockedList.findById.mockResolvedValueOnce(fakeList);

        const { res, status, json } = createMockRes();
        await leaveList(req, res);

        expect(fakeList.members).toEqual(["user-1", "user-2"]);
        expect(fakeList.save).toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
            message: "User removed from list",
            id: "list-1",
            userId,
        });
    });

    it("returns 500 on error", async () => {
        const req = createReq({ id: "list-1" });

        mockedList.findById.mockRejectedValueOnce(new Error("DB error"));

        const { res, status, json } = createMockRes();
        await leaveList(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({
            message: "Internal server error",
        });
    });
});
