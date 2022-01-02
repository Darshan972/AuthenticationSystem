const express = require("express");
const router = new express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require('multer')
const sharp = require('sharp')

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    //findByCredntials is defined by us in user models
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/users/logout' , auth , async(req,res) =>
{
  try {
    //setting tokens array as the filtered version of itself
    req.user.tokens = req.user.tokens.filter((token) =>
    //token --> obj which has token property and id property 
    {
      //return true if the token we are loooking at isn't that one that used for authentication
      //if false filter out that token
      return token.token !== req.token
    })
    await req.user.save()
    res.send('Login again')
  } catch (error) {
    res.status(500).send()
  }
})

const upload = multer({
  limits: {
  fileSize: 1000000
},fileFilter(req,file,cb)
{
  if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
  {
   return cb(new Error('Please upload in image'))
  }
  cb(undefined , true )
}
})

router.post('/user/me/avatar' ,auth, upload.single('avatar') , async(req,res) =>
{
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250
  }).png().toBuffer()//to BUffer convert this data into buffer
  //buffer contains a buffer of all of the binary data for that file and this is exactly what we want access
  req.user.avatar = buffer
  await req.user.save()
  res.send()
},(error,req,res,next) =>
{
res.status(500).send({error: error.message})
})

router.get('/user/:id/avatar' , async(req,res) =>
{
  try{
   const user = await User.findById(req.params.id)
   if(!user || !user.avatar)
   {
    throw new Error('No user or avatar')
   }
    // set takes two parameters , the name of the response header we're trying to set and the value we're trying to set on it
   res.set('Content-Type' , 'image/png')
   res.send(user.avatar)
  }
  catch(e)
  {
   res.status(404).send()
  }
}) 

router.get("/users/me" ,auth,async (req, res) => {
 res.send(req.user)
});

router.post('/users/logoutAll' , auth , async(req,res) => {
  try{
    //tokens is an array
  req.user.tokens = [] 
await req.user.save()
res.send('Login again to see data')
  }
  catch(e)
{
 res.status(500).send()
}
});

//:id --> route parameters given by express which are part of the url that are used to capture dynamic values

//patch() --> An HTTP method which is esigned to update an excisting resource
router.patch("/users/me",auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    //const user = await User.findById(req.user._id);
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();
    //new : boolean - true to return the modified document rather than the original. defaults to false
    // if true, runs update validators on this command. So if i tried to update name to something non-existent , i want to make sure that it fails

    // if (!user) {
    //   return res.status(404).send();
    // }

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/me/avatar' , auth , async(req,res) =>
{
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.delete("/users/me",auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).send();
    // }
    await req.user.remove()
    res.send(req.user);
  } catch (e) {
    res.status(500).send();d
  }
});

 
    
    module.exports = router;
