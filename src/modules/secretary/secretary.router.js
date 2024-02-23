import { Router } from "express";
import * as secretaryController from "./secretary.controller.js";
import * as secretarySchema from "./secretary.schema.js";
import { validation } from "../../middleware/validation.middleware.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadFiles } from "../../utils/multer.js";

const router = Router();

// create-manager
router.post(
  "/create-manager/",
  isAuthenticated,
  isAuthorized("Secertary"),
  validation(secretarySchema.createManagerAccountSchema),
  secretaryController.createManagerAccount
);

router.post(
  "/createMeeting/:manager_id",
  isAuthenticated,
  isAuthorized("Secertary"),
  uploadFiles().single("attachment"),
  validation(secretarySchema.createMeetingSchema),
  asyncHandler(secretaryController.createMeeting)
);

router.get(
  "/getSecManagers",
  isAuthenticated,
  isAuthorized("Secertary"),
  asyncHandler(secretaryController.getSecManagers)
);

router.get(
  "/getSecMeetings",
  isAuthenticated,
  isAuthorized("Secertary"),
  asyncHandler(secretaryController.getSecMeetings)
);

router.get(
  "/getSecMeetings/:meetingId",
  isAuthenticated,
  isAuthorized("Secertary"),
  validation(secretarySchema.meetingDetailsSchema),
  asyncHandler(secretaryController.getSecMeetingsDetails)
);

router.patch(
  "/updateMeeting/:meetingId",
  isAuthenticated,
  isAuthorized("Secertary"),
  validation(secretarySchema.updateMeetingSchema),
  asyncHandler(secretaryController.updateMeeting)
);

router.delete(
  "/deleteMeeting/:meetingId",
  isAuthenticated,
  isAuthorized("Secertary"),
  validation(secretarySchema.deleteMeetingSchema),
  asyncHandler(secretaryController.deleteMeeting)
);


export default router;