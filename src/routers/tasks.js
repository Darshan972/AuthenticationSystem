const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body, //it will copy all of the properties from body over to this object
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//GET /tasks/sortBy=createdAt_asc
//GET /tasks/sortBy=createdAt_desc
//ascending would be 1 and descending would be -1 
//GET /tasks?completed=false
//GET /tasks?completed=true
//GET /tasks?limit=10 
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.completed) {
    //query.completed = true we set match.completd true or if the is anything else we will set this to the value in the req
      match.completed = req.query.completed === 'true'
  }
  if(req.query.sortBy)
  {
    const parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
      await req.user.populate({
          path: 'tasks',
          match,
          options:
          {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
          }
        })
        res.send(req.user.tasks)
    } catch (e) {
      console.log(e)
        res.status(500).send(e)
    }
})

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id; // req gives us access to parameters , which contains all of the route parameters that we provided

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  //The Object.keys() method returns an array of a given object's own enumerable property names, iterated in the same order that a normal loop would.
  // const object1 = {
  //     a: 'somestring',
  //     b: 42,
  //     c: false
  //   };

  //   console.log(Object.keys(object1));
  //   expected output: Array ["a", "b", "c"]

  const updates = Object.keys(req.body); //array
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  ); //boolean

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await findOne({ id: req.params.id, owner: req.user._id });
    //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.params.id,
    });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
