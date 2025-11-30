import { Router } from "express";
import { mockAuth } from "../../middleware/auth";
import { validateDto } from "../../middleware/validateDto";
import {
  addItemDtoIn,
  addMemberDtoIn,
  archiveListDtoIn,
  createListDtoIn,
  deleteListDtoIn,
  getListByIdDtoIn,
  getListsDtoIn,
  leaveListDtoIn,
  removeItemDtoIn,
  removeMemberDtoIn,
  renameListDtoIn,
  restoreArchivedListDtoIn,
  toggleItemStatusDtoIn,
} from "../../schemas/list.schemas";
import { requireProfile } from "../../middleware/requireProfile";
import { getLists } from "../../controllers/list/get/getLists";
import { getListById } from "../../controllers/list/get/getListById";
import { createList } from "../../controllers/list/post/createList";
import { deleteList } from "../../controllers/list/delete/deleteList";
import { archiveList } from "../../controllers/list/patch/archiveList";
import { renameList } from "../../controllers/list/patch/renameList";
import { addItem } from "../../controllers/list/post/addItem";
import { removeItem } from "../../controllers/list/delete/removeItem";
import { toggleItemStatus } from "../../controllers/list/patch/toggleItemStatus";
import { addMember } from "../../controllers/list/post/addMember";
import { removeMember } from "../../controllers/list/delete/removeMember";
import { leaveList } from "../../controllers/list/delete/leaveList";
import { restoreArchivedList } from "../../controllers/list/patch/restoreArchivedList";

const router = Router();

router.use(mockAuth);

// GET
router.get(
  "/",
  validateDto(getListsDtoIn),
  requireProfile("User", "Owner", "Member"),
  getLists,
);

router.get(
  "/:id",
  validateDto(getListByIdDtoIn),
  requireProfile("Owner", "Member"),
  getListById,
);

// POST
router.post(
  "/",
  validateDto(createListDtoIn),
  requireProfile("User", "Owner", "Member"),
  createList,
);

router.post(
  "/:id/items",
  validateDto(addItemDtoIn),
  requireProfile("Owner", "Member"),
  addItem,
);

router.post(
  "/:id/members",
  validateDto(addMemberDtoIn),
  requireProfile("Owner"),
  addMember,
);

// PATCH
router.patch(
  "/:id/archive",
  validateDto(archiveListDtoIn),
  requireProfile("Owner"),
  archiveList,
);

router.patch(
  "/:id/rename",
  validateDto(renameListDtoIn),
  requireProfile("Owner"),
  renameList,
);

router.patch(
  "/:id/items/:itemId/toggle",
  validateDto(toggleItemStatusDtoIn),
  requireProfile("Owner", "Member"),
  toggleItemStatus,
);

router.patch(
  "/:id/restore",
  validateDto(restoreArchivedListDtoIn),
  requireProfile("Owner"),
  restoreArchivedList,
);

// DELETE
router.delete(
  "/:id",
  validateDto(deleteListDtoIn),
  requireProfile("Owner"),
  deleteList,
);

router.delete(
  "/:id/items/:itemId",
  validateDto(removeItemDtoIn),
  requireProfile("Owner", "Member"),
  removeItem,
);

router.delete(
  "/:id/members/:memberId",
  validateDto(removeMemberDtoIn),
  requireProfile("Owner"),
  removeMember,
);

router.delete(
  "/:id/leave",
  validateDto(leaveListDtoIn),
  requireProfile("Member"),
  leaveList,
);

export default router;
