import { Manager } from "../../../DB/models/manager.model.js";
import { Meetings } from "../../../DB/models/meeting.model.js";
import { Secertary } from "../../../DB/models/secertary.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import bcryptjs  from 'bcryptjs';
import { Meeting_Manager } from "../../../DB/models/meeting_Manager.model.js";

export const createManagerAccount = asyncHandler(async (req, res, next) => {
  const isSecertary = await Secertary.findByPk(req.params.secertaryId)
  if (!isSecertary) return next(new Error("Secertary Not Found!"))
  
  // Verify that the email address is Unique
  const isSecretariesEmail = await Secertary.findOne({where:{ E_mail:req.body.E_mail }})
  if (isSecretariesEmail) return next(new Error("Email Already Existed!"))

  const isManager = await Manager.findOne({
    where: { E_mail: req.body.E_mail },
  });
  if (isManager) return next(new Error("Email Already Existed !"));
  
  const userExits = await Manager.findOne({
    where: { UserName: req.body.UserName },
  });
  if (userExits) return next(new Error("Username Already Existed !"));
  
  const managerhashPass = bcryptjs.hashSync(
    req.body.PassWord,
    parseInt(process.env.SALT_ROUND)
  );
  
  await Manager.create({
    ...req.body,
    PassWord: managerhashPass,
    secretary_id: req.payload.id,
  });
  
  return res.json({ success: true, message: "Manager Created Successfully" });
  
});

export const createMeeting = async (req, res, next) => {
  let isManager = await Manager.findByPk(req.params.manager_id);
  if (!isManager) return next(new Error("Invalid Manager Id"));

  if (isManager.secretary_id != req.payload.id)
    return next(new Error("You Must Be The Secretary For This Manager Id"));

  let meeting = await Meetings.create({
    ...req.body,
    statues: "not done",
  });
  await Meeting_Manager.create({
    manager_id: isManager.manager_id,
    meeting_id: meeting.dataValues.meeting_id,
  });
  return res.json({ success: true, message: "Meeting created Successfully" });
};
