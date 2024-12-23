import { Router } from "express";
import {
  createJournal,
  deleteJournal,
  getAllJournals,
  getJournal,
  updateJournal,
} from "@controllers/journal/journal.controller";

export const journalRoutes = Router();

journalRoutes.route("/").get(getAllJournals).post(createJournal);
journalRoutes
  .route("/:id")
  .get(getJournal)
  .patch(updateJournal)
  .delete(deleteJournal);
