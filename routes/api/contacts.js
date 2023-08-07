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
    const result = await Contact.findById(contactId);
    if (!result) {
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
    const result = await Contact.findByIdAndRemove(contactId);
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
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
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
      const { error } = updateFavoriteSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const { contactId } = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
      });
      if (!result) {
        throw HttpError(404, "Not found");
      }
      res.json(result);
    } catch (error) {}
  }
);

module.exports = router;
