const express = require("express");
const authenticate = require("../../middleware/authenticate");

const {
  Contact,
  addSchema,
  updateFavoriteSchema,
} = require("../../models/contact");

const { HttpError } = require("../../helpers");

const { isValidId } = require("../../helpers");

const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const result = await Contact.find({ owner });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authenticate, isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findOne({ _id: contactId });
    if (!result || result.owner.toString() !== req.user._id.toString()) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findOneAndDelete({
      owner: req.user._id,
      _id: contactId,
    });
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json({
      message: "Delete success",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findOneAndUpdate(
      { owner: req.user._id, _id: contactId },
      req.body,
      { new: true }
    );
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const { error } = updateFavoriteSchema.validate(req.body);
      if (error) {
        throw new HttpError(400, error.message);
      }
      const result = await Contact.findOneAndUpdate(
        { owner: req.user._id, _id: contactId },
        req.body,
        { new: true }
      );
      if (!result) {
        throw new HttpError(404, "Not found");
      }
      res.json(result);
    } catch {
      next(HttpError(404, "Not found"));
    }
  }
);

module.exports = router;
